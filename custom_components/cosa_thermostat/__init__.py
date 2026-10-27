"""The Cosa Smart Thermostat integration."""
from __future__ import annotations

from datetime import timedelta
import logging
from pathlib import Path
from typing import Any
import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform, EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import (
    DOMAIN,
    PLATFORMS,
    API_BASE_URL,
    API_GET_ENDPOINT,
    FRONTEND_URL_BASE,
)

_LOGGER = logging.getLogger(__name__)
UPDATE_INTERVAL = timedelta(seconds=12)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def _register_lovelace_resource(hass: HomeAssistant, card_url: str) -> None:
    """Register card as a Lovelace resource so Lovelace awaits it on page load."""
    try:
        lovelace = hass.data.get("lovelace")
        if not lovelace:
            return

        resources = getattr(lovelace, "resources", None)
        if not resources:
            return

        # If resources is a ResourceStorageCollection, ensure it's loaded
        if hasattr(resources, "loaded") and not resources.loaded:
            if hasattr(resources, "async_load"):
                try:
                    await resources.async_load()
                except Exception as err:
                    _LOGGER.debug("Could not async_load lovelace resources: %s", err)

        # Check existing items
        if hasattr(resources, "async_items"):
            existing_items = resources.async_items()
            card_base = f"{FRONTEND_URL_BASE}/cosa-thermostat-card.js"
            for item in existing_items:
                item_url = item.get("url", "")
                if item_url == card_url:
                    return
                if item_url.startswith(card_base):
                    if hasattr(resources, "async_update_item"):
                        await resources.async_update_item(item["id"], {"res_type": "module", "url": card_url})
                        _LOGGER.info("Updated Cosa Thermostat Lovelace resource to %s", card_url)
                    return

            if hasattr(resources, "async_create_item"):
                await resources.async_create_item({
                    "res_type": "module",
                    "url": card_url,
                })
                _LOGGER.info("Auto-registered Cosa Thermostat as Lovelace resource: %s", card_url)
    except Exception as err:
        _LOGGER.debug("Note on auto-registering Lovelace resource: %s", err)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up the Cosa Thermostat component and register frontend card resource."""
    hass.data.setdefault(DOMAIN, {})

    # Register frontend Lovelace card static path
    frontend_path = Path(__file__).parent / "frontend"
    if frontend_path.exists():
        try:
            # Home Assistant modern StaticPathConfig API (2023.7+)
            if hasattr(hass.http, "async_register_static_paths"):
                from homeassistant.components.http import StaticPathConfig

                await hass.http.async_register_static_paths(
                    [
                        StaticPathConfig(
                            url_path=FRONTEND_URL_BASE,
                            path=str(frontend_path),
                            cache_headers=True,
                        )
                    ]
                )
            elif hasattr(hass.http, "register_static_path"):
                # Fallback for earlier versions
                hass.http.register_static_path(
                    FRONTEND_URL_BASE,
                    str(frontend_path),
                    cache_headers=True,
                )
            
            # Automatically load the card in the frontend so it appears in Topluluk Kartları!
            card_url = f"{FRONTEND_URL_BASE}/cosa-thermostat-card.js?v=1.0.8"
            try:
                from homeassistant.components import frontend
                frontend.add_extra_js_url(hass, card_url)
                _LOGGER.info("Registered and injected Cosa Thermostat card into frontend at %s", card_url)
            except Exception as err:
                _LOGGER.debug("Note on add_extra_js_url: %s", err)

            # Auto-register in Lovelace resources to prevent F5 race condition
            await _register_lovelace_resource(hass, card_url)

            async def _on_ha_started(_):
                await _register_lovelace_resource(hass, card_url)

            hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _on_ha_started)

            _LOGGER.info("Registered Cosa Thermostat frontend card at %s", FRONTEND_URL_BASE)
        except Exception as err:
            _LOGGER.debug("Note on static path registration: %s", err)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Cosa Thermostat from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    device_id = entry.data["device_id"]
    auth_token = entry.data["auth_token"]

    async def async_update_data() -> dict[str, Any]:
        """Fetch real-time data from Cosa API endpoint."""
        session = async_get_clientsession(hass)
        headers = {
            "authToken": auth_token,
            "Content-Type": "application/json",
        }

        try:
            async with session.post(
                f"{API_BASE_URL}{API_GET_ENDPOINT}",
                headers=headers,
                json={"endpoint": device_id},
                timeout=aiohttp.ClientTimeout(total=15),
            ) as response:
                if response.status != 200:
                    resp_text = await response.text()
                    _LOGGER.error(
                        "Error fetching Cosa device %s data: status %s, %s",
                        device_id,
                        response.status,
                        resp_text,
                    )
                    raise UpdateFailed(f"Cosa API error HTTP {response.status}")

                data = await response.json()
                return data

        except aiohttp.ClientError as err:
            raise UpdateFailed(f"Connection failed: {err}") from err
        except Exception as err:
            raise UpdateFailed(f"Unexpected error: {err}") from err

    coordinator = DataUpdateCoordinator(
        hass,
        _LOGGER,
        name=f"Cosa Thermostat ({device_id})",
        update_method=async_update_data,
        update_interval=UPDATE_INTERVAL,
    )

    # Initial data refresh
    await coordinator.async_config_entry_first_refresh()

    hass.data[DOMAIN][entry.entry_id] = coordinator

    # Forward entry setups to climate and sensor platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Cosa Thermostat config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)

    return unload_ok
