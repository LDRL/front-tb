import {
  AppConfig,
  CONFIG_SCHEMA_VERSION,
  CONFIG_STORAGE_KEY,
  defaultAppConfig,
  defaultAppFeatures,
} from '../models';

export interface ConfigRepository {
  getConfig(): Promise<AppConfig>;
  saveConfig(config: AppConfig): Promise<AppConfig>;
}

const isValidBusinessMode = (value: unknown): value is AppConfig['businessMode'] =>
  value === 'retail' || value === 'restaurant';

const normalizeFeatures = (raw: any): AppConfig['features'] => {
  const features = raw && typeof raw === 'object' ? raw : {};
  return {
    combos: typeof features.combos === 'boolean' ? features.combos : defaultAppFeatures.combos,
    recipes: typeof features.recipes === 'boolean' ? features.recipes : defaultAppFeatures.recipes,
    modifiers:
      typeof features.modifiers === 'boolean' ? features.modifiers : defaultAppFeatures.modifiers,
    inventoryByIngredients:
      typeof features.inventoryByIngredients === 'boolean'
        ? features.inventoryByIngredients
        : defaultAppFeatures.inventoryByIngredients,
    kds: typeof features.kds === 'boolean' ? features.kds : defaultAppFeatures.kds,
  };
};

const normalizeConfig = (raw: any): AppConfig => {
  if (!raw || typeof raw !== 'object') {
    return {
      ...defaultAppConfig,
      features: { ...defaultAppFeatures },
    };
  }

  // Future migrations can branch on raw.schemaVersion here.
  const businessMode = isValidBusinessMode(raw.businessMode)
    ? raw.businessMode
    : defaultAppConfig.businessMode;

  return {
    schemaVersion: CONFIG_SCHEMA_VERSION,
    businessMode,
    features: normalizeFeatures(raw.features),
  };
};

export const localStorageConfigRepository: ConfigRepository = {
  async getConfig(): Promise<AppConfig> {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!stored) {
        return {
          ...defaultAppConfig,
          features: { ...defaultAppFeatures },
        };
      }
      const parsed = JSON.parse(stored);
      return normalizeConfig(parsed);
    } catch {
      return {
        ...defaultAppConfig,
        features: { ...defaultAppFeatures },
      };
    }
  },

  async saveConfig(config: AppConfig): Promise<AppConfig> {
    const normalized = normalizeConfig(config);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  },
};

// Default repository used by the app today (localStorage). Swap this implementation
// for an API-backed repository when the backend configuration endpoint is available.
export const configRepository: ConfigRepository = localStorageConfigRepository;
