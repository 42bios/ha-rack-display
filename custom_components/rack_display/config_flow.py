"""Einrichtung: ein Eintrag genügt, Racks werden danach in der Seite „Rack“ angelegt."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback

from .const import DOMAIN


class RackDisplayConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="Rack Display", data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return RackDisplayOptionsFlow()


class RackDisplayOptionsFlow(OptionsFlow):
    """„Konfigurieren“ auf der Integrationsseite: führt zum Rack-Editor (eigene Seite mit Drag & Drop)."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data={})
        return self.async_show_form(step_id="init", description_placeholders={"editor": "/rack-editor", "display": "/rack"})
