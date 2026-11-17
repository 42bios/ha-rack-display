"""Helpers for the Rack Display tests: devices and entities of other integrations in the registries."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry


class Registry:
    """Creates devices with entities the way another integration would."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.entry = MockConfigEntry(domain="other")
        self.entry.add_to_hass(hass)
        self._n = 0
        self._devices: dict[str, str] = {}

    def device(self, name: str, via: str | None = None) -> str:
        """Registers a device and returns its ID; `via` is the name of the device it is connected through."""
        kwargs = {"via_device_id": self._devices[via]} if via else {}
        device = dr.async_get(self.hass).async_get_or_create(
            config_entry_id=self.entry.entry_id, identifiers={("other", name)}, name=name, **kwargs
        )
        self._devices[name] = device.id
        return device.id

    def entity(self, device_id: str, entity_id: str, state: str | None = "1", device_class: str | None = None) -> str:
        """Registers an entity with exactly this entity ID and sets its state (None = no state)."""
        domain, object_id = entity_id.split(".", 1)
        self._n += 1
        entry = er.async_get(self.hass).async_get_or_create(
            domain,
            "other",
            f"uid-{self._n}",
            config_entry=self.entry,
            device_id=device_id,
            suggested_object_id=object_id,
            original_device_class=device_class,
        )
        assert entry.entity_id == entity_id
        if state is not None:
            self.hass.states.async_set(entity_id, state, {"device_class": device_class} if device_class else {})
        return entity_id


@pytest.fixture
def registry(hass: HomeAssistant) -> Registry:
    return Registry(hass)
