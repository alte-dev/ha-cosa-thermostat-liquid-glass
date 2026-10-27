import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
    --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Outfit", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --card-radius: 28px;
    font-family: var(--font-family);
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;

    /* Theme Tokens - Dark Mode Defaults */
    --cosa-text-primary: #ffffff;
    --cosa-text-secondary: rgba(255, 255, 255, 0.7);
    --cosa-text-muted: rgba(255, 255, 255, 0.5);
    --cosa-track-bg: rgba(255, 255, 255, 0.08);
    --cosa-widget-bg: rgba(255, 255, 255, 0.07);
    --cosa-widget-border: rgba(255, 255, 255, 0.16);
    --cosa-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%);
    --cosa-glass-border: rgba(255, 255, 255, 0.22);
    --cosa-glass-shadow: 
      0 24px 48px -12px rgba(0, 0, 0, 0.45),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3);
    --cosa-center-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%);
    --cosa-center-glass-border: rgba(255, 255, 255, 0.2);
    --cosa-center-glass-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.4),
      inset 0 -1px 2px rgba(0, 0, 0, 0.2);
    --cosa-thumb-border: rgba(255, 255, 255, 0.95);
    --cosa-thumb-shadow: 
      0 0 16px rgba(255, 255, 255, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.35);
    --cosa-glow-blend: screen;
    --cosa-glow-opacity: 0.65;
  }

  /* Light Theme Tokens */
  .card-container.theme-light {
    --cosa-text-primary: var(--primary-text-color, #1d1d1f);
    --cosa-text-secondary: var(--secondary-text-color, rgba(60, 60, 67, 0.75));
    --cosa-text-muted: rgba(60, 60, 67, 0.55);
    --cosa-track-bg: rgba(0, 0, 0, 0.08);
    --cosa-widget-bg: rgba(255, 255, 255, 0.85);
    --cosa-widget-border: rgba(0, 0, 0, 0.09);
    --cosa-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(245, 245, 247, 0.72) 100%);
    --cosa-glass-border: rgba(0, 0, 0, 0.08);
    --cosa-glass-shadow: 
      0 16px 36px -8px rgba(0, 0, 0, 0.08),
      0 2px 6px rgba(0, 0, 0, 0.04),
      inset 0 1px 1px 0 rgba(255, 255, 255, 1);
    --cosa-center-glass-bg: linear-gradient(135deg, #ffffff 0%, rgba(246, 246, 248, 0.92) 100%);
    --cosa-center-glass-border: rgba(0, 0, 0, 0.07);
    --cosa-center-glass-shadow: 
      0 10px 24px rgba(0, 0, 0, 0.06),
      inset 0 1px 2px rgba(255, 255, 255, 1);
    --cosa-thumb-border: #ffffff;
    --cosa-thumb-shadow: 
      0 2px 10px rgba(0, 0, 0, 0.22),
      0 0 0 2px rgba(255, 94, 58, 0.35);
    --cosa-glow-blend: normal;
    --cosa-glow-opacity: 0.45;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  .card-container {
    position: relative;
    border-radius: var(--card-radius);
    padding: 24px 20px 22px;
    overflow: hidden;
    background: var(--cosa-glass-bg);
    backdrop-filter: blur(36px) saturate(200%);
    -webkit-backdrop-filter: blur(36px) saturate(200%);
    border: 1px solid var(--cosa-glass-border);
    box-shadow: var(--cosa-glass-shadow);
    color: var(--cosa-text-primary);
    transition: background 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease, color 0.3s ease;
  }

  /* Standard Home Assistant Card Mode (liquid_glass: false) */
  .card-container.standard-mode {
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.12)));
    box-shadow: var(--ha-card-box-shadow, none);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .card-container.standard-mode.theme-light {
    background: var(--ha-card-background, var(--card-background-color, #ffffff));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.05));
  }

  .card-container.standard-mode .ambient-glow {
    display: none !important;
  }

  .card-container.standard-mode .dial-center-glass {
    background: var(--ha-card-background, var(--card-background-color, #1a1a1c));
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.1)));
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  }

  .card-container.standard-mode.theme-light .dial-center-glass {
    background: var(--ha-card-background, var(--card-background-color, #f8f9fa));
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.08)));
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .card-container.standard-mode .metric-capsule,
  .card-container.standard-mode .preset-btn,
  .card-container.standard-mode .step-btn,
  .card-container.standard-mode .power-btn,
  .card-container.standard-mode .brand-logo {
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.08)));
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }

  .card-container.standard-mode.theme-light .metric-capsule,
  .card-container.standard-mode.theme-light .preset-btn,
  .card-container.standard-mode.theme-light .step-btn,
  .card-container.standard-mode.theme-light .power-btn,
  .card-container.standard-mode.theme-light .brand-logo {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.08)));
    box-shadow: none;
  }

  .card-container.standard-mode .preset-btn.active {
    background: var(--primary-color, rgba(255, 255, 255, 0.22));
    border-color: var(--primary-color, rgba(255, 255, 255, 0.35));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }

  .card-container.standard-mode .power-btn.active {
    background: var(--primary-color, rgba(255, 255, 255, 0.22));
    border-color: var(--primary-color, rgba(255, 255, 255, 0.4));
  }

  /* Ambient Dynamic Thermal Glow */
  .ambient-glow {
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    opacity: var(--cosa-glow-opacity);
    filter: blur(60px);
    transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
    mix-blend-mode: var(--cosa-glow-blend);
  }

  .card-container.state-heating .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(255, 94, 58, 0.48) 0%, rgba(255, 42, 109, 0.28) 45%, transparent 70%);
  }
  .card-container.state-cooling .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(0, 229, 255, 0.48) 0%, rgba(0, 114, 255, 0.28) 45%, transparent 70%);
  }
  .card-container.state-idle .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(130, 160, 200, 0.22) 0%, transparent 65%);
  }
  .card-container.state-off .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(50, 55, 65, 0.15) 0%, transparent 60%);
    opacity: 0.25;
  }

  /* Light Theme Glows */
  .card-container.theme-light.state-heating .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(255, 120, 80, 0.35) 0%, rgba(255, 70, 120, 0.18) 45%, transparent 70%);
  }
  .card-container.theme-light.state-cooling .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(0, 190, 255, 0.35) 0%, rgba(0, 114, 255, 0.18) 45%, transparent 70%);
  }
  .card-container.theme-light.state-idle .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(130, 160, 200, 0.18) 0%, transparent 65%);
  }
  .card-container.theme-light.state-off .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(180, 185, 195, 0.15) 0%, transparent 60%);
    opacity: 0.2;
  }

  .card-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }

  /* Header Bar */
  .header-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-logo {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .brand-logo svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: var(--cosa-text-primary);
    stroke-width: 2;
    stroke-linecap: round;
  }

  .card-title {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: var(--cosa-text-primary);
  }

  .device-badge {
    font-size: 11px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .power-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .power-btn:hover {
    filter: brightness(1.1);
    transform: scale(1.05);
  }
  .power-btn:active {
    transform: scale(0.94);
  }

  .power-btn.active {
    background: linear-gradient(135deg, rgba(255, 94, 58, 0.28), rgba(255, 94, 58, 0.12));
    border-color: rgba(255, 94, 58, 0.45);
    box-shadow: 0 0 14px rgba(255, 94, 58, 0.3);
  }

  .power-btn svg {
    width: 16px;
    height: 16px;
    stroke: var(--cosa-text-primary);
    stroke-width: 2.2;
    fill: none;
    stroke-linecap: round;
  }

  .power-btn.active svg {
    stroke: #ff5e3a;
  }

  /* System Switcher */
  .system-pill-switch {
    display: flex;
    position: relative;
    background: var(--cosa-widget-bg);
    border-radius: 20px;
    padding: 3px;
    border: 1px solid var(--cosa-widget-border);
    width: 100%;
    max-width: 280px;
  }

  .system-pill-option {
    flex: 1;
    text-align: center;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    border-radius: 17px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .system-pill-option.active {
    color: var(--cosa-text-primary);
    font-weight: 600;
    background: var(--cosa-center-glass-bg);
    border: 1px solid var(--cosa-widget-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  /* Circular Dial Area */
  .dial-container {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 6px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dial-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    overflow: visible;
  }

  .dial-track-bg {
    fill: none;
    stroke: var(--cosa-track-bg);
    stroke-width: 12;
    stroke-linecap: round;
  }

  .dial-track-active {
    fill: none;
    stroke-width: 12;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.1s linear, stroke 0.5s ease;
    filter: drop-shadow(0 0 8px rgba(255, 94, 58, 0.6));
  }

  .dial-thumb {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: var(--cosa-thumb-shadow);
    border: 3px solid var(--cosa-thumb-border);
    cursor: grab;
    transform: translate(-50%, -50%);
    z-index: 10;
    transition: transform 0.1s ease, box-shadow 0.2s ease;
  }

  .dial-thumb:active, .dial-thumb.dragging {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.15);
  }

  /* Central Glass Disc & Readout */
  .dial-center-glass {
    position: absolute;
    width: 176px;
    height: 176px;
    border-radius: 50%;
    background: var(--cosa-center-glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--cosa-center-glass-border);
    box-shadow: var(--cosa-center-glass-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    z-index: 2;
    pointer-events: none;
  }

  .state-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--cosa-text-secondary);
    margin-bottom: 2px;
  }

  .state-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #888888;
  }

  .card-container.state-heating .state-dot {
    background: #ff5e3a;
    box-shadow: 0 0 8px #ff5e3a;
    animation: pulse 1.8s infinite;
  }
  .card-container.state-cooling .state-dot {
    background: #00c6ff;
    box-shadow: 0 0 8px #00c6ff;
    animation: pulse 1.8s infinite;
  }
  .card-container.state-idle .state-dot {
    background: #4cd964;
    box-shadow: 0 0 6px #4cd964;
  }
  .card-container.state-off .state-dot {
    background: #888888;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  .target-temp-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .target-temp-number {
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -2px;
    line-height: 1;
    color: var(--cosa-text-primary);
  }

  .target-temp-degree {
    font-size: 24px;
    font-weight: 400;
    color: var(--cosa-text-secondary);
    margin-left: 2px;
  }

  .current-temp-badge {
    font-size: 12px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }

  .current-temp-val {
    color: var(--cosa-text-primary);
    font-weight: 600;
  }

  /* Micro step controls */
  .dial-step-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    width: 100%;
  }

  .step-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--cosa-text-primary);
    font-size: 20px;
    font-weight: 300;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .step-btn:hover {
    filter: brightness(1.1);
    transform: scale(1.08);
  }
  .step-btn:active {
    transform: scale(0.92);
  }

  /* Metrics Bar */
  .metrics-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
  }

  .metric-capsule {
    flex: 1;
    max-width: 140px;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    border-radius: 16px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(16px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .metric-icon {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: rgba(125, 125, 125, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .metric-icon svg {
    width: 14px;
    height: 14px;
    stroke: var(--cosa-text-primary);
    fill: none;
    stroke-width: 2;
  }

  .metric-info {
    display: flex;
    flex-direction: column;
  }

  .metric-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--cosa-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-val {
    font-size: 13px;
    font-weight: 600;
    color: var(--cosa-text-primary);
  }

  /* Presets Section */
  .presets-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--cosa-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding-left: 4px;
  }

  .presets-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
    width: 100%;
  }

  .preset-btn {
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    border-radius: 14px;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--cosa-text-secondary);
  }

  .preset-btn:hover {
    filter: brightness(1.08);
    color: var(--cosa-text-primary);
    transform: translateY(-1px);
  }

  .preset-btn:active {
    transform: scale(0.95);
  }

  .preset-btn.active {
    background: linear-gradient(135deg, rgba(255, 94, 58, 0.28), rgba(255, 42, 109, 0.12));
    border-color: rgba(255, 94, 58, 0.45);
    color: var(--cosa-text-primary);
    box-shadow: 0 4px 14px rgba(255, 94, 58, 0.25);
  }

  .card-container.theme-light .preset-btn.active {
    background: linear-gradient(135deg, rgba(255, 94, 58, 0.16), rgba(255, 42, 109, 0.1));
    border-color: rgba(255, 94, 58, 0.4);
    color: #d83a14;
  }

  .card-container.theme-light .preset-btn.active .preset-name {
    color: #d83a14;
    font-weight: 700;
  }

  .preset-icon {
    font-size: 15px;
    line-height: 1;
  }

  .preset-name {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: -0.2px;
    white-space: nowrap;
    color: var(--cosa-text-secondary);
  }

  /* AC Controls Section */
  .ac-controls {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 6px;
    border-top: 1px solid var(--cosa-widget-border);
    animation: fadeIn 0.35s ease forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ac-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .fan-speed-pills, .ac-mode-pills {
    display: flex;
    background: var(--cosa-widget-bg);
    border-radius: 12px;
    padding: 2px;
    border: 1px solid var(--cosa-widget-border);
    flex: 1;
  }

  .sub-pill {
    flex: 1;
    text-align: center;
    padding: 6px 4px;
    font-size: 11px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sub-pill:hover {
    color: var(--cosa-text-primary);
  }

  .sub-pill.active {
    background: var(--cosa-center-glass-bg);
    color: var(--cosa-text-primary);
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }
`;
