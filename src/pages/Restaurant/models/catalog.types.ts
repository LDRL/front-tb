import { ComboTemplate } from './combo.types';
import { InventoryItem } from './inventory.types';
import { ModifierGroup } from './modifier.types';
import { Recipe } from './recipe.types';

export interface RestaurantCatalog {
  schemaVersion: number;
  inventoryItems: InventoryItem[];
  recipes: Recipe[];
  modifierGroups: ModifierGroup[];
  combos: ComboTemplate[];
}

export const RESTAURANT_CATALOG_SCHEMA_VERSION = 1;
export const RESTAURANT_CATALOG_STORAGE_KEY = 'restaurant_catalog_v1';

export const defaultRestaurantCatalog: RestaurantCatalog = {
  schemaVersion: RESTAURANT_CATALOG_SCHEMA_VERSION,
  inventoryItems: [],
  recipes: [],
  modifierGroups: [],
  combos: [],
};
