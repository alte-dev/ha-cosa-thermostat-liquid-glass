export interface CosaCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_ac?: boolean; // Default false: Combi only!
  ac_entity?: string;
  temp_step?: number;
  min_temp?: number;
  max_temp?: number;
  show_ambient_glow?: boolean;
  liquid_glass?: boolean;
  theme_mode?: 'auto' | 'dark' | 'light';
  glass_style?: string;
}

export interface HomeAssistantEntityState {
  entity_id: string;
  state: string;
  attributes: {
    current_temperature?: number;
    temperature?: number;
    current_humidity?: number;
    preset_mode?: string;
    hvac_action?: string;
    fan_mode?: string;
    min_temp?: number;
    max_temp?: number;
    target_temp_step?: number;
    [key: string]: any;
  };
}

export interface HomeAssistant {
  states: Record<string, HomeAssistantEntityState>;
  callService: (domain: string, service: string, serviceData?: Record<string, any>) => Promise<void> | void;
  themes?: {
    darkMode?: boolean;
    theme?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
