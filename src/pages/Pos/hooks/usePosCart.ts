import { useCallback, useMemo, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PosCartItem } from '../models/pos.types';

type CartState = PosCartItem[];

type CartAction =
  | { type: 'ADD'; payload: Omit<PosCartItem, 'id' | 'subtotal' | 'amount'> & { amount?: number } }
  | { type: 'INCREASE'; payload: { id: string } }
  | { type: 'DECREASE'; payload: { id: string } }
  | { type: 'SET_AMOUNT'; payload: { id: string; amount: number } }
  | { type: 'REMOVE'; payload: { id: string } }
  | { type: 'CLEAR' };

const calcSubtotal = (price: number, amount: number) => Number((price * amount).toFixed(2));

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const { payload } = action;
      const addAmount = payload.amount && payload.amount > 0 ? payload.amount : 1;
      const existingIndex = state.findIndex(
        (item) => item.codProductPresentation === payload.codProductPresentation
      );

      if (existingIndex >= 0) {
        const updated = [...state];
        const newAmount = updated[existingIndex].amount + addAmount;
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount: newAmount,
          subtotal: calcSubtotal(updated[existingIndex].price, newAmount)
        };
        return updated;
      }

      const item: PosCartItem = {
        id: uuidv4(),
        codProductPresentation: payload.codProductPresentation,
        productCode: payload.productCode,
        name: payload.name,
        imageUrl: payload.imageUrl,
        brandName: payload.brandName,
        categoryName: payload.categoryName,
        presentationName: payload.presentationName,
        price: payload.price,
        amount: addAmount,
        subtotal: calcSubtotal(payload.price, addAmount)
      };
      return [...state, item];
    }
    case 'INCREASE': {
      return state.map((item) => {
        if (item.id !== action.payload.id) return item;
        const newAmount = item.amount + 1;
        return { ...item, amount: newAmount, subtotal: calcSubtotal(item.price, newAmount) };
      });
    }
    case 'DECREASE': {
      return state
        .map((item) => {
          if (item.id !== action.payload.id) return item;
          const newAmount = item.amount - 1;
          if (newAmount <= 0) return null;
          return { ...item, amount: newAmount, subtotal: calcSubtotal(item.price, newAmount) };
        })
        .filter((item): item is PosCartItem => item !== null);
    }
    case 'SET_AMOUNT': {
      const amount = action.payload.amount;
      if (amount <= 0) {
        return state.filter((item) => item.id !== action.payload.id);
      }
      return state.map((item) => {
        if (item.id !== action.payload.id) return item;
        return { ...item, amount, subtotal: calcSubtotal(item.price, amount) };
      });
    }
    case 'REMOVE': {
      return state.filter((item) => item.id !== action.payload.id);
    }
    case 'CLEAR': {
      return [];
    }
    default:
      return state;
  }
}

export const usePosCart = () => {
  const [rows, dispatch] = useReducer(cartReducer, []);

  const addItem = useCallback(
    (item: Omit<PosCartItem, 'id' | 'subtotal' | 'amount'> & { amount?: number }) => dispatch({ type: 'ADD', payload: item }),
    []
  );
  const increase = useCallback((id: string) => dispatch({ type: 'INCREASE', payload: { id } }), []);
  const decrease = useCallback((id: string) => dispatch({ type: 'DECREASE', payload: { id } }), []);
  const setAmount = useCallback((id: string, amount: number) => dispatch({ type: 'SET_AMOUNT', payload: { id, amount } }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE', payload: { id } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const total = useMemo(() => rows.reduce((acc, item) => acc + item.subtotal, 0), [rows]);
  const totalItems = useMemo(() => rows.reduce((acc, item) => acc + item.amount, 0), [rows]);

  return { rows, addItem, increase, decrease, setAmount, removeItem, clearCart, total, totalItems };
};
