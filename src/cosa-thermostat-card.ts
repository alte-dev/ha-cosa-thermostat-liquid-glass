import { LitElement, html, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { cardStyles } from './styles';
import { CosaCardConfig, HomeAssistant } from './types';
import './editor';

const CARD_VERSION = "1.0.8";
console.info(
  `%c COSA-THERMOSTAT-CARD %c v${CARD_VERSION} (Liquid Glass) `,
  'color: #ffffff; background: linear-gradient(135deg, #ff5e3a, #ff2a6d); font-weight: bold; border-radius: 4px 0 0 4px; padding: 3px 6px;',
  'color: #ffffff; background: #1c1c1e; font-weight: bold; border-radius: 0 4px 4px 0; padding: 3px 6px;'
);

export class CosaThermostatCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config!: CosaCardConfig;
  @state() private _activeSystem: 'combi' | 'ac' = 'combi';
  @state() private _localTargetTemp: number | null = null;
  @state() private _isDragging = false;

  private _radius = 96;
  private _circumference = 2 * Math.PI * 96;
  private _totalAngle = 240;
  private _onMoveBind?: (e: MouseEvent | TouchEvent) => void;
  private _onEndBind?: (e: MouseEvent | TouchEvent) => void;

  static styles = cardStyles;

  public static getStubConfig(hass?: HomeAssistant): CosaCardConfig {
    const climateEntity = (hass && hass.states)
      ? Object.keys(hass.states).find(id => id.startsWith('climate.'))
      : 'climate.cosa_thermostat';

    return {
      type: "custom:cosa-thermostat-card",
      entity: climateEntity || "climate.cosa_thermostat",
      name: "Cosa Kombi Termostatı",
      show_ac: false, // Default false: Combi only!
      temp_step: 0.5,
      show_ambient_glow: true,
      liquid_glass: true,
      theme_mode: 'auto'
    };
  }

  public static getConfigElement() {
    return document.createElement("cosa-thermostat-card-editor");
  }

  public setConfig(config: CosaCardConfig): void {
    this._config = {
      name: "Cosa Kombi Termostatı",
      temp_step: 0.5,
      show_ambient_glow: true,
      glass_style: "liquid-glass",
      ...config,
      entity: config?.entity || "climate.cosa_thermostat",
      show_ac: config?.show_ac === true, // Default to FALSE: Combi only!
      liquid_glass: config?.liquid_glass !== false, // Default true: Liquid Glass
      theme_mode: config?.theme_mode || 'auto',
    };

    if (!this._config.show_ac) {
      this._activeSystem = 'combi';
    }
  }

  public getCardSize(): number {
    return 6;
  }

  public getLayoutOptions() {
    return {
      grid_rows: 6,
      grid_columns: 4,
      grid_min_rows: 5,
      grid_min_columns: 3,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._onMoveBind = (e: MouseEvent | TouchEvent) => this._onDialMove(e);
    this._onEndBind = (e: MouseEvent | TouchEvent) => this._onDialEnd(e);

    window.addEventListener('mousemove', this._onMoveBind);
    window.addEventListener('mouseup', this._onEndBind);
    window.addEventListener('touchmove', this._onMoveBind, { passive: false });
    window.addEventListener('touchend', this._onEndBind);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._onMoveBind && this._onEndBind) {
      window.removeEventListener('mousemove', this._onMoveBind);
      window.removeEventListener('mouseup', this._onEndBind);
      window.removeEventListener('touchmove', this._onMoveBind);
      window.removeEventListener('touchend', this._onEndBind);
    }
  }

  private _getEntity() {
    if (!this.hass?.states || !this._config) return null;
    if (this._config.show_ac && this._activeSystem === 'ac' && this._config.ac_entity && this.hass.states[this._config.ac_entity]) {
      return this.hass.states[this._config.ac_entity];
    }
    return this.hass.states[this._config.entity] || null;
  }

  private _getTempLimits() {
    if (this._config?.show_ac && this._activeSystem === 'ac') {
      return { minTemp: 16.0, maxTemp: 30.0, step: 1.0 };
    }
    return {
      minTemp: this._config?.min_temp || 5.0,
      maxTemp: this._config?.max_temp || 35.0,
      step: this._config?.temp_step || 0.5
    };
  }

  private _switchSystem(system: 'combi' | 'ac') {
    if (this._activeSystem === system) return;
    this._activeSystem = system;
    this._localTargetTemp = null;
    this.requestUpdate();
  }

  private _adjustTemp(delta: number) {
    const entity = this._getEntity();
    const currentTarget = this._localTargetTemp !== null
      ? this._localTargetTemp
      : (entity?.attributes?.temperature ?? 21.0);

    const { minTemp, maxTemp, step } = this._getTempLimits();
    const newTemp = Math.min(Math.max(currentTarget + delta, minTemp), maxTemp);
    const stepped = parseFloat((Math.round(newTemp / step) * step).toFixed(1));

    this._localTargetTemp = stepped;
    this._commitTemperature(stepped);
    this.requestUpdate();
  }

  private _commitTemperature(temperature: number) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;

    this.hass.callService("climate", "set_temperature", {
      entity_id: entity.entity_id,
      temperature: temperature
    });
  }

  private _handlePowerToggle() {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;

    const isOff = entity.state === 'off';
    const service = isOff ? "turn_on" : "turn_off";

    this.hass.callService("climate", service, {
      entity_id: entity.entity_id
    });
  }

  private _handlePresetSelect(preset: string) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;

    this.hass.callService("climate", "set_preset_mode", {
      entity_id: entity.entity_id,
      preset_mode: preset
    });
  }

  private _handleFanSelect(fanMode: string) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;

    this.hass.callService("climate", "set_fan_mode", {
      entity_id: entity.entity_id,
      fan_mode: fanMode
    });
  }

  private _handleAcHvacSelect(hvacMode: string) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;

    this.hass.callService("climate", "set_hvac_mode", {
      entity_id: entity.entity_id,
      hvac_mode: hvacMode
    });
  }

  private _onDialStart(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this._isDragging = true;
    this._updateDialFromPointer(e);
  }

  private _onDialMove(e: MouseEvent | TouchEvent) {
    if (!this._isDragging) return;
    e.preventDefault();
    this._updateDialFromPointer(e);
  }

  private _onDialEnd(_e: MouseEvent | TouchEvent) {
    if (!this._isDragging) return;
    this._isDragging = false;
    if (this._localTargetTemp !== null) {
      this._commitTemperature(this._localTargetTemp);
    }
    this.requestUpdate();
  }

  private _updateDialFromPointer(e: MouseEvent | TouchEvent) {
    const dialContainer = this.shadowRoot?.getElementById('dialContainer');
    if (!dialContainer) return;

    const rect = dialContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    let relativeAngle = angle - 150;
    if (relativeAngle < 0) relativeAngle += 360;

    let progress = 0;
    if (relativeAngle <= 240) {
      progress = relativeAngle / 240;
    } else {
      const distToStart = 360 - relativeAngle;
      const distToEnd = relativeAngle - 240;
      progress = distToStart < distToEnd ? 0 : 1;
    }

    const { minTemp, maxTemp, step } = this._getTempLimits();
    const rawTemp = minTemp + progress * (maxTemp - minTemp);
    const steppedTemp = Math.round(rawTemp / step) * step;
    const clampedTemp = Math.min(Math.max(steppedTemp, minTemp), maxTemp);

    this._localTargetTemp = parseFloat(clampedTemp.toFixed(1));
    this.requestUpdate();
  }

  private _isLightMode(): boolean {
    if (this._config?.theme_mode === 'light') return true;
    if (this._config?.theme_mode === 'dark') return false;

    // Home Assistant standard darkMode property
    if (this.hass?.themes?.darkMode !== undefined) {
      return this.hass.themes.darkMode === false;
    }

    // Check computed primary text color in document body
    try {
      const textColor = getComputedStyle(document.body).getPropertyValue('--primary-text-color').trim().toLowerCase();
      if (textColor) {
        if (
          textColor === '#212121' ||
          textColor === '#000000' ||
          textColor === 'rgb(33, 33, 33)' ||
          textColor.startsWith('#1') ||
          textColor.startsWith('#2') ||
          textColor.startsWith('#3')
        ) {
          return true;
        }
      }
    } catch (_) {}

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  protected render() {
    if (!this._config) return html``;

    try {
      const entity = this._getEntity();
      const isCombi = this._activeSystem === 'combi';
      const isAc = !isCombi && this._config.show_ac;

      const isOn = (entity?.state || 'heat') !== 'off';
      const hvacAction = entity?.attributes?.hvac_action || (isAc ? 'cooling' : 'heating');

      const rawCurrent = entity?.attributes?.current_temperature;
      const currentTemp = (rawCurrent !== undefined && rawCurrent !== null && !isNaN(Number(rawCurrent)))
        ? Number(rawCurrent)
        : 22.4;

      const rawTarget = this._localTargetTemp !== null
        ? this._localTargetTemp
        : entity?.attributes?.temperature;
      const targetTemp = (rawTarget !== undefined && rawTarget !== null && !isNaN(Number(rawTarget)))
        ? Number(rawTarget)
        : (isAc ? 24.0 : 23.0);

      const rawHumidity = entity?.attributes?.current_humidity;
      const humidity = (rawHumidity !== undefined && rawHumidity !== null && !isNaN(Number(rawHumidity)))
        ? Number(rawHumidity)
        : 48;

      const presetMode = entity?.attributes?.preset_mode || 'home';
      const fanMode = entity?.attributes?.fan_mode || 'auto';
      const hvacMode = entity?.state || 'heat';

    // State class
    let stateClass = 'state-idle';
    let stateText = 'BEKLEMEDE';

    if (!isOn) {
      stateClass = 'state-off';
      stateText = 'KAPALI';
    } else if (isAc) {
      if (hvacAction === 'cooling') {
        stateClass = 'state-cooling';
        stateText = 'SOĞUTUYOR';
      }
    } else {
      if (hvacAction === 'heating') {
        stateClass = 'state-heating';
        stateText = 'ISITIYOR';
      }
    }

    // Dial math
    const { minTemp, maxTemp } = this._getTempLimits();
    const fraction = Math.min(Math.max((targetTemp - minTemp) / (maxTemp - minTemp), 0), 1);
    const arcLength = (this._totalAngle / 360) * this._circumference;
    const fillLength = fraction * arcLength;
    const strokeDashoffset = arcLength - fillLength;

    const angleDeg = 150 + fraction * 240;
    const angleRad = (angleDeg * Math.PI) / 180;
    const thumbX = 125 + 96 * Math.cos(angleRad);
    const thumbY = 125 + 96 * Math.sin(angleRad);

    const activeStrokeGradient = isAc ? 'url(#coolGradient)' : 'url(#heatGradient)';
    const isLiquidGlass = this._config.liquid_glass !== false;
    const isLight = this._isLightMode();
    const themeClass = isLight ? 'theme-light' : 'theme-dark';

    return html`
      <div class="card-container ${stateClass} ${themeClass} ${!isLiquidGlass ? 'standard-mode' : ''}">
        ${this._config.show_ambient_glow && isLiquidGlass ? html`<div class="ambient-glow"></div>` : ''}

        <div class="card-content">
          <!-- Header Bar -->
          <div class="header-bar">
            <div class="title-group">
              <div class="brand-logo">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2c1.5 3 4 5.5 4 8.5a4 4 0 0 1-8 0C8 7.5 10.5 5 12 2z"/>
                </svg>
              </div>
              <div>
                <div class="card-title">${this._config.name}</div>
                <div class="device-badge">
                  ${this._config.show_ac ? 'Cosa Hibrit İklim' : 'Cosa Kombi Termostatı'}
                </div>
              </div>
            </div>
            <button
              class="power-btn ${isOn ? 'active' : ''}"
              @click=${this._handlePowerToggle}
              title="Aç / Kapat"
            >
              <svg viewBox="0 0 24 24">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </button>
          </div>

          <!-- System Switcher: ONLY SHOWN IF SHOW_AC IS TRUE! -->
          ${this._config.show_ac
            ? html`
                <div class="system-pill-switch">
                  <div
                    class="system-pill-option ${isCombi ? 'active' : ''}"
                    @click=${() => this._switchSystem('combi')}
                  >
                    <span>🔥</span> Kombi (Isıtma)
                  </div>
                  <div
                    class="system-pill-option ${isAc ? 'active' : ''}"
                    @click=${() => this._switchSystem('ac')}
                  >
                    <span>❄️</span> Klima (Soğutma)
                  </div>
                </div>
              `
            : ''}

          <!-- Circular Dial -->
          <div
            class="dial-container"
            id="dialContainer"
            @mousedown=${this._onDialStart}
            @touchstart=${this._onDialStart}
          >
            <svg class="dial-svg" viewBox="0 0 250 250">
              <defs>
                <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff7b54" />
                  <stop offset="50%" stop-color="#ff5e3a" />
                  <stop offset="100%" stop-color="#ff2a6d" />
                </linearGradient>
                <linearGradient id="coolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00f2fe" />
                  <stop offset="50%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0072ff" />
                </linearGradient>
              </defs>
              <circle
                class="dial-track-bg"
                cx="125"
                cy="125"
                r="96"
                style="stroke-dasharray: ${arcLength} ${this._circumference}; stroke-dashoffset: 0;"
              />
              <circle
                class="dial-track-active"
                cx="125"
                cy="125"
                r="96"
                style="stroke-dasharray: ${arcLength} ${this._circumference}; stroke-dashoffset: ${strokeDashoffset}; stroke: ${activeStrokeGradient};"
              />
            </svg>

            <div
              class="dial-thumb ${this._isDragging ? 'dragging' : ''}"
              style="left: ${thumbX}px; top: ${thumbY}px;"
            ></div>

            <div class="dial-center-glass">
              <div class="state-indicator">
                <span class="state-dot"></span>
                <span>${stateText}</span>
              </div>
              <div class="target-temp-display">
                <span class="target-temp-number">${targetTemp.toFixed(1)}</span>
                <span class="target-temp-degree">°C</span>
              </div>
              <div class="current-temp-badge">
                <span>Oda:</span>
                <span class="current-temp-val">${currentTemp.toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          <!-- Micro adjustments -->
          <div class="dial-step-controls">
            <button class="step-btn" @click=${() => this._adjustTemp(-(this._config.temp_step || 0.5))} title="Düşür">−</button>
            <button class="step-btn" @click=${() => this._adjustTemp(this._config.temp_step || 0.5)} title="Yükselt">+</button>
          </div>

          <!-- Environmental Metrics -->
          <div class="metrics-bar">
            <div class="metric-capsule">
              <div class="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Nem</span>
                <span class="metric-val">%${Math.round(humidity)}</span>
              </div>
            </div>

            <div class="metric-capsule">
              <div class="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2c1.5 3 4 5.5 4 8.5a4 4 0 0 1-8 0C8 7.5 10.5 5 12 2z"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">${isAc ? 'Klima' : 'Kombi'}</span>
                <span class="metric-val">
                  ${isAc
                    ? (hvacAction === 'cooling' ? 'Üflüyor' : 'Beklemede')
                    : (hvacAction === 'heating' ? 'Yanıyor' : 'Beklemede')}
                </span>
              </div>
            </div>
          </div>

          <!-- Presets -->
          <div class="presets-section">
            <div class="section-label">Modlar & Önayarlar</div>
            <div class="presets-grid">
              <button
                class="preset-btn ${presetMode === 'home' ? 'active' : ''}"
                @click=${() => this._handlePresetSelect('home')}
              >
                <span class="preset-icon">🏠</span>
                <span class="preset-name">Ev</span>
              </button>
              <button
                class="preset-btn ${presetMode === 'away' ? 'active' : ''}"
                @click=${() => this._handlePresetSelect('away')}
              >
                <span class="preset-icon">🚶</span>
                <span class="preset-name">Dışarı</span>
              </button>
              <button
                class="preset-btn ${presetMode === 'sleep' ? 'active' : ''}"
                @click=${() => this._handlePresetSelect('sleep')}
              >
                <span class="preset-icon">🌙</span>
                <span class="preset-name">Uyku</span>
              </button>
              <button
                class="preset-btn ${presetMode === 'custom' ? 'active' : ''}"
                @click=${() => this._handlePresetSelect('custom')}
              >
                <span class="preset-icon">⚙️</span>
                <span class="preset-name">Özel</span>
              </button>
              <button
                class="preset-btn ${presetMode === 'auto' ? 'active' : ''}"
                @click=${() => this._handlePresetSelect('auto')}
              >
                <span class="preset-icon">⚡</span>
                <span class="preset-name">Oto</span>
              </button>
              <button
                class="preset-btn ${presetMode === 'schedule' ? 'active' : ''}"
                @click=${() => this._handlePresetSelect('schedule')}
              >
                <span class="preset-icon">📅</span>
                <span class="preset-name">Plan</span>
              </button>
            </div>
          </div>

          <!-- AC Controls: ONLY SHOWN IF SHOW_AC IS TRUE AND KLIMA IS SELECTED! -->
          ${this._config.show_ac && isAc
            ? html`
                <div class="ac-controls">
                  <div class="ac-row">
                    <span class="section-label">Fan Hızı</span>
                    <div class="fan-speed-pills">
                      <div class="sub-pill ${fanMode === 'auto' ? 'active' : ''}" @click=${() => this._handleFanSelect('auto')}>Oto</div>
                      <div class="sub-pill ${fanMode === 'low' ? 'active' : ''}" @click=${() => this._handleFanSelect('low')}>Düşük</div>
                      <div class="sub-pill ${fanMode === 'medium' ? 'active' : ''}" @click=${() => this._handleFanSelect('medium')}>Orta</div>
                      <div class="sub-pill ${fanMode === 'high' ? 'active' : ''}" @click=${() => this._handleFanSelect('high')}>Yüksek</div>
                    </div>
                  </div>
                  <div class="ac-row">
                    <span class="section-label">Klima Modu</span>
                    <div class="ac-mode-pills">
                      <div class="sub-pill ${hvacMode === 'cool' ? 'active' : ''}" @click=${() => this._handleAcHvacSelect('cool')}>Soğut</div>
                      <div class="sub-pill ${hvacMode === 'dry' ? 'active' : ''}" @click=${() => this._handleAcHvacSelect('dry')}>Nem Al</div>
                      <div class="sub-pill ${hvacMode === 'fan_only' ? 'active' : ''}" @click=${() => this._handleAcHvacSelect('fan_only')}>Fan</div>
                      <div class="sub-pill ${hvacMode === 'off' ? 'active' : ''}" @click=${() => this._handleAcHvacSelect('off')}>Kapat</div>
                    </div>
                  </div>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
    } catch (err) {
      console.error("CosaThermostatCard render error:", err);
      return html`
        <div class="card-container state-idle theme-dark">
          <div class="card-content" style="padding: 24px; text-align: center;">
            <div class="card-title">${this._config?.name || 'Cosa Termostat'}</div>
            <div style="margin-top: 12px; font-size: 13px; opacity: 0.7;">Yükleniyor...</div>
          </div>
        </div>
      `;
    }
  }
}

// Window card registration for Lovelace card picker
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'cosa-thermostat-card')) {
  window.customCards.push({
    type: "cosa-thermostat-card",
    name: "Cosa Thermostat (Liquid Glass)",
    description: "Ultra-futuristic frosted liquid glass climate control card for Cosa smart combi boilers & air conditioners.",
    preview: true,
    documentationURL: "https://github.com/alte-dev/ha-cosa-thermostat-liquid-glass"
  });
}

try {
  customElements.define('cosa-thermostat-card', CosaThermostatCard);
} catch (_) {
  // Ignored if already defined in scoped-custom-element-registry
}

// Self-healing: Notify Lovelace to rebuild in case the DOM rendered before module load
window.dispatchEvent(new CustomEvent('ll-rebuild', { composed: true, bubbles: true }));
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('ll-rebuild', { composed: true, bubbles: true }));
}, 200);



