"""Rack storage, photo clean-up and removal of devices of deleted racks."""

from __future__ import annotations

from collections.abc import AsyncGenerator
import os
from pathlib import Path
import time
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
import voluptuous as vol

from custom_components.rack_display import remove_stale_devices
from custom_components.rack_display.const import DOMAIN
from custom_components.rack_display.http import remove_unused_images
from custom_components.rack_display.storage import RackStore


@pytest.fixture
async def store(hass: HomeAssistant, hass_storage: dict[str, Any]) -> AsyncGenerator[RackStore]:
    """Rack store on mocked storage; pending writes are flushed at the end."""
    rack_store = RackStore(hass)
    yield rack_store
    await rack_store.async_flush()


def _rack(*devices: dict[str, Any], units: int = 12) -> dict[str, Any]:
    return {"id": "rack", "name": "Rack", "units": units, "devices": list(devices)}


def _device(name: str, u: int, h: int = 1, **extra: Any) -> dict[str, Any]:
    return {"id": name, "name": name, "template": "server", "u": u, "h": h, **extra}


async def test_save_fills_defaults(store: RackStore) -> None:
    saved = store.save({"name": "Rack", "devices": [_device("srv", 1)]})

    assert saved["id"]
    assert saved["units"] == 42
    assert saved["entities"] is True
    assert saved["devices"][0]["side"] == "front"
    assert saved["devices"][0]["blocks"]
    assert store.get(saved["id"]) == saved
    assert store.list() == [saved]


async def test_returned_racks_are_copies(store: RackStore) -> None:
    store.save(_rack(_device("srv", 1)))

    store.get("rack")["name"] = "changed"

    assert store.get("rack")["name"] == "Rack"


async def test_units_must_not_overlap(store: RackStore) -> None:
    with pytest.raises(vol.Invalid):
        store.save(_rack(_device("a", 1, 2), _device("b", 2)))
    assert store.get("rack") is None

    store.save(_rack(_device("a", 1, 2), _device("b", 3)))


async def test_device_must_fit_into_the_rack(store: RackStore) -> None:
    with pytest.raises(vol.Invalid):
        store.save(_rack(_device("a", 12, 2)))


async def test_rear_devices_do_not_use_units(store: RackStore) -> None:
    store.save(_rack(_device("a", 1), _device("pdu", 1, template="pdu", side="rear0u")))


async def test_delete(store: RackStore) -> None:
    store.save(_rack())

    assert store.delete("rack") is True
    assert store.delete("rack") is False
    assert store.list() == []


def test_remove_unused_images(tmp_path: Path) -> None:
    old = time.time() - 3 * 86400
    for name, mtime in (("used.jpg", old), ("unused.png", old), ("fresh.webp", None), ("notes.txt", old)):
        (tmp_path / name).write_bytes(b"x")
        if mtime:
            os.utime(tmp_path / name, (mtime, mtime))

    removed = remove_unused_images(tmp_path, '{"front_image": "/rack_display/images/used.jpg"}')

    assert removed == ["unused.png"]
    assert sorted(p.name for p in tmp_path.iterdir()) == ["fresh.webp", "notes.txt", "used.jpg"]


async def test_remove_stale_devices(hass: HomeAssistant, device_registry: dr.DeviceRegistry) -> None:
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    for rack_id in ("kept", "deleted"):
        device_registry.async_get_or_create(config_entry_id=entry.entry_id, identifiers={(DOMAIN, rack_id)})

    remove_stale_devices(hass, entry, {"kept"})

    assert device_registry.async_get_device(identifiers={(DOMAIN, "kept")}) is not None
    assert device_registry.async_get_device(identifiers={(DOMAIN, "deleted")}) is None
