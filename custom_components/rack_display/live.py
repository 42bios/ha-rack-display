"""Live-Puffer für schnell wechselnde Werte (Port-Durchsatz).

Diese Sensoren werden nicht aufgezeichnet (Recorder-Ausschluss). Damit eine Live-Kurve beim Öffnen
sofort gefüllt ist, merkt sich die Integration die letzten Messwerte im Arbeitsspeicher.
"""

from __future__ import annotations

from collections import deque
from typing import Any

from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_state_change_event

from .const import SIGNAL_UPDATED
from .mapping import resolve

MAX_POINTS = 120


class LiveBuffer:
    def __init__(self, hass: HomeAssistant, store) -> None:
        self.hass = hass
        self.store = store
        self.data: dict[str, deque] = {}
        self._unsub_track = None
        self._unsub_signal = None

    @callback
    def start(self) -> None:
        self._refresh()
        self._unsub_signal = async_dispatcher_connect(self.hass, SIGNAL_UPDATED, lambda _rack_id: self._refresh())

    @callback
    def stop(self) -> None:
        for unsub in (self._unsub_track, self._unsub_signal):
            if unsub:
                unsub()
        self._unsub_track = self._unsub_signal = None

    @callback
    def _refresh(self) -> None:
        """Beobachtete Entitäten aus allen Racks neu bestimmen."""
        ids: set[str] = set()
        for rack in self.store.list():
            for dev in rack.get("devices", []):
                if not dev.get("ha_devices"):
                    continue
                m = resolve(self.hass, dev["ha_devices"], dev.get("roles"))
                for port in m["ports"]:
                    ids.update(v for k, v in port.items() if k in ("rx", "tx"))
        if self._unsub_track:
            self._unsub_track()
        for eid in list(self.data):
            if eid not in ids:
                del self.data[eid]
        for eid in ids:
            buf = self.data.setdefault(eid, deque(maxlen=MAX_POINTS))
            if not buf and (state := self.hass.states.get(eid)):
                self._add(eid, state)
        self._unsub_track = async_track_state_change_event(self.hass, list(ids), self._changed) if ids else None

    @callback
    def _changed(self, event: Event[EventStateChangedData]) -> None:
        if state := event.data["new_state"]:
            self._add(event.data["entity_id"], state)

    def _add(self, eid: str, state) -> None:
        try:
            value = float(state.state)
        except ValueError:
            return
        self.data.setdefault(eid, deque(maxlen=MAX_POINTS)).append((state.last_updated.timestamp(), value))

    def get(self, entity_ids: list[str]) -> dict[str, list[Any]]:
        return {eid: list(self.data.get(eid, ())) for eid in entity_ids}
