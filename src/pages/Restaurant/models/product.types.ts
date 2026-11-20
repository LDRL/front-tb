import { AuditFields, RestaurantEntityId } from './common.types';

export interface MenuProductRecipeRef {
  recipeId: RestaurantEntityId;
  quantity?: number;
}

export interface MenuProductPriceOption {
  id: string;
  name: string;
  price: number;
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
  /** Personalization/modifier groups available for this product. */
  personalizationGroupIds: RestaurantEntityId[];
}