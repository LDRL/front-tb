import { AuditFields, RestaurantEntityId } from './common.types';
import { ModifierGroup } from './modifier.types';

export type ComboPricingMode = 'fixed' | 'sum' | 'base_plus_options';

export interface ComboSlotOption extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  /**
   * References the sellable/prepared item, product, or recipe represented by this option.
   */
  itemId?: RestaurantEntityId | null;
  recipeId?: RestaurantEntityId | null;
  priceDelta?: number;
  modifierGroupIds?: RestaurantEntityId[];
  inlineModifierGroups?: ModifierGroup[];
}

export interface ComboSlot extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  description?: string;
  quantity: number;
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: ComboSlotOption[];
  modifierGroupIds?: RestaurantEntityId[];
  inlineModifierGroups?: ModifierGroup[];
}

export interface ComboTemplate extends AuditFields {
  id: RestaurantEntityId;
  name: string;
  description?: string;
  basePrice: number;
  pricingMode?: ComboPricingMode;
  slots: ComboSlot[];
  modifierGroupIds?: RestaurantEntityId[];
  inlineModifierGroups?: ModifierGroup[];
}

export interface SelectedModifierOption {
  groupId: RestaurantEntityId;
  optionId: RestaurantEntityId;
  optionName?: string;
  quantity?: number;
  priceDelta?: number;
}

export interface ConfiguredComboSlotSelection {
  slotId: RestaurantEntityId;
  slotName?: string;
  optionId: RestaurantEntityId;
  optionName?: string;
  quantity?: number;
  priceDelta?: number;
  modifiers?: SelectedModifierOption[];
}

export interface ConfiguredCombo {
  comboId: RestaurantEntityId;
  comboName?: string;
  basePrice: number;
  totalPrice: number;
  selections: ConfiguredComboSlotSelection[];
  modifiers?: SelectedModifierOption[];
  notes?: string;
}
