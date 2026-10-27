"""Climate platform for Cosa Smart Thermostat and Air Conditioner."""
from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.components.climate import (
    ClimateEntity,
    ClimateEntityFeature,
    HVACAction,
    HVACMode,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    ATTR_TEMPERATURE,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from .const import (
    DOMAIN,
    API_BASE_URL,
    API_SET_TARGET_TEMPERATURES,
    API_SET_MODE,
    API_SET_OPTION,
    API_SET_OPERATION_MODE,
    API_SEND_IR_COMMAND,
    OPERATION_MODE_HEATING,
    OPERATION_MODE_COOLING,
    OPERATION_MODE_REMOTE,
    OPTION_FROZEN,
    AC_STATE_OFF,
    AC_STATE_DRY,
    AC_STATE_VENTILATION,
    AC_MODE_COOLING,
    AC_MODE_HEATING,
    AC_FAN_MODES,
    AC_MIN_TEMP,
    AC_MAX_TEMP,
    AC_DEFAULT_TARGET_TEMP,
    AC_PRESET_REMOTE,
    AC_PRESET_MODES,
    AC_THERMOSTAT_MIN_TEMP,
    AC_THERMOSTAT_MAX_TEMP,
    AC_THERMOSTAT_TEMP_STEP,
    COMBI_MIN_TEMP,
    COMBI_MAX_TEMP,
    COMBI_TEMP_STEP,
)
from .helpers import async_api_post, has_ac_support, parse_ac_state

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Cosa Thermostat climate entities."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]
    device_id = config_entry.data["device_id"]
    auth_token = config_entry.data["auth_token"]

    config_data = {
        "device_id": device_id,
        "auth_token": auth_token,
    }

    entities: list[ClimateEntity] = [
        CosaThermostat(coordinator=coordinator, config_data=config_data)
    ]

    endpoint = (coordinator.data or {}).get("endpoint", {})
    if has_ac_support(endpoint):
        _LOGGER.info("Device has AC capabilities; adding CosaAirConditioner entity")
        entities.append(
            CosaAirConditioner(coordinator=coordinator, config_data=config_data)
        )

    async_add_entities(entities, False)


class CosaThermostat(CoordinatorEntity, ClimateEntity):
    """Representation of the Cosa Combi/Boiler heating thermostat."""

    _attr_has_entity_name = True
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_precision = COMBI_TEMP_STEP
    _attr_min_temp = COMBI_MIN_TEMP
    _attr_max_temp = COMBI_MAX_TEMP
    _attr_target_temperature_step = COMBI_TEMP_STEP
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    _attr_preset_modes = ["home", "sleep", "away", "custom", "auto", "schedule"]
    _attr_translation_key = "cosa_thermostat"
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.PRESET_MODE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )

    def __init__(self, coordinator: DataUpdateCoordinator, config_data: dict[str, Any]) -> None:
        """Initialize the thermostat."""
        super().__init__(coordinator)
        self._device_id = config_data["device_id"]
        self._auth_token = config_data["auth_token"]

        endpoint_data = (self.coordinator.data or {}).get("endpoint", {})
        device_name = endpoint_data.get("name")
        self._attr_unique_id = f"{DOMAIN}_{self._device_id}"
        self._attr_name = device_name or f"Cosa Thermostat {self._device_id}"

        self._target_temperatures: dict[str, float | None] = {
            "home": None,
            "away": None,
            "sleep": None,
            "custom": None,
        }
        self._attr_target_temperature = None
        self._attr_current_temperature = None
        self._attr_current_humidity = None
        self._attr_hvac_mode = HVACMode.OFF
        self._attr_hvac_action = HVACAction.OFF
        self._attr_preset_mode = "home"
        self._attr_previous_preset_mode = "home"
        self._attr_previous_hvac_mode = HVACMode.OFF

        self._VALID_OPTIONS = ["frozen", "home", "sleep", "away", "custom", "auto", "schedule"]
        self._VALID_MODES = ["manual", "auto", "schedule"]

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success

    @property
    def current_temperature(self) -> float | None:
        """Return the current ambient temperature."""
        return self._attr_current_temperature

    @property
    def current_humidity(self) -> float | None:
        """Return the current ambient humidity."""
        return self._attr_current_humidity

    @property
    def target_temperature(self) -> float | None:
        """Return the target temperature setpoint."""
        return self._attr_target_temperature

    @property
    def hvac_mode(self) -> HVACMode:
        """Return current HVAC mode (heat or off)."""
        return self._attr_hvac_mode

    @property
    def hvac_action(self) -> HVACAction:
        """Return current HVAC running action (heating, idle, or off)."""
        return self._attr_hvac_action

    @property
    def preset_mode(self) -> str:
        """Return current preset mode."""
        return self._attr_preset_mode

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        endpoint = (self.coordinator.data or {}).get("endpoint", {})
        return {
            "combi_state": endpoint.get("combiState", "unknown"),
            "operation_mode": endpoint.get("operationMode", "unknown"),
            "home_temperature": self._target_temperatures.get("home"),
            "away_temperature": self._target_temperatures.get("away"),
            "sleep_temperature": self._target_temperatures.get("sleep"),
            "custom_temperature": self._target_temperatures.get("custom"),
        }

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        if not self.coordinator.data:
            return

        endpoint = self.coordinator.data.get("endpoint", {})
        if not endpoint:
            return

        if device_name := endpoint.get("name"):
            self._attr_name = device_name

        self._target_temperatures = {
            "home": endpoint.get("homeTemperature"),
            "away": endpoint.get("awayTemperature"),
            "sleep": endpoint.get("sleepTemperature"),
            "custom": endpoint.get("customTemperature"),
        }

        self._attr_current_temperature = endpoint.get("temperature")
        self._attr_current_humidity = endpoint.get("humidity")

        current_option = endpoint.get("option")
        current_mode = endpoint.get("mode")
        current_operation_mode = endpoint.get("operationMode")

        # If frozen or not in heating operation mode, Combi is considered OFF
        if current_option == OPTION_FROZEN or (
            current_operation_mode is not None
            and current_operation_mode != OPERATION_MODE_HEATING
        ):
            self._attr_hvac_mode = HVACMode.OFF
            self._attr_hvac_action = HVACAction.OFF
        else:
            if current_mode == "auto":
                self._attr_hvac_mode = HVACMode.HEAT
                self._attr_preset_mode = "auto"
            elif current_mode == "manual":
                self._attr_hvac_mode = HVACMode.HEAT
                if current_option in self._attr_preset_modes:
                    self._attr_preset_mode = current_option
            elif current_mode == "schedule":
                self._attr_hvac_mode = HVACMode.HEAT
                self._attr_preset_mode = "schedule"

        previous_option = endpoint.get("previousOption")
        if previous_option and previous_option != OPTION_FROZEN:
            self._attr_previous_preset_mode = previous_option

        # Determine combi flame state
        combi_state = endpoint.get("combiState")
        if self._attr_hvac_mode == HVACMode.OFF:
            self._attr_hvac_action = HVACAction.OFF
        elif current_operation_mode == OPERATION_MODE_HEATING and combi_state == "on":
            self._attr_hvac_action = HVACAction.HEATING
        else:
            self._attr_hvac_action = HVACAction.IDLE

        # Set active preset target temperature
        if current_option in self._target_temperatures:
            self._attr_target_temperature = self._target_temperatures[current_option]

        self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """When entity is added to hass."""
        await super().async_added_to_hass()
        self._handle_coordinator_update()

    async def _ensure_heating_operation_mode(self) -> None:
        """Switch device to heating mode if it is currently in AC/remote mode."""
        endpoint = (self.coordinator.data or {}).get("endpoint", {})
        operation_mode = endpoint.get("operationMode")
        if operation_mode is not None and operation_mode != OPERATION_MODE_HEATING:
            await async_api_post(
                self.hass,
                self._auth_token,
                API_SET_OPERATION_MODE,
                {"endpoint": self._device_id, "operationMode": OPERATION_MODE_HEATING},
            )

    async def async_set_temperature(self, **kwargs: Any) -> None:
        """Set new target temperature setpoint."""
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is None:
            return

        await self._ensure_heating_operation_mode()
        await self._set_mode("manual")

        current_option = self._attr_preset_mode
        if current_option not in self._target_temperatures:
            current_option = "custom"

        new_temperatures = dict(self._target_temperatures)
        new_temperatures[current_option] = temperature

        # Optimistic local update for instantaneous UI feedback
        self._target_temperatures = new_temperatures
        self._attr_target_temperature = temperature
        self._attr_hvac_mode = HVACMode.HEAT
        self.async_write_ha_state()

        success = await async_api_post(
            self.hass,
            self._auth_token,
            API_SET_TARGET_TEMPERATURES,
            {"endpoint": self._device_id, "targetTemperatures": new_temperatures},
        )

        if success:
            await asyncio.sleep(0.5)
            await self.coordinator.async_request_refresh()

    async def async_set_preset_mode(self, preset_mode: str) -> None:
        """Set new preset mode."""
        if preset_mode not in self._attr_preset_modes:
            _LOGGER.warning("Invalid preset mode requested: %s", preset_mode)
            return

        await self._ensure_heating_operation_mode()

        # Optimistic update
        self._attr_preset_mode = preset_mode
        self._attr_hvac_mode = HVACMode.HEAT
        if preset_mode in self._target_temperatures:
            self._attr_target_temperature = self._target_temperatures[preset_mode]
        self.async_write_ha_state()

        if preset_mode == "auto":
            await self._set_mode("auto")
        elif preset_mode == "schedule":
            await self._set_mode("schedule")
        else:
            await self._set_mode("manual")
            await self._set_option(preset_mode)

        await asyncio.sleep(0.5)
        await self.coordinator.async_request_refresh()

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        """Set new HVAC mode."""
        if hvac_mode == HVACMode.OFF:
            self._attr_hvac_mode = HVACMode.OFF
            self._attr_hvac_action = HVACAction.OFF
            self.async_write_ha_state()
            await self._set_option(OPTION_FROZEN)
        else:
            await self._ensure_heating_operation_mode()
            self._attr_hvac_mode = HVACMode.HEAT
            self.async_write_ha_state()
            target_preset = self._attr_previous_preset_mode or "home"
            if target_preset == "auto":
                await self._set_mode("auto")
            elif target_preset == "schedule":
                await self._set_mode("schedule")
            else:
                await self._set_mode("manual")
                await self._set_option(target_preset)

        await asyncio.sleep(0.5)
        await self.coordinator.async_request_refresh()

    async def _set_mode(self, mode: str) -> bool:
        """Set endpoint mode (manual, auto, schedule)."""
        if mode not in self._VALID_MODES:
            return False
        return await async_api_post(
            self.hass,
            self._auth_token,
            API_SET_MODE,
            {"endpoint": self._device_id, "mode": mode},
        )

    async def _set_option(self, option: str) -> bool:
        """Set endpoint option (frozen, home, away, sleep, custom)."""
        if option not in self._VALID_OPTIONS:
            return False
        return await async_api_post(
            self.hass,
            self._auth_token,
            API_SET_OPTION,
            {"endpoint": self._device_id, "option": option},
        )


