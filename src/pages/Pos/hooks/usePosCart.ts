import { useCallback, useMemo, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PosCartItem } from '../models/pos.types';
import { getPresentationPrice } from '../utils/posPricing';

type CartState = PosCartItem[];

type CartAction =
  | { type: 'ADD'; payload: Omit<PosCartItem, 'id' | 'subtotal' | 'amount'> & { amount?: number } }
  | { type: 'INCREASE'; payload: { id: string } }
  | { type: 'DECREASE'; payload: { id: string } }
  | { type: 'SET_AMOUNT'; payload: { id: string; amount: number } }
  | { type: 'REMOVE'; payload: { id: string } }
  | { type: 'SET_ROWS'; payload: PosCartItem[] }
  | { type: 'REPRICE'; payload: { idTypeCli?: number } }
  | { type: 'CLEAR' };

const calcSubtotal = (price: number, amount: number) => Number((price * amount).toFixed(2));

const sameLine = (
  a: PosCartItem,
  b: { codProductPresentation: string | number; idvariante?: number | null }
) =>
  String(a.codProductPresentation) === String(b.codProductPresentation) &&
  (a.idvariante ?? null) === (b.idvariante ?? null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const { payload } = action;
      const addAmount = payload.amount && payload.amount > 0 ? payload.amount : 1;
      const existingIndex = state.findIndex((item) =>
        sameLine(item, {
          codProductPresentation: payload.codProductPresentation,
          idvariante: payload.idvariante,
        })
      );

      if (existingIndex >= 0) {
        const updated = [...state];
        const newAmount = updated[existingIndex].amount + addAmount;
        // keep latest pricing refs/price
        const base = { ...updated[existingIndex], ...payload };
        updated[existingIndex] = {
          ...base,
          id: updated[existingIndex].id,
          amount: newAmount,
          subtotal: calcSubtotal(base.price, newAmount),
        };
        return updated;
      }

      const newItem: PosCartItem = {
        id: uuidv4(),
        codProductPresentation: payload.codProductPresentation,
        idvariante: payload.idvariante ?? null,
        variantLabel: payload.variantLabel,
        productCode: payload.productCode,
        name: payload.name,
        imageUrl: payload.imageUrl,
        brandName: payload.brandName,
        categoryName: payload.categoryName,
        presentationName: payload.presentationName,
        price: payload.price,
        amount: addAmount,
        subtotal: calcSubtotal(payload.price, addAmount),
        stock: payload.stock ?? null,
        precios: payload.precios,
        preciosVariante: payload.preciosVariante,
        basePrice: payload.basePrice ?? payload.price,
      };

      return [...state, newItem];
    }
    case 'INCREASE': {
      return state.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              amount: item.amount + 1,
              subtotal: calcSubtotal(item.price, item.amount + 1),
            }
          : item
      );
    }
    case 'DECREASE': {
      return state.map((item) => {
        if (item.id !== action.payload.id) return item;
        const newAmount = Math.max(1, item.amount - 1);
        return { ...item, amount: newAmount, subtotal: calcSubtotal(item.price, newAmount) };
      });
    }
    case 'SET_AMOUNT': {
      const newAmount = action.payload.amount < 1 ? 1 : Math.floor(action.payload.amount);
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, amount: newAmount, subtotal: calcSubtotal(item.price, newAmount) }
          : item
      );
    }
    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload.id);
    case 'SET_ROWS':
      return action.payload;
    case 'REPRICE': {
      const idTypeCli = action.payload.idTypeCli;
      return state.map((item) => {
        const price = getPresentationPrice(
          { price: item.basePrice ?? item.price, precios: item.precios, preciosVariante: item.preciosVariante },
          idTypeCli,
          item.idvariante
        );
        return { ...item, price, subtotal: calcSubtotal(price, item.amount) };
      });
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export const usePosCart = () => {
  const [rows, dispatch] = useReducer(cartReducer, []);

  const addItem = useCallback(
    (item: Omit<PosCartItem, 'id' | 'subtotal' | 'amount'> & { amount?: number }) => {
      dispatch({ type: 'ADD', payload: item });
    },
    []
  );

  const increase = useCallback((id: string) => dispatch({ type: 'INCREASE', payload: { id } }), []);
  const decrease = useCallback((id: string) => dispatch({ type: 'DECREASE', payload: { id } }), []);
  const setAmount = useCallback(
    (id: string, amount: number) => dispatch({ type: 'SET_AMOUNT', payload: { id, amount } }),
    []
  );
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE', payload: { id } }), []);
  const setRows = useCallback((items: PosCartItem[]) => dispatch({ type: 'SET_ROWS', payload: items }), []);
  const reprice = useCallback((idTypeCli?: number) => dispatch({ type: 'REPRICE', payload: { idTypeCli } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const total = useMemo(
    () => Number(rows.reduce((acc, r) => acc + r.subtotal, 0).toFixed(2)),
    [rows]
  );

  return { rows, addItem, increase, decrease, setAmount, removeItem, setRows, reprice, clearCart, total };
};
