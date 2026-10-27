import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CosaCardConfig, HomeAssistant } from './types';

export class CosaThermostatCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: CosaCardConfig;

  static styles = css`
    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 12px 0;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
      color: var(--primary-text-color, #ffffff);
    }
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }
    .desc {
      font-size: 11px;
      color: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
    }
    input[type="text"], select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      background: var(--card-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #ffffff);
      box-sizing: border-box;
      outline: none;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  `;

  public setConfig(config: CosaCardConfig): void {
    this._config = {
      show_ac: false, // Default false: pure combi heating!
      liquid_glass: true,
      ...config
    };
  }

  private _valueChanged(key: keyof CosaCardConfig, value: any): void {
    if (!this._config) return;
    this._config = {
      ...this._config,
      [key]: value
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  protected render() {
    if (!this._config) return html``;

    return html`
      <div class="editor-container">
        <div class="form-row">
          <label>Kombi Termostat Varlığı (Entity ID):</label>
          <input
            type="text"
            .value=${this._config.entity || ''}
            placeholder="climate.cosa_thermostat"
            @change=${(e: Event) => this._valueChanged('entity', (e.target as HTMLInputElement).value)}
          />
          <span class="desc">Doğalgaz kombisi için tanımlı iklim varlığı.</span>
        </div>

        <div class="form-row">
          <label>Kart Başlığı:</label>
          <input
            type="text"
            .value=${this._config.name || 'Cosa Kombi Termostatı'}
            @change=${(e: Event) => this._valueChanged('name', (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="form-row">
          <label>Sıcaklık Adımı (Step):</label>
          <select
            .value=${String(this._config.temp_step || 0.5)}
            @change=${(e: Event) => this._valueChanged('temp_step', parseFloat((e.target as HTMLSelectElement).value))}
          >
            <option value="0.5">0.5 °C (Önerilen)</option>
            <option value="0.1">0.1 °C (Hassas)</option>
            <option value="1.0">1.0 °C</option>
          </select>
        </div>

        <div class="form-row">
          <label>Tema Modu:</label>
          <select
            .value=${this._config.theme_mode || 'auto'}
            @change=${(e: Event) => this._valueChanged('theme_mode', (e.target as HTMLSelectElement).value)}
          >
            <option value="auto">Otomatik (Home Assistant Temasına Göre)</option>
            <option value="light">Açık Tema (Light Mode)</option>
            <option value="dark">Koyu Tema (Dark Mode)</option>
          </select>
          <span class="desc">Açık veya koyu arayüz tonlarına göre kart yazılarını ve kontrastı ayarlar.</span>
        </div>

        <!-- Liquid Glass Toggle -->
        <div class="toggle-row">
          <div>
            <label style="display:block;">Liquid Glass Efekti</label>
            <span class="desc">Açık olduğunda buzlu cam ve dinamik parıltı kullanılır. Kapalıyken standart Home Assistant kart stiline geçer.</span>
          </div>
          <input
            type="checkbox"
            .checked=${this._config.liquid_glass !== false}
            @change=${(e: Event) => this._valueChanged('liquid_glass', (e.target as HTMLInputElement).checked)}
          />
        </div>

        <!-- AC Toggle: Default Kapalı! -->
        <div class="toggle-row">
          <div>
            <label style="display:block;">Klima (Soğutma) Desteğini Göster</label>
            <span class="desc">Sadece kliması olan Cosa modelleri için. Kapalıyken sadece kombi arayüzü gösterilir.</span>
          </div>
          <input
            type="checkbox"
            .checked=${this._config.show_ac === true}
            @change=${(e: Event) => this._valueChanged('show_ac', (e.target as HTMLInputElement).checked)}
          />
        </div>

        ${this._config.show_ac
          ? html`
              <div class="form-row" style="padding-left: 8px; border-left: 2px solid #00c6ff;">
                <label>Klima Varlığı (AC Entity ID):</label>
                <input
                  type="text"
                  .value=${this._config.ac_entity || ''}
                  placeholder="climate.cosa_thermostat_ac"
                  @change=${(e: Event) => this._valueChanged('ac_entity', (e.target as HTMLInputElement).value)}
                />
                <span class="desc">Klima IR kontrol varlığı.</span>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

try {
  customElements.define('cosa-thermostat-card-editor', CosaThermostatCardEditor);
} catch (_) {
  // Ignored if already defined in scoped-custom-element-registry
}