class CosaAirConditioner(CoordinatorEntity, ClimateEntity):
    """Cosa IR Air Conditioner entity."""

    _attr_has_entity_name = True
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_precision = 1.0
    _attr_hvac_modes = [
        HVACMode.OFF,
        HVACMode.COOL,
        HVACMode.HEAT,
        HVACMode.DRY,
        HVACMode.FAN_ONLY,
    ]
    _attr_fan_modes = AC_FAN_MODES
    _attr_preset_modes = AC_PRESET_MODES
    _attr_translation_key = "cosa_air_conditioner"
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.FAN_MODE
        | ClimateEntityFeature.PRESET_MODE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )

    def __init__(self, coordinator: DataUpdateCoordinator, config_data: dict[str, Any]) -> None:
        """Initialize the AC entity."""
        super().__init__(coordinator)
        self._device_id = config_data["device_id"]
        self._auth_token = config_data["auth_token"]

        endpoint_data = (self.coordinator.data or {}).get("endpoint", {})
        device_name = endpoint_data.get("name")
        self._attr_unique_id = f"{DOMAIN}_{self._device_id}_ac"
        base_name = device_name or f"Cosa Thermostat {self._device_id}"
        self._attr_name = f"{base_name} AC"

        self._attr_hvac_mode = HVACMode.OFF
        self._attr_hvac_action = HVACAction.OFF
        self._attr_fan_mode = "auto"
        self._attr_target_temperature = AC_DEFAULT_TARGET_TEMP
        self._attr_current_temperature = None
        self._attr_current_humidity = None

        self._last_fan_mode = "auto"
        self._last_target_temp = AC_DEFAULT_TARGET_TEMP
        self._last_active_command: str | None = None

        self._attr_preset_mode = AC_PRESET_REMOTE
        self._target_temperatures: dict[str, float | None] = {
            "home": None,
            "away": None,
            "sleep": None,
            "custom": None,
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success

    @property
    def _is_thermostat_mode(self) -> bool:
        """Check if AC is controlled as thermostat or direct IR remote."""
        return self._attr_preset_mode != AC_PRESET_REMOTE

    @property
    def min_temp(self) -> float:
        """Return minimum temperature."""
        return AC_THERMOSTAT_MIN_TEMP if self._is_thermostat_mode else AC_MIN_TEMP

    @property
    def max_temp(self) -> float:
        """Return maximum temperature."""
        return AC_THERMOSTAT_MAX_TEMP if self._is_thermostat_mode else AC_MAX_TEMP

    @property
    def target_temperature_step(self) -> float:
        """Return step precision."""
        return AC_THERMOSTAT_TEMP_STEP if self._is_thermostat_mode else 1.0

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        endpoint = (self.coordinator.data or {}).get("endpoint", {})
        return {
            "ac_state": endpoint.get("acState", "unknown"),
            "fan_mode": self._attr_fan_mode,
            "operation_mode": endpoint.get("operationMode", "unknown"),
            "remote_brand": (endpoint.get("acSettings") or {}).get("remoteBrand"),
        }

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from coordinator."""
        if not self.coordinator.data:
            return

        endpoint = self.coordinator.data.get("endpoint", {})
        if not endpoint:
            return

        if device_name := endpoint.get("name"):
            self._attr_name = f"{device_name} AC"

        self._attr_current_temperature = endpoint.get("temperature")
        self._attr_current_humidity = endpoint.get("humidity")

        self._target_temperatures = {
            "home": endpoint.get("homeTemperature"),
            "away": endpoint.get("awayTemperature"),
            "sleep": endpoint.get("sleepTemperature"),
            "custom": endpoint.get("customTemperature"),
        }

        operation_mode = endpoint.get("operationMode")
        parsed = parse_ac_state(endpoint.get("acState"))

        if operation_mode == OPERATION_MODE_COOLING:
            current_option = endpoint.get("option", "home")
            self._attr_preset_mode = current_option
            self._attr_hvac_mode = HVACMode.COOL
            self._attr_target_temperature = self._target_temperatures.get(current_option)
            ac_state = endpoint.get("acState")
            if ac_state and ac_state != AC_STATE_OFF:
                self._attr_hvac_action = HVACAction.COOLING
            else:
                self._attr_hvac_action = HVACAction.IDLE
        elif operation_mode == OPERATION_MODE_REMOTE:
            self._attr_preset_mode = AC_PRESET_REMOTE
            if parsed is None or parsed[0] == AC_STATE_OFF:
                self._attr_hvac_mode = HVACMode.OFF
                self._attr_hvac_action = HVACAction.OFF
            else:
                mode_str, fan_str, temp_val = parsed
                if mode_str == AC_MODE_COOLING:
                    self._attr_hvac_mode = HVACMode.COOL
                    self._attr_hvac_action = HVACAction.COOLING
                elif mode_str == AC_MODE_HEATING:
                    self._attr_hvac_mode = HVACMode.HEAT
                    self._attr_hvac_action = HVACAction.HEATING
                elif mode_str == AC_STATE_DRY:
                    self._attr_hvac_mode = HVACMode.DRY
                    self._attr_hvac_action = HVACAction.DRYING
                elif mode_str == AC_STATE_VENTILATION:
                    self._attr_hvac_mode = HVACMode.FAN_ONLY
                    self._attr_hvac_action = HVACAction.FAN

                if fan_str:
                    self._attr_fan_mode = fan_str
                if temp_val is not None:
                    self._attr_target_temperature = temp_val
        else:
            self._attr_hvac_mode = HVACMode.OFF
            self._attr_hvac_action = HVACAction.OFF

        self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """When entity is added to hass."""
        await super().async_added_to_hass()
        self._handle_coordinator_update()

    async def async_set_temperature(self, **kwargs: Any) -> None:
        """Set target AC temperature."""
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is None:
            return

        if self._is_thermostat_mode:
            current_option = self._attr_preset_mode
            new_temperatures = dict(self._target_temperatures)
            new_temperatures[current_option] = temperature
            self._attr_target_temperature = temperature
            self.async_write_ha_state()

            await async_api_post(
                self.hass,
                self._auth_token,
                API_SET_TARGET_TEMPERATURES,
                {"endpoint": self._device_id, "targetTemperatures": new_temperatures},
            )
        else:
            fan = self._attr_fan_mode or self._last_fan_mode
            mode = "cooling" if self._attr_hvac_mode == HVACMode.COOL else "heating"
            cmd = f"{mode}_{fan}_{int(round(temperature))}"
            self._attr_target_temperature = float(int(round(temperature)))
            self.async_write_ha_state()
            await self._send_ir_command(cmd)

        await asyncio.sleep(0.5)
        await self.coordinator.async_request_refresh()

    async def async_set_fan_mode(self, fan_mode: str) -> None:
        """Set AC fan mode."""
        if fan_mode not in AC_FAN_MODES:
            return

        self._attr_fan_mode = fan_mode
        self._last_fan_mode = fan_mode
        self.async_write_ha_state()

        if not self._is_thermostat_mode and self._attr_hvac_mode in (HVACMode.COOL, HVACMode.HEAT):
            mode = "cooling" if self._attr_hvac_mode == HVACMode.COOL else "heating"
            temp = int(self._attr_target_temperature or self._last_target_temp)
            cmd = f"{mode}_{fan_mode}_{temp}"
            await self._send_ir_command(cmd)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        """Set AC HVAC mode."""
        if hvac_mode == HVACMode.OFF:
            self._attr_hvac_mode = HVACMode.OFF
            self._attr_hvac_action = HVACAction.OFF
            self.async_write_ha_state()
            await self._send_ir_command(AC_STATE_OFF)
            return

        # Ensure remote or cooling mode
        await async_api_post(
            self.hass,
            self._auth_token,
            API_SET_OPERATION_MODE,
            {"endpoint": self._device_id, "operationMode": OPERATION_MODE_REMOTE},
        )

        fan = self._attr_fan_mode or "auto"
        temp = int(self._attr_target_temperature or AC_DEFAULT_TARGET_TEMP)

        if hvac_mode == HVACMode.COOL:
            cmd = f"cooling_{fan}_{temp}"
        elif hvac_mode == HVACMode.HEAT:
            cmd = f"heating_{fan}_{temp}"
        elif hvac_mode == HVACMode.DRY:
            cmd = AC_STATE_DRY
        elif hvac_mode == HVACMode.FAN_ONLY:
            cmd = AC_STATE_VENTILATION
        else:
            return

        self._attr_hvac_mode = hvac_mode
        self.async_write_ha_state()
        await self._send_ir_command(cmd)

        await asyncio.sleep(0.5)
        await self.coordinator.async_request_refresh()

    async def _send_ir_command(self, command: str) -> bool:
        """Send an IR command to the Cosa device."""
        return await async_api_post(
            self.hass,
            self._auth_token,
            API_SEND_IR_COMMAND,
            {"endpoint": self._device_id, "command": command},
        )
