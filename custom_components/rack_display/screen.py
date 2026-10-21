"""Bildschirm der Rack-Anzeige (TouchKio) nach X Minuten ohne Berührung ausschalten.

Rack → Anzeige → „Bildschirm“ (light.touchkio_<name>_display) und „Ausschalten nach“ (Minuten, 0 = nie).
Die Berührungszeit liefert TouchKio als sensor.touchkio_<name>_last_active (Minuten seit der letzten Berührung).
Eine Berührung schaltet den Bildschirm wieder ein (TouchKio).
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_time_interval

from .const import SIGNAL_UPDATED


def _idle_sensor(light_id: str) -> str:
    # light.touchkio_rack_display → sensor.touchkio_rack_last_active
    obj = light_id.split(".", 1)[1]
    return f"sensor.{obj[: -len('_display')] if obj.endswith('_display') else obj}_last_active"


class ScreenTimeout:
    def __init__(self, hass: HomeAssistant, store) -> None:
        self.hass, self.store = hass, store
        self._targets: list[tuple[str, str, float]] = []
        self._unsubs: list = []

    @callback
    def start(self) -> None:
        self._load()
        self._unsubs.append(async_dispatcher_connect(self.hass, SIGNAL_UPDATED, lambda _r: self._load()))
        self._unsubs.append(async_track_time_interval(self.hass, self._check, timedelta(seconds=30)))

    @callback
    def stop(self) -> None:
        for u in self._unsubs:
            u()
        self._unsubs = []

    @callback
    def _load(self) -> None:
        self._targets = []
        for rack in self.store.list():
            scr = (rack.get("display") or {}).get("screen") or {}
            light, minutes = scr.get("light"), float(scr.get("off_after") or 0)
            if light and minutes > 0:
                self._targets.append((light, scr.get("idle") or _idle_sensor(light), minutes))

    async def _check(self, _now=None) -> None:
        for light, idle, minutes in self._targets:
            ls, ids = self.hass.states.get(light), self.hass.states.get(idle)
            if not ls or ls.state != "on" or not ids:
                continue
            try:
                if float(ids.state) >= minutes:
                    await self.hass.services.async_call("light", "turn_off", {"entity_id": light}, blocking=False)
            except (TypeError, ValueError):
                continue
