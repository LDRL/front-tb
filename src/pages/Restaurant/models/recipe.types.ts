import { AuditFields, RestaurantEntityId, RestaurantUnit } from './common.types';

/**
 * A bill of materials line describing how much of an inventory item is consumed.
 * For removals/personalizations in an order, the effective quantity can be overridden to 0.
 */
export interface RecipeComponent {
  inventoryItemId: RestaurantEntityId;
  quantity: number;
  unit: RestaurantUnit;
  optional?: boolean;
  notes?: string;
}

export interface Recipe extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  description?: string;
  /**
   * Optional sellable/catalog reference when this recipe represents a menu item.
   */
  outputItemId?: RestaurantEntityId | null;
  yieldQuantity?: number;
  yieldUnit?: RestaurantUnit;
  components: RecipeComponent[];
}
