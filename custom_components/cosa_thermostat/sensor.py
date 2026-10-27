"""Support for Cosa Thermostat sensors."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from .const import DOMAIN
from .helpers import has_ac_support, parse_ac_state

_LOGGER = logging.getLogger(__name__)

SENSORS: list[SensorEntityDescription] = [
    SensorEntityDescription(
        key="combi_state",
        name="Combi State",
        device_class=SensorDeviceClass.ENUM,
        options=["heating", "idle", "off", "unknown"],
        icon="mdi:radiator",
    ),
    SensorEntityDescription(
        key="current_temperature",
        name="Current Temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:thermometer",
    ),
    SensorEntityDescription(
        key="target_temperature",
        name="Target Temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:thermometer-check",
    ),
    SensorEntityDescription(
        key="humidity",
        name="Humidity",
        native_unit_of_measurement=PERCENTAGE,
        device_class=SensorDeviceClass.HUMIDITY,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:water-percent",
    ),
    SensorEntityDescription(
        key="operation_mode",
        name="Operation Mode",
        device_class=SensorDeviceClass.ENUM,
        options=["heating", "cooling", "remote", "unknown"],
        icon="mdi:tune",
    ),
]

AC_SENSORS: list[SensorEntityDescription] = [
    SensorEntityDescription(
        key="ac_state",
        name="AC State",
        device_class=SensorDeviceClass.ENUM,
        options=["cooling", "heating", "dry", "ventilation", "off", "unknown"],
        icon="mdi:air-conditioner",
    ),
]


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Cosa Thermostat sensors."""
    coordinator: DataUpdateCoordinator = hass.data[DOMAIN][config_entry.entry_id]
    device_id = config_entry.data["device_id"]

    entities: list[CosaThermostatSensor] = []
    for description in SENSORS:
        entities.append(CosaThermostatSensor(coordinator, description, device_id))

    endpoint = (coordinator.data or {}).get("endpoint", {})
    if has_ac_support(endpoint):
        for description in AC_SENSORS:
            entities.append(CosaThermostatSensor(coordinator, description, device_id))

    async_add_entities(entities, False)


class CosaThermostatSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Cosa Thermostat sensor."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: DataUpdateCoordinator,
        description: SensorEntityDescription,
        device_id: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._device_id = device_id
        self._attr_unique_id = f"{DOMAIN}_{device_id}_{description.key}"

    @property
    def native_value(self) -> str | float | None:
        """Return the state of the sensor."""
        if not self.coordinator.data:
            return None

        endpoint: dict[str, Any] = self.coordinator.data.get("endpoint", {})

        if self.entity_description.key == "combi_state":
            combi_state = endpoint.get("combiState", "unknown")
            operation_mode = endpoint.get("operationMode")
            if combi_state == "on" and operation_mode == "heating":
                return "heating"
            elif combi_state == "off":
                return "off"
            elif combi_state == "on":
                return "idle"
            return "unknown"

        elif self.entity_description.key == "current_temperature":
            temp = endpoint.get("temperature")
            return float(temp) if temp is not None else None

        elif self.entity_description.key == "target_temperature":
            current_option = endpoint.get("option")
            if current_option:
                temp = endpoint.get(f"{current_option}Temperature")
                return float(temp) if temp is not None else None
            return None

        elif self.entity_description.key == "humidity":
            humidity = endpoint.get("humidity")
            return float(humidity) if humidity is not None else None

        elif self.entity_description.key == "operation_mode":
            mode = endpoint.get("operationMode")
            return mode if mode in ["heating", "cooling", "remote"] else "unknown"

        elif self.entity_description.key == "ac_state":
            parsed = parse_ac_state(endpoint.get("acState"))
            if parsed is None:
                return "unknown"
            return parsed[0]

        return None
