import {
  RESTAURANT_CATALOG_SCHEMA_VERSION,
  RESTAURANT_CATALOG_STORAGE_KEY,
  RestaurantCatalog,
  defaultRestaurantCatalog,
} from '../models';

export interface RestaurantCatalogRepository {
  getCatalog(): Promise<RestaurantCatalog>;
  saveCatalog(catalog: RestaurantCatalog): Promise<RestaurantCatalog>;
}

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const normalizeCatalog = (raw: any): RestaurantCatalog => {
  if (!raw || typeof raw !== 'object') {
    return {
      ...defaultRestaurantCatalog,
      inventoryItems: [],
      recipes: [],
      modifierGroups: [],
      combos: [],
    };
  }

  // Future migrations can branch on raw.schemaVersion here.
  return {
    schemaVersion: RESTAURANT_CATALOG_SCHEMA_VERSION,
    inventoryItems: asArray(raw.inventoryItems),
    recipes: asArray(raw.recipes),
    modifierGroups: asArray(raw.modifierGroups),
    combos: asArray(raw.combos),
  };
};

export const localStorageRestaurantCatalogRepository: RestaurantCatalogRepository = {
  async getCatalog(): Promise<RestaurantCatalog> {
    try {
      const stored = localStorage.getItem(RESTAURANT_CATALOG_STORAGE_KEY);
      if (!stored) {
        return {
          ...defaultRestaurantCatalog,
          inventoryItems: [],
          recipes: [],
          modifierGroups: [],
          combos: [],
        };
      }
      const parsed = JSON.parse(stored);
      return normalizeCatalog(parsed);
    } catch {
      return {
        ...defaultRestaurantCatalog,
        inventoryItems: [],
        recipes: [],
        modifierGroups: [],
        combos: [],
      };
    }
  },

  async saveCatalog(catalog: RestaurantCatalog): Promise<RestaurantCatalog> {
    const normalized = normalizeCatalog(catalog);
    localStorage.setItem(RESTAURANT_CATALOG_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  },
};

// Default repository used today (localStorage). Swap for an API-backed implementation later.
export const restaurantCatalogRepository: RestaurantCatalogRepository =
  localStorageRestaurantCatalogRepository;
