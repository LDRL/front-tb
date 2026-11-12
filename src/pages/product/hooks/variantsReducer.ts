import { v4 as uuidv4 } from 'uuid';

import { VariantDetail } from '../models/product.domain.type';

export const emptyVariant = (): VariantDetail => ({
  idtalla: null,
  idcolor: null,
  sku: '',
  estado: 1,
});

export type VariantsAction =
  | { type: 'add' }
  | { type: 'update'; id: string; patch: Partial<VariantDetail> }
  | { type: 'remove'; id: string }
  | { type: 'hydrate'; variantes: VariantDetail[] }
  | { type: 'clear' };

export const variantsReducer = (
  state: VariantDetail[],
  action: VariantsAction
): VariantDetail[] => {
  switch (action.type) {
    case 'add':
      return [...state, { ...emptyVariant(), id: uuidv4() }];

    case 'update':
      return state.map((r) => (r.id === action.id ? { ...r, ...action.patch } : r));

    case 'remove':
      return state.filter((r) => r.id !== action.id);

    case 'hydrate':
      return action.variantes.map((v) => ({ ...v, id: uuidv4() }));

    case 'clear':
      return [];

    default:
      return state;
  }
};
