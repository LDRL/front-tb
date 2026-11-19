import { ConfiguredCombo, RestaurantEntityId } from './';

export interface RestaurantOrderLine {
  id: RestaurantEntityId;
  type: 'combo';
  quantity: number;
  configuredCombo: ConfiguredCombo;
  lineTotal: number;
  notes?: string;
}

export interface RestaurantOrderPayload {
  channel: 'restaurant';
  createdAt: string;
  items: Array<{
    lineId: string;
    type: 'combo';
    quantity: number;
    comboId: string;
    comboName?: string;
    basePrice: number;
    unitTotal: number;
    lineTotal: number;
    selections: ConfiguredCombo['selections'];
    modifiers?: ConfiguredCombo['modifiers'];
    notes?: string;
  }>;
  subtotal: number;
  total: number;
}

export const buildRestaurantOrderPayload = (lines: RestaurantOrderLine[]): RestaurantOrderPayload => {
  const items = lines.map((line) => ({
    lineId: line.id,
    type: line.type as 'combo',
    quantity: line.quantity,
    comboId: line.configuredCombo.comboId,
    comboName: line.configuredCombo.comboName,
    basePrice: line.configuredCombo.basePrice,
    unitTotal: line.configuredCombo.totalPrice,
    lineTotal: Number((line.configuredCombo.totalPrice * line.quantity).toFixed(2)),
    selections: line.configuredCombo.selections,
    modifiers: line.configuredCombo.modifiers,
    notes: line.notes,
  }));

  const total = Number(items.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2));

  return {
    channel: 'restaurant',
    createdAt: new Date().toISOString(),
    items,
    subtotal: total,
    total,
  };
};
