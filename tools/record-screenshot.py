"""Record the rack display as an animated PNG (APNG) for the README – Chrome DevTools protocol, standard library + Pillow.

python3 tools/record-screenshot.py <url> <out.png> [--select <device id>] [--frames 30] [--fps 10] [--width 600]
                                   [--steps "1.5 click #doorOpen; 3 click #sideRear; 4.5 select ups; 6 back"]

--steps: actions at seconds after the recording starts – "click <css selector>" (inside the display),
"select <device id>" (open a popup), "back" (back to the overview).

<url> is a page that shows the display (a `rack-display-panel` element), e.g. a local test page with sample data.
"""
import argparse, base64, io, json, os, random, socket, struct, subprocess, sys, tempfile, time, urllib.request

from PIL import Image

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


class WS:
    """Minimal WebSocket client (text frames, client masking)."""

    def __init__(self, url):
        host, rest = url[len("ws://"):].split("/", 1)
        h, p = host.split(":")
        self.s = socket.create_connection((h, int(p)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall(f"GET /{rest} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n".encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        self.rest = buf.split(b"\r\n\r\n", 1)[1]
        self.n = 0

    def _read(self, n):
        while len(self.rest) < n:
            chunk = self.s.recv(1 << 20)
            if not chunk:
                raise EOFError
            self.rest += chunk
        out, self.rest = self.rest[:n], self.rest[n:]
        return out

    def send(self, obj):
        data = json.dumps(obj).encode()
        hdr = bytearray([0x81])
        ln = len(data)
        if ln < 126:
            hdr.append(0x80 | ln)
        elif ln < 65536:
            hdr += bytes([0x80 | 126]) + struct.pack(">H", ln)
        else:
            hdr += bytes([0x80 | 127]) + struct.pack(">Q", ln)
        mask = os.urandom(4)
        self.s.sendall(bytes(hdr) + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def recv(self):
        msg = b""
        while True:
            b1, b2 = self._read(2)
            ln = b2 & 0x7F
            if ln == 126:
                ln = struct.unpack(">H", self._read(2))[0]
            elif ln == 127:
                ln = struct.unpack(">Q", self._read(8))[0]
            msg += self._read(ln)
            if b1 & 0x80:
                return json.loads(msg)

    def call(self, method, **params):
        self.n += 1
        self.send({"id": self.n, "method": method, "params": params})
        while True:
            r = self.recv()
            if r.get("id") == self.n:
                if "error" in r:
                    raise RuntimeError(r["error"])
                return r.get("result", {})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url"); ap.add_argument("out")
    ap.add_argument("--select"); ap.add_argument("--frames", type=int, default=30)
    ap.add_argument("--fps", type=float, default=10); ap.add_argument("--width", type=int, default=600)
    ap.add_argument("--wait", type=float, default=5)
    ap.add_argument("--steps", default="")
    ap.add_argument("--size", default="480x800", help="viewport in CSS pixels, e.g. 1440x900")
    ap.add_argument("--scale", type=float, default=2)
    a = ap.parse_args()
    port = random.randint(9300, 9500)
    prof = tempfile.mkdtemp()
    chrome = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--remote-debugging-port={port}", f"--user-data-dir={prof}",
                               "--window-size=480,800", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json"))
                page = next(t for t in tabs if t.get("type") == "page")
                break
            except Exception:
                time.sleep(0.2)
        ws = WS(page["webSocketDebuggerUrl"])
        vw, vh = (int(x) for x in a.size.split("x"))
        ws.call("Emulation.setDeviceMetricsOverride", width=vw, height=vh, deviceScaleFactor=a.scale, mobile=False)
        ws.call("Page.enable")
        ws.call("Page.navigate", url=a.url)
        time.sleep(a.wait)
        if a.select:
            ws.call("Runtime.evaluate", expression=f"document.querySelector('rack-display-panel')._app.select({json.dumps(a.select)})")
            time.sleep(2.5)
        steps = []
        for part in filter(None, (x.strip() for x in a.steps.split(";"))):
            t, act, *arg = part.split(" ", 2)
            steps.append((float(t), act, arg[0] if arg else ""))
        js_of = {"click": lambda sel: f"document.querySelector('rack-display-panel').shadowRoot.querySelector({json.dumps(sel)})?.click()",
                 "select": lambda dev: f"document.querySelector('rack-display-panel')._app.select({json.dumps(dev)})",
                 "back": lambda _: "document.querySelector('rack-display-panel').shadowRoot.querySelector('[data-back]')?.click()"}
        frames, t0 = [], time.time()
        for i in range(a.frames):
            target = t0 + i / a.fps
            time.sleep(max(0, target - time.time()))
            while steps and steps[0][0] <= i / a.fps:
                _, act, arg = steps.pop(0)
                ws.call("Runtime.evaluate", expression=js_of[act](arg))
            shot = ws.call("Page.captureScreenshot", format="png", fromSurface=True)
            img = Image.open(io.BytesIO(base64.b64decode(shot["data"]))).convert("RGB")
            frames.append(img.resize((a.width, round(a.width * img.height / img.width)), Image.LANCZOS))
        dur = round(1000 / a.fps)
        if len(frames) == 1:
            frames[0].save(a.out, optimize=True); print(f"{a.out}: {os.path.getsize(a.out) // 1024} KB"); return
        frames[0].save(a.out, save_all=True, append_images=frames[1:], duration=dur, loop=0, optimize=True, format="PNG")
        print(f"{a.out}: {len(frames)} frames, {os.path.getsize(a.out) // 1024} KB")
    finally:
        chrome.terminate()


if __name__ == "__main__":
    main()
