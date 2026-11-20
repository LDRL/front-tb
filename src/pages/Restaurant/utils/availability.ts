import {
  ComboTemplate,
  ConfiguredCombo,
  ConfiguredComboSlotSelection,
  ModifierGroup,
  ModifierOption,
  Recipe,
  RestaurantCatalog,
  SelectedModifierOption,
} from '../models';

export type ConsumptionMap = Record<string, number>;

export interface AvailabilityIssue {
  inventoryItemId: string;
  itemName: string;
  required: number;
  available: number;
}

const addConsumption = (map: ConsumptionMap, itemId: string, qty: number) => {
  if (!itemId || !Number.isFinite(qty) || qty === 0) return;
  map[itemId] = (map[itemId] || 0) + qty;
};

const getRecipe = (catalog: RestaurantCatalog, recipeId?: string | null): Recipe | undefined =>
  recipeId ? catalog.recipes.find((r) => r.id === recipeId) : undefined;

const getModifierOption = (group: ModifierGroup | undefined, optionId: string): ModifierOption | undefined =>
  group?.options.find((o) => o.id === optionId);

const consumeRecipe = (catalog: RestaurantCatalog, recipeId: string, into: ConsumptionMap, multiplier = 1) => {
  const recipe = getRecipe(catalog, recipeId);
  if (!recipe) return;
  recipe.components.forEach((c) => {
    addConsumption(into, c.inventoryItemId, Number(c.quantity || 0) * multiplier);
  });
};

const applySelectedModifiersToConsumption = (
  catalog: RestaurantCatalog,
  modifiers: SelectedModifierOption[] | undefined,
  into: ConsumptionMap,
  groups: ModifierGroup[]
) => {
  (modifiers || []).forEach((sel) => {
    const group = groups.find((g) => g.id === sel.groupId) || catalog.modifierGroups.find((g) => g.id === sel.groupId);
    const opt = getModifierOption(group, sel.optionId);
    if (!group || !opt) return;

    const qty = Number(sel.quantity ?? 1);
    const recipeId = opt.sourceType === 'recipe' ? opt.sourceId : opt.targetRecipeId || opt.inventoryImpact?.recipeId || null;
    const productItemId =
      opt.sourceType === 'product'
        ? opt.sourceId
        : opt.targetInventoryItemId || opt.inventoryImpact?.inventoryItemId || null;

    if (group.kind === 'removal') {
      // Preventive approximation: removing an ingredient means do not consume it.
      const targetId = productItemId;
      const impactQty = Number(opt.inventoryImpact?.quantity ?? 1);
      if (targetId) addConsumption(into, targetId, -(qty * impactQty));
      return;
    }

    let consumed = false;
    if (recipeId) {
      consumeRecipe(catalog, recipeId, into, qty);
      consumed = true;
    }
    if (productItemId) {
      const impactQty = Number(opt.inventoryImpact?.quantity ?? 1);
      addConsumption(into, productItemId, qty * impactQty);
      consumed = true;
    }

    // Fallback for legacy options without explicit source
    if (!consumed) {
      const legacyTarget = opt.targetInventoryItemId || opt.inventoryImpact?.inventoryItemId || null;
      if (legacyTarget) {
        const impactQty = Number(opt.inventoryImpact?.quantity ?? 1);
        addConsumption(into, legacyTarget, qty * impactQty);
      }
    }
  });
};

const consumeSlotSelection = (
  catalog: RestaurantCatalog,
  combo: ComboTemplate,
  selection: ConfiguredComboSlotSelection,
  into: ConsumptionMap
) => {
  const slot = combo.slots.find((s) => s.id === selection.slotId);
  if (!slot) return;
  const option = slot.options.find((o) => o.id === selection.optionId);
  if (!option) return;

  const multiplier = Number(selection.quantity ?? 1);

  if (option.itemId) addConsumption(into, option.itemId, multiplier);
  if (option.recipeId) consumeRecipe(catalog, option.recipeId, into, multiplier);

  // If option has no explicit item/recipe but a selection modifier targets a concrete item (e.g. drink choice modeled as modifier),
  // the modifier impact logic below will account for it.

  const slotGroups = (slot.modifierGroupIds || [])
    .map((id) => catalog.modifierGroups.find((g) => g.id === id) || slot.inlineModifierGroups?.find((g) => g.id === id))
    .filter((g): g is ModifierGroup => !!g)
    .concat(slot.inlineModifierGroups || []);
  const optionGroups = (option.modifierGroupIds || [])
    .map((id) => catalog.modifierGroups.find((g) => g.id === id) || option.inlineModifierGroups?.find((g) => g.id === id))
    .filter((g): g is ModifierGroup => !!g)
    .concat(option.inlineModifierGroups || []);

  // Deduplicate groups by id
  const allGroupsMap = new Map<string, ModifierGroup>();
  [...slotGroups, ...optionGroups].forEach((g) => allGroupsMap.set(g.id, g));
  const allGroups = Array.from(allGroupsMap.values());

  applySelectedModifiersToConsumption(catalog, selection.modifiers, into, allGroups);
};

export const computeConfiguredComboConsumption = (
  catalog: RestaurantCatalog,
  combo: ComboTemplate | undefined,
  configured: ConfiguredCombo,
  quantity = 1
): ConsumptionMap => {
  const into: ConsumptionMap = {};
  if (!combo) return into;

  configured.selections.forEach((sel) => consumeSlotSelection(catalog, combo, sel, into));

  const comboGroups = (combo.modifierGroupIds || [])
    .map((id) => catalog.modifierGroups.find((g) => g.id === id) || combo.inlineModifierGroups?.find((g) => g.id === id))
    .filter((g): g is ModifierGroup => !!g)
    .concat(combo.inlineModifierGroups || []);
  const comboGroupsMap = new Map<string, ModifierGroup>();
  comboGroups.forEach((g) => comboGroupsMap.set(g.id, g));
  applySelectedModifiersToConsumption(catalog, configured.modifiers, into, Array.from(comboGroupsMap.values()));

  // Apply quantity multiplier and clamp negative (over-removal shouldn't create stock)
  const result: ConsumptionMap = {};
  Object.entries(into).forEach(([id, qty]) => {
    const total = qty * quantity;
    if (total > 0) result[id] = total;
  });
  return result;
};

export const mergeConsumptions = (...maps: ConsumptionMap[]): ConsumptionMap => {
  const out: ConsumptionMap = {};
  maps.forEach((m) => Object.entries(m).forEach(([id, qty]) => addConsumption(out, id, qty)));
  return out;
};

export const getAvailabilityIssues = (
  catalog: RestaurantCatalog,
  required: ConsumptionMap
): AvailabilityIssue[] => {
  const issues: AvailabilityIssue[] = [];
  Object.entries(required).forEach(([itemId, qty]) => {
    const item = catalog.inventoryItems.find((i) => i.id === itemId);
    if (!item) return;
    if (item.trackInventory === false) return;
    const available = item.stock;
    if (available == null) return; // unknown stock: don't block preventively
    if (Number(available) < qty) {
      issues.push({
        inventoryItemId: itemId,
        itemName: item.name,
        required: qty,
        available: Number(available),
      });
    }
  });
  return issues;
};

export const formatAvailabilityIssues = (issues: AvailabilityIssue[]): string => {
  if (issues.length === 0) return '';
  return issues
    .map((i) => `${i.itemName}: requerido ${i.required}, disponible ${i.available}`)
    .join(' | ');
};
