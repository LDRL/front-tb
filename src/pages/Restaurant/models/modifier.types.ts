import { AuditFields, RestaurantEntityId, RestaurantUnit } from './common.types';

export type ModifierSelectionType = 'single' | 'multiple';

export type ModifierGroupKind = 'selection' | 'removal' | 'extra';

export interface ModifierInventoryImpact {
  inventoryItemId?: RestaurantEntityId | null;
  recipeId?: RestaurantEntityId | null;
  /**
   * Quantity impact per selected option instance.
   * For removals this can represent the amount to omit from the base recipe.
   */
  quantity?: number;
  unit?: RestaurantUnit;
  trackInventory?: boolean;
}

export interface ModifierOption extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  priceDelta?: number;
  /**
   * Target component affected by this option (e.g. an ingredient in a sandwich recipe).
   * Useful for "sin cebolla", "sin queso", etc.
   */
  targetInventoryItemId?: RestaurantEntityId | null;
  targetRecipeId?: RestaurantEntityId | null;
  inventoryImpact?: ModifierInventoryImpact | null;
}

export interface ModifierGroup extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  kind: ModifierGroupKind;
  selectionType: ModifierSelectionType;
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  /**
   * When true, options in this group apply to a specific combo slot/component.
   */
  appliesToSlotId?: RestaurantEntityId | null;
  options: ModifierOption[];
}
