"""Shared helpers for the Cosa Thermostat integration."""
from __future__ import annotations

import logging
from typing import Any
import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    API_BASE_URL,
    AC_STATE_OFF,
    AC_STATE_DRY,
    AC_STATE_VENTILATION,
    AC_MODE_COOLING,
    AC_MODE_HEATING,
    AC_FAN_MODES,
)

_LOGGER = logging.getLogger(__name__)


def has_ac_support(endpoint: dict[str, Any]) -> bool:
    """Return True if the endpoint controls an air conditioner (IR remote)."""
    ac_settings = endpoint.get("acSettings") or {}
    return bool(
        ac_settings.get("acDeviceType")
        or ac_settings.get("remoteBrand")
        or endpoint.get("acState") is not None
    )


def parse_ac_state(raw: str | None) -> tuple[str, str | None, float | None] | None:
    """Parse an acState string into (mode, fan, temperature).

    Observed values: "off", "dry", "ventilation",
    "cooling_<fan>_<temp>" and "heating_<fan>_<temp>"
    where fan is one of auto/low/medium/high.
    """
    if not raw or raw == AC_STATE_OFF:
        return (AC_STATE_OFF, None, None)
    if raw == AC_STATE_DRY:
        return (AC_STATE_DRY, None, None)
    if raw == AC_STATE_VENTILATION:
        return (AC_STATE_VENTILATION, None, None)

    parts = raw.split("_")
    if len(parts) == 3 and parts[0] in (AC_MODE_COOLING, AC_MODE_HEATING) and parts[1] in AC_FAN_MODES:
        try:
            return (parts[0], parts[1], float(parts[2]))
        except ValueError:
            return None
    return None


async def async_api_post(
    hass: HomeAssistant, auth_token: str, path: str, data: dict[str, Any]
) -> bool:
    """POST to the Cosa API, return True on HTTP 200."""
    session = async_get_clientsession(hass)
    headers = {
        "authToken": auth_token,
        "Content-Type": "application/json",
    }
    url = f"{API_BASE_URL}{path}"
    try:
        async with session.post(url, headers=headers, json=data, timeout=aiohttp.ClientTimeout(total=15)) as response:
            if response.status == 200:
                return True
            response_text = await response.text()
            _LOGGER.error(
                "API call %s failed. Status: %s, Response: %s",
                path,
                response.status,
                response_text,
            )
    except aiohttp.ClientError as ex:
        _LOGGER.error("Network error on API call %s: %s", path, ex)
    except Exception as ex:
        _LOGGER.exception("Unexpected error on API call %s: %s", path, ex)
    return False
