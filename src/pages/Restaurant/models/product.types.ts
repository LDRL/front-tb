import { AuditFields, RestaurantEntityId } from './common.types';
import { ModifierOptionSourceType } from './modifier.types';

export interface MenuProductRecipeRef {
  recipeId: RestaurantEntityId;
  quantity?: number;
}

export interface MenuProductPriceOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuProductIncludedItemOption {
  id: string;
  name: string;
  sourceType: ModifierOptionSourceType;
  sourceId: RestaurantEntityId | null;
  priceDelta?: number;
}

export interface MenuProductIncludedItem {
  id: string;
  name: string;
  /** fixed: each instance uses the defined base; choice: each instance is selected from options */
  kind: 'fixed' | 'choice';
  /** Number of instances/selections included (e.g. 2 sandwiches, 2 drinks) */
  quantity: number;
  /** Base recipe for fixed items (each instance can have removable components configured) */
  recipeId?: RestaurantEntityId | null;
  /** Base inventory/product item for fixed items when not recipe-based */
  inventoryItemId?: RestaurantEntityId | null;
  /** Options to choose from for choice items */
  options?: MenuProductIncludedItemOption[];
  /** For choice items: allow selecting the same option more than once */
  allowRepeat?: boolean;
  minSelections?: number;
  maxSelections?: number;
}

export interface MenuProduct extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  categoryId?: number | null;
  description?: string;
  /** Stored as data URL/base64 or remote URL for local catalog usage. */
  image?: string | null;
  /** Single recipe associated to this product (new flow). */
  recipeId?: RestaurantEntityId | null;
  /** Base/main price for this product. */
  price?: number;
  /** Base price (legacy/compat). */
  basePrice?: number;
  /** Additional price options (variant name + price). */
  priceOptions?: MenuProductPriceOption[];
  /** Recipes that compose this product (legacy/compat). */
  recipes?: MenuProductRecipeRef[];
  /** Structural composition / included instances for composed products (e.g. combos). */
  includedItems?: MenuProductIncludedItem[];
  /** Personalization/modifier groups available for this product. */
  personalizationGroupIds: RestaurantEntityId[];
}