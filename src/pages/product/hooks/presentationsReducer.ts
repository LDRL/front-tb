import { v4 as uuidv4 } from 'uuid';

import { Detail, PrecioCliente } from '../models/product.domain.type';

export const emptyDetail = (): Detail => ({
  idPresentation: 0,
  price: 0,
  barCode: '',
  baseQuantity: 0,
  name: '',
});

export type PresentationsAction =
  | { type: 'add' }
  | { type: 'update'; id: string; patch: Partial<Detail> }
  | { type: 'remove'; id: string }
  | { type: 'updatePrecios'; id: string; precios: PrecioCliente[] }
  | { type: 'hydrate'; presentacions: Detail[] }
  | { type: 'clear' };

export const presentationsReducer = (
  state: Detail[],
  action: PresentationsAction
): Detail[] => {
  switch (action.type) {
    case 'add':
      return [...state, { ...emptyDetail(), id: uuidv4() }];

    case 'update':
      return state.map(r => (r.id === action.id ? { ...r, ...action.patch } : r));

    case 'updatePrecios':
      return state.map(r => (r.id === action.id ? { ...r, precios: action.precios } : r));

    case 'remove':
      return state.filter(r => r.id !== action.id);

    // Assigns the UI row keys the form relies on. Presentation names are not
    // mapped back by the adapter, so rows coming from the API have no name
    // until one is picked; the tab falls back to the options list for the label.
    case 'hydrate':
      return action.presentacions.map(p => ({ ...p, id: uuidv4() }));

    case 'clear':
      return [];

    default:
      return state;
  }
};
