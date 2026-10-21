#!/bin/bash
# Rack Display – Raspberry Pi als Rack-Anzeige einrichten (Kiosk).
#
# Der Pi zeigt nur die Seite „Rack“ von Home Assistant im Vollbild; Daten und Logik kommen aus HA.
# Voraussetzung: Raspberry Pi OS mit Desktop (Bookworm oder Trixie, Oberfläche labwc), Netzwerk zu HA.
#
#   ./pi-kiosk.sh --url http://homeassistant.local:8123/rack [--mode touchkio|browser] [--rotate 90] [--screen-off 5]
#
#   --mode touchkio  (Standard) TouchKio installieren: Kiosk-Browser mit HA-Anbindung über MQTT
#                    (Bildschirm an/aus, Helligkeit, Neu laden, Screenshot als HA-Entitäten).
#                    Die MQTT-Zugangsdaten fragt TouchKio beim ersten Start selbst ab.
#   --mode browser   nur Chromium im Vollbild, ohne HA-Steuerung des Bildschirms.
#   --rotate N       Bildschirm drehen (0, 90, 180, 270), z. B. 90 für das 7"-Display hochkant.
#   --screen-off M   nur bei --mode browser: Bildschirm nach M Minuten ohne Berührung aus (0 = nie).
#                    Bei TouchKio schaltet HA den Bildschirm (Automation über light.touchkio_…_display).
#
# Anmelden an HA: beim ersten Start einmal am Display anmelden (am besten mit einem eigenen,
# nicht-administrativen Benutzer „Rack“), oder in HA „trusted_networks“ für die IP des Pi einrichten.
# In der Rack-Anzeige lässt sich die Sprache pro Rack fest einstellen (Editor → Anzeige → Sprache),
# falls der Kiosk-Benutzer in HA eine andere Sprache hat.

set -euo pipefail

URL="" MODE="touchkio" ROTATE="" SCREEN_OFF=5
while [ $# -gt 0 ]; do
  case "$1" in
    --url) URL="$2"; shift 2;;
    --mode) MODE="$2"; shift 2;;
    --rotate) ROTATE="$2"; shift 2;;
    --screen-off) SCREEN_OFF="$2"; shift 2;;
    -h|--help) sed -n '2,22p' "$0"; exit 0;;
    *) echo "Unbekannte Option: $1"; exit 1;;
  esac
done
[ -n "$URL" ] || { echo "Bitte --url angeben, z. B. --url http://homeassistant.local:8123/rack"; exit 1; }
[[ "$MODE" == "touchkio" || "$MODE" == "browser" ]] || { echo "--mode muss touchkio oder browser sein"; exit 1; }
[ "$(id -u)" -ne 0 ] || { echo "Bitte als normaler Benutzer starten (nicht mit sudo) – sudo wird bei Bedarf selbst aufgerufen."; exit 1; }
command -v labwc >/dev/null || { echo "labwc nicht gefunden – bitte Raspberry Pi OS mit Desktop verwenden."; exit 1; }

AUTOSTART="$HOME/.config/labwc/autostart"
mkdir -p "$(dirname "$AUTOSTART")"
touch "$AUTOSTART"
# Eigener Abschnitt im Autostart, bei erneutem Aufruf wird er ersetzt
sed -i '/# >>> rack-display/,/# <<< rack-display/d' "$AUTOSTART"

echo "• Pakete installieren"
sudo apt-get update -qq
sudo apt-get install -y -qq wlr-randr swayidle wlopm curl >/dev/null

echo "• Automatisch am Desktop anmelden, Bildschirmschoner aus"
if command -v raspi-config >/dev/null; then
  sudo raspi-config nonint do_boot_behaviour B4 || true
  sudo raspi-config nonint do_blanking 1 || true
fi

{
  echo "# >>> rack-display (von pi-kiosk.sh angelegt)"
  if [ -n "$ROTATE" ] && [ "$ROTATE" != "0" ]; then
    # erste angeschlossene Ausgabe drehen (DSI-1, HDMI-A-1 …)
    echo "wlr-randr --output \"\$(wlr-randr | awk '/^[A-Z]/{print \$1; exit}')\" --transform $ROTATE &"
  fi
  if [ "$MODE" = "browser" ]; then
    BROWSER=$(command -v chromium || command -v chromium-browser || true)
    echo "\"${BROWSER:-chromium}\" --kiosk --noerrdialogs --disable-infobars --no-first-run --password-store=basic --ozone-platform=wayland --check-for-update-interval=31536000 \"$URL\" &"
    if [ "$SCREEN_OFF" -gt 0 ] 2>/dev/null; then
      echo "swayidle -w timeout $((SCREEN_OFF * 60)) 'wlopm --off \"*\"' resume 'wlopm --on \"*\"' &"
    fi
  fi
  echo "# <<< rack-display"
} >> "$AUTOSTART"

if [ "$MODE" = "browser" ]; then
  if ! command -v chromium >/dev/null && ! command -v chromium-browser >/dev/null; then
    sudo apt-get install -y -qq chromium >/dev/null || sudo apt-get install -y -qq chromium-browser >/dev/null
  fi
  echo "✓ Fertig. Nach einem Neustart zeigt der Pi $URL im Vollbild."
  echo "  Beim ersten Start einmal in HA anmelden (Benutzer „Rack“ empfohlen)."
  exit 0
fi

echo "• TouchKio installieren (github.com/leukipp/touchkio)"
if ! command -v touchkio >/dev/null; then
  ARCH=$(dpkg --print-architecture)
  DEB_URL=$(curl -fsSL https://api.github.com/repos/leukipp/touchkio/releases/latest | grep -o "https://[^\"]*_${ARCH}\.deb" | head -1)
  [ -n "$DEB_URL" ] || { echo "Kein TouchKio-Paket für $ARCH gefunden."; exit 1; }
  TMP=$(mktemp -d); curl -fsSL "$DEB_URL" -o "$TMP/touchkio.deb"
  sudo apt-get install -y -qq "$TMP/touchkio.deb" >/dev/null; rm -rf "$TMP"
fi

echo "• TouchKio einrichten – die Fragen (Adresse, MQTT) bitte am Bildschirm/Terminal beantworten."
echo "  Als Web-Adresse: $URL"
touchkio --setup || true

echo "• TouchKio als Dienst starten"
mkdir -p "$HOME/.config/systemd/user"
cat > "$HOME/.config/systemd/user/touchkio.service" <<EOF
[Unit]
Description=TouchKio (Rack Display)
After=graphical.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/touchkio
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
systemctl --user enable touchkio.service >/dev/null
sudo loginctl enable-linger "$USER" >/dev/null 2>&1 || true

cat <<EOF
✓ Fertig. Nach einem Neustart zeigt der Pi $URL über TouchKio.
  In HA erscheint das Gerät „TouchKio …“ (über MQTT) mit light.touchkio_…_display.
  Bildschirm nach ${SCREEN_OFF} Minuten ohne Berührung aus: Automation in HA, z. B.
    trigger: sensor.touchkio_<name>_last_active über $((SCREEN_OFF - 1)) Minuten
    action:  light.turn_off → light.touchkio_<name>_display
EOF
