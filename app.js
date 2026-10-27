/**
 * Interactive Studio Application & State Bridge
 * Drives the Liquid Glass Thermostat showcase
 */

(function () {
  // Mock Home Assistant State Bridge
  class MockHassBridge {
    constructor(cardElement) {
      this.card = cardElement;
      this.state = {
        currentTemp: 22.4,
        targetTemp: 23.0,
        humidity: 48,
        presetMode: 'home',
        hvacMode: 'heat',
        hvacAction: 'heating',
        fanMode: 'auto',
        acHvacMode: 'cool',
        acTargetTemp: 24.0,
        activeSystem: 'combi',
        showAc: false
      };

      this._initCard();
    }

    _initCard() {
      this.card.setConfig({
        entity: "climate.cosa_thermostat",
        name: "Cosa Kombi Termostatı",
        show_ac: false, // Default false: Combi only!
        temp_step: 0.5,
        glass_style: "liquid-glass",
        show_ambient_glow: true
      });

      this.syncHass();
    }

    toggleAc(showAc) {
      this.state.showAc = showAc;
      this.card.setConfig({
        entity: "climate.cosa_thermostat",
        ac_entity: showAc ? "climate.cosa_thermostat_ac" : undefined,
        name: showAc ? "Cosa Akıllı İklim" : "Cosa Kombi Termostatı",
        show_ac: showAc,
        temp_step: 0.5,
        glass_style: "liquid-glass",
        show_ambient_glow: true
      });
      this.syncHass();
    }

    syncHass() {
      const hassMock = {
        states: {
          "climate.cosa_thermostat": {
            entity_id: "climate.cosa_thermostat",
            state: this.state.hvacMode,
            attributes: {
              current_temperature: this.state.currentTemp,
              temperature: this.state.targetTemp,
              current_humidity: this.state.humidity,
              preset_mode: this.state.presetMode,
              hvac_action: this.state.hvacMode === 'off' ? 'off' : this.state.hvacAction,
              min_temp: 5.0,
              max_temp: 35.0,
              target_temp_step: 0.5
            }
          },
          "climate.cosa_thermostat_ac": {
            entity_id: "climate.cosa_thermostat_ac",
            state: this.state.acHvacMode,
            attributes: {
              current_temperature: this.state.currentTemp,
              temperature: this.state.acTargetTemp,
              current_humidity: this.state.humidity,
              preset_mode: 'remote',
              fan_mode: this.state.fanMode,
              hvac_action: this.state.acHvacMode === 'off' ? 'off' : (this.state.acHvacMode === 'cool' ? 'cooling' : 'idle'),
              min_temp: 16.0,
              max_temp: 30.0,
              target_temp_step: 1.0
            }
          }
        },
        callService: (domain, service, data) => {
          this.handleServiceCall(domain, service, data);
        }
      };

      this.card.hass = hassMock;
    }

    handleServiceCall(domain, service, data) {
      console.log(`[Mock HA Service] ${domain}.${service}`, data);

      if (domain === 'climate') {
        if (service === 'set_temperature') {
          if (data.entity_id === 'climate.cosa_thermostat_ac') {
            this.state.acTargetTemp = data.temperature;
          } else {
            this.state.targetTemp = data.temperature;
          }
          // Automatic flame simulation: if target > current, combi heats
          if (this.state.targetTemp > this.state.currentTemp && this.state.hvacMode !== 'off') {
            this.state.hvacAction = 'heating';
          } else {
            this.state.hvacAction = 'idle';
          }
        } else if (service === 'set_preset_mode') {
          this.state.presetMode = data.preset_mode;
          // Set preset temperatures
          const presetTemps = {
            home: 23.0,
            away: 19.0,
            sleep: 20.5,
            custom: 22.0,
            auto: 22.5,
            schedule: 21.5
          };
          if (presetTemps[data.preset_mode]) {
            this.state.targetTemp = presetTemps[data.preset_mode];
          }
        } else if (service === 'set_hvac_mode') {
          if (data.entity_id === 'climate.cosa_thermostat_ac') {
            this.state.acHvacMode = data.hvac_mode;
          } else {
            this.state.hvacMode = data.hvac_mode;
          }
        } else if (service === 'set_fan_mode') {
          this.state.fanMode = data.fan_mode;
        } else if (service === 'turn_on') {
          this.state.hvacMode = 'heat';
        } else if (service === 'turn_off') {
          this.state.hvacMode = 'off';
        }

        this.syncHass();
        this.updateUiControls();
      }
    }

    updateUiControls() {
      const simFlame = document.getElementById('simCombiFlame');
      if (simFlame) {
        simFlame.checked = this.state.hvacAction === 'heating';
      }
      const simPower = document.getElementById('simPower');
      if (simPower) {
        simPower.checked = this.state.hvacMode !== 'off';
      }
    }

    setPreset(preset) {
      this.handleServiceCall('climate', 'set_preset_mode', { preset_mode: preset });
    }
  }

  // Initialize UI & Event Handlers on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const cardEl = document.getElementById('thermostatCard');
    const bridge = new MockHassBridge(cardEl);
    window.simulator = bridge;

    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(targetTab)?.classList.add('active');
      });
    });

    // Simulator Sliders
    const simCurrentTemp = document.getElementById('simCurrentTemp');
    const simCurrentTempVal = document.getElementById('simCurrentTempVal');
    simCurrentTemp?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      simCurrentTempVal.textContent = `${val.toFixed(1)}°C`;
      bridge.state.currentTemp = val;
      bridge.syncHass();
    });

    const simHumidity = document.getElementById('simHumidity');
    const simHumidityVal = document.getElementById('simHumidityVal');
    simHumidity?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      simHumidityVal.textContent = `%${val}`;
      bridge.state.humidity = val;
      bridge.syncHass();
    });

    const simCombiFlame = document.getElementById('simCombiFlame');
    simCombiFlame?.addEventListener('change', (e) => {
      bridge.state.hvacAction = e.target.checked ? 'heating' : 'idle';
      bridge.syncHass();
    });

    const simPower = document.getElementById('simPower');
    simPower?.addEventListener('change', (e) => {
      bridge.state.hvacMode = e.target.checked ? 'heat' : 'off';
      bridge.syncHass();
    });

    const simShowAc = document.getElementById('simShowAc');
    simShowAc?.addEventListener('change', (e) => {
      bridge.toggleAc(e.target.checked);
    });

    // Glass Customizer Controls
    const glassBlurInput = document.getElementById('glassBlurInput');
    const glassBlurVal = document.getElementById('glassBlurVal');
    glassBlurInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      glassBlurVal.textContent = `${val}px`;
      document.documentElement.style.setProperty('--glass-blur', `${val}px`);
      // Update card internal custom style
      const cardContainer = cardEl.shadowRoot?.getElementById('cardContainer');
      if (cardContainer) {
        cardContainer.style.backdropFilter = `blur(${val}px) saturate(200%)`;
      }
    });

    const glassOpacityInput = document.getElementById('glassOpacityInput');
    const glassOpacityVal = document.getElementById('glassOpacityVal');
    glassOpacityInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      glassOpacityVal.textContent = `%${val}`;
      const decimal = (val / 100).toFixed(2);
      const cardContainer = cardEl.shadowRoot?.getElementById('cardContainer');
      if (cardContainer) {
        cardContainer.style.background = `linear-gradient(135deg, rgba(255, 255, 255, ${decimal}) 0%, rgba(255, 255, 255, 0.03) 100%)`;
      }
    });

    const ambientGlowToggle = document.getElementById('ambientGlowToggle');
    ambientGlowToggle?.addEventListener('change', (e) => {
      const glow = cardEl.shadowRoot?.getElementById('ambientGlow');
      if (glow) {
        glow.style.display = e.target.checked ? 'block' : 'none';
      }
    });

    const specularToggle = document.getElementById('specularToggle');
    specularToggle?.addEventListener('change', (e) => {
      const cardContainer = cardEl.shadowRoot?.getElementById('cardContainer');
      if (cardContainer) {
        cardContainer.style.borderColor = e.target.checked ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.08)';
      }
    });

    // Reset button
    document.getElementById('navResetBtn')?.addEventListener('click', () => {
      bridge.state = {
        currentTemp: 22.4,
        targetTemp: 23.0,
        humidity: 48,
        presetMode: 'home',
        hvacMode: 'heat',
        hvacAction: 'heating',
        fanMode: 'auto',
        acHvacMode: 'cool',
        acTargetTemp: 24.0,
        activeSystem: 'combi'
      };
      if (simCurrentTemp) simCurrentTemp.value = 22.4;
      if (simCurrentTempVal) simCurrentTempVal.textContent = "22.4°C";
      if (simHumidity) simHumidity.value = 48;
      if (simHumidityVal) simHumidityVal.textContent = "%48";
      if (simCombiFlame) simCombiFlame.checked = true;
      if (simPower) simPower.checked = true;

      bridge.syncHass();
    });

    // Copy YAML to clipboard
    const copyYamlHandler = () => {
      const code = document.getElementById('yamlCodeBlock')?.innerText;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const copyBtnText = document.getElementById('copyYamlText');
          const navExportBtn = document.getElementById('navExportBtn');
          if (copyBtnText) copyBtnText.textContent = "Kopyalandı! ✓";
          if (navExportBtn) navExportBtn.innerHTML = "Kopyalandı! ✓";

          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = "Kodu Kopyala";
            if (navExportBtn) {
              navExportBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Lovelace YAML Kopyala
              `;
            }
          }, 2500);
        });
      }
    };

    document.getElementById('copyYamlBtn')?.addEventListener('click', copyYamlHandler);
    document.getElementById('navExportBtn')?.addEventListener('click', copyYamlHandler);
  });
})();
