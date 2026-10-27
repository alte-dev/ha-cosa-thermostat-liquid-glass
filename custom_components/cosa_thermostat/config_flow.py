"""Config flow for Cosa Smart Thermostat integration."""
from __future__ import annotations

import logging
from typing import Any
import aiohttp
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_EMAIL, CONF_PASSWORD, CONF_DEVICE_ID
from homeassistant.data_entry_flow import FlowResult
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN, API_BASE_URL, API_LOGIN, API_GET_ENDPOINTS

_LOGGER = logging.getLogger(__name__)


class CosaThermostatConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Cosa Thermostat."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._auth_token: str | None = None
        self._email: str | None = None
        self._password: str | None = None
        self._devices: list[dict[str, Any]] | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial authentication step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            self._email = user_input[CONF_EMAIL]
            self._password = user_input[CONF_PASSWORD]

            try:
                self._auth_token = await self._validate_login(self._email, self._password)
                self._devices = await self._get_devices()

                if not self._devices:
                    errors["base"] = "no_devices"
                else:
                    return await self.async_step_select_device()

            except InvalidAuth:
                errors["base"] = "invalid_auth"
            except CannotConnect:
                errors["base"] = "cannot_connect"
            except Exception:
                _LOGGER.exception("Unexpected exception during Cosa login")
                errors["base"] = "unknown"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_EMAIL): str,
                    vol.Required(CONF_PASSWORD): str,
                }
            ),
            errors=errors,
        )

    async def async_step_select_device(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle endpoint device selection."""
        errors: dict[str, str] = {}

        if user_input is not None and self._devices:
            device_id = user_input[CONF_DEVICE_ID]
            device = next((d for d in self._devices if d.get("id") == device_id), None)

            if device:
                device_name = device.get("name") or device_id
                await self.async_set_unique_id(f"{DOMAIN}_{device_id}")
                self._abort_if_unique_id_configured()

                return self.async_create_entry(
                    title=f"Cosa Thermostat - {device_name}",
                    data={
                        CONF_EMAIL: self._email,
                        CONF_PASSWORD: self._password,
                        CONF_DEVICE_ID: device_id,
                        "device_name": device_name,
                        "auth_token": self._auth_token,
                    },
                )

        device_options = {
            device["id"]: f"{device.get('name', 'Cosa')} ({device['id']})"
            for device in (self._devices or [])
        }

        return self.async_show_form(
            step_id="select_device",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_DEVICE_ID): vol.In(device_options),
                }
            ),
            errors=errors,
        )

    async def _validate_login(self, email: str, password: str) -> str:
        """Validate credentials and return auth token."""
        session = async_get_clientsession(self.hass)
        try:
            async with session.post(
                f"{API_BASE_URL}{API_LOGIN}",
                json={"email": email, "password": password},
                timeout=aiohttp.ClientTimeout(total=15),
            ) as response:
                if response.status != 200:
                    raise InvalidAuth
                data = await response.json()
                auth_token = data.get("authToken")
                if not auth_token:
                    raise InvalidAuth
                return auth_token
        except aiohttp.ClientError as ex:
            raise CannotConnect from ex

    async def _get_devices(self) -> list[dict[str, Any]]:
        """Fetch list of user endpoints/devices."""
        session = async_get_clientsession(self.hass)
        headers = {"authToken": self._auth_token}
        try:
            async with session.get(
                f"{API_BASE_URL}{API_GET_ENDPOINTS}",
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=15),
            ) as response:
                if response.status != 200:
                    raise CannotConnect
                data = await response.json()
                return data.get("endpoints", [])
        except aiohttp.ClientError as ex:
            raise CannotConnect from ex


class CannotConnect(HomeAssistantError):
    """Error to indicate communication failure."""


class InvalidAuth(HomeAssistantError):
    """Error to indicate invalid credentials."""
