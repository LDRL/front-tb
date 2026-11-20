export type BusinessMode = 'retail' | 'restaurant';

export interface AppFeatures {
  recipes: boolean;
  modifiers: boolean;
  inventoryByIngredients: boolean;
  kds: boolean;
}

export interface AppConfig {
  schemaVersion: number;
  businessMode: BusinessMode;
  features: AppFeatures;
}

export type ConfigStatus = 'idle' | 'loading' | 'ready' | 'saving' | 'error';

export interface ConfigState {
  config: AppConfig;
  status: ConfigStatus;
  error: string | null;
}

export const CONFIG_SCHEMA_VERSION = 1;
export const CONFIG_STORAGE_KEY = 'app_config_v1';

export const defaultAppFeatures: AppFeatures = {
  recipes: false,
  modifiers: false,
  inventoryByIngredients: false,
  kds: false,
};

export const defaultAppConfig: AppConfig = {
  schemaVersion: CONFIG_SCHEMA_VERSION,
  businessMode: 'retail',
  features: { ...defaultAppFeatures },
};

export const defaultConfigState: ConfigState = {
  config: { ...defaultAppConfig, features: { ...defaultAppFeatures } },
  status: 'idle',
  error: null,
};
