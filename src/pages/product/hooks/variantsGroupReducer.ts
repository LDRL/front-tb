import { v4 as uuidv4 } from 'uuid';

import { VariantDetail, VariantGroupDetail, VariantGroupTalla } from '../models/product.domain.type';

export const emptyVariantGroup = (): VariantGroupDetail => ({
  idcolor: null,
  tallas: [],
  hasBase: false,
  baseSku: '',
  baseEstado: 1,
});

export type VariantsGroupAction =
  | { type: 'addGroup' }
  | { type: 'updateGroup'; id: string; patch: Partial<VariantGroupDetail> }
  | { type: 'removeGroup'; id: string }
  | { type: 'setGroupTallas'; id: string; tallas: VariantGroupTalla[] }
  | { type: 'hydrate'; variantes: VariantDetail[] }
  | { type: 'clear' };

const groupKey = (idcolor: number | null) => `c:${idcolor ?? 'none'}`;

export const variantsGroupReducer = (
  state: VariantGroupDetail[],
  action: VariantsGroupAction
): VariantGroupDetail[] => {
  switch (action.type) {
    case 'addGroup':
      return [...state, { ...emptyVariantGroup(), id: uuidv4() }];

    case 'updateGroup':
      return state.map((g) => (g.id === action.id ? { ...g, ...action.patch } : g));

    case 'setGroupTallas':
      return state.map((g) => (g.id === action.id ? { ...g, tallas: action.tallas } : g));

    case 'removeGroup':
      return state.filter((g) => g.id !== action.id);

    case 'hydrate': {
      const map = new Map<string, VariantGroupDetail>();
      for (const v of action.variantes || []) {
        const key = groupKey(v.idcolor ?? null);
        if (!map.has(key)) {
          map.set(key, {
            id: uuidv4(),
            idcolor: v.idcolor ?? null,
            colorNombre: v.colorNombre ?? null,
            colorHex: v.colorHex ?? null,
            tallas: [],
            hasBase: false,
            baseSku: '',
            baseEstado: 1,
          });
        }
        const g = map.get(key)!;
        if (v.idtalla != null) {
          if (!g.tallas.some((t) => t.idtalla === v.idtalla)) {
            g.tallas.push({
              idtalla: v.idtalla,
              tallaNombre: v.tallaNombre ?? undefined,
              sku: v.sku ?? '',
              idvariante: v.idvariante,
              estado: v.estado ?? 1,
            });
          }
        } else {
          // variante sin talla (color solo) - preservar
          g.hasBase = true;
          g.baseIdvariante = v.idvariante;
          g.baseSku = v.sku ?? '';
          g.baseEstado = v.estado ?? 1;
        }
        if (!g.colorNombre && v.colorNombre) g.colorNombre = v.colorNombre;
        if (!g.colorHex && v.colorHex) g.colorHex = v.colorHex;
      }
      return Array.from(map.values());
    }

    case 'clear':
      return [];

    default:
      return state;
  }
};

export const flattenVariantGroups = (groups: VariantGroupDetail[]): VariantDetail[] => {
  const out: VariantDetail[] = [];
  for (const g of groups) {
    if (g.hasBase) {
      out.push({
        idvariante: g.baseIdvariante,
        idcolor: g.idcolor ?? null,
        idtalla: null,
        sku: g.baseSku ?? '',
        estado: g.baseEstado ?? 1,
        colorNombre: g.colorNombre ?? null,
        colorHex: g.colorHex ?? null,
        tallaNombre: null,
      });
    }
    for (const t of g.tallas || []) {
      out.push({
        idvariante: t.idvariante,
        idcolor: g.idcolor ?? null,
        idtalla: t.idtalla ?? null,
        sku: t.sku ?? '',
        estado: t.estado ?? 1,
        colorNombre: g.colorNombre ?? null,
        colorHex: g.colorHex ?? null,
        tallaNombre: t.tallaNombre ?? null,
      });
    }
  }
  return out;
};
