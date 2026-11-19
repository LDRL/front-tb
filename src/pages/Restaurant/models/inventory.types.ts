import { AuditFields, RestaurantEntityId, RestaurantUnit } from './common.types';

export type InventoryItemKind = 'product' | 'ingredient' | 'prepared';

export interface InventoryItem extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  kind: InventoryItemKind;
  sku?: string;
  unit: RestaurantUnit;
  /**
   * Current stock expressed in `unit`.
   * Optional because some items may not be stock-tracked.
   */
  stock?: number | null;
  minStock?: number | null;
  trackInventory?: boolean;
  /**
   * Optional reference to an existing catalog/product record when applicable.
   */
  sourceProductId?: number | string | null;
  notes?: string;
}
