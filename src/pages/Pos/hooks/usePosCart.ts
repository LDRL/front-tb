import { useCallback, useMemo, useReducer } from 'react';
import { toast } from 'react-toastify';
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

const normalizeStock = (stock?: number | null): number | null => {
  if (stock == null) return null;
  const n = Number(stock);
  return Number.isFinite(n) ? n : null;
};

const clampAmountToStock = (amount: number, stock?: number | null): number => {
  const normalizedAmount = amount < 1 ? 1 : Math.floor(amount);
  const normalizedStock = normalizeStock(stock);
  if (normalizedStock == null) return normalizedAmount;
  return Math.min(normalizedAmount, Math.max(0, Math.floor(normalizedStock)));
};

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
        const base = { ...updated[existingIndex], ...payload };
        const newAmount = clampAmountToStock(updated[existingIndex].amount + addAmount, base.stock);
        // keep latest pricing refs/price
        updated[existingIndex] = {
          ...base,
          id: updated[existingIndex].id,
          amount: newAmount,
          subtotal: calcSubtotal(base.price, newAmount),
        };
        return updated;
      }

      const amount = clampAmountToStock(addAmount, payload.stock);
      
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
        amount,
        subtotal: calcSubtotal(payload.price, amount),
        stock: payload.stock ?? null,
        precios: payload.precios,
        preciosVariante: payload.preciosVariante,
        basePrice: payload.basePrice ?? payload.price,
      };

      return [...state, newItem];
    }
    case 'INCREASE': {
      return state.map((item) => {
        if (item.id !== action.payload.id) return item;
        const newAmount = clampAmountToStock(item.amount + 1, item.stock);
        return {
          ...item,
          amount: newAmount,
          subtotal: calcSubtotal(item.price, newAmount),
        };
      });
    }
    case 'DECREASE': {
      return state.map((item) => {
        if (item.id !== action.payload.id) return item;
        const newAmount = Math.max(1, item.amount - 1);
        return { ...item, amount: newAmount, subtotal: calcSubtotal(item.price, newAmount) };
      });
    }
    case 'SET_AMOUNT': {
      return state.map((item) => {
        if (item.id !== action.payload.id) return item;
        const newAmount = clampAmountToStock(action.payload.amount, item.stock);
        return { ...item, amount: newAmount, subtotal: calcSubtotal(item.price, newAmount) };
      });
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
      const addAmount = item.amount && item.amount > 0 ? item.amount : 1;
      const stock = normalizeStock(item.stock);
      if (stock != null && stock <= 0) {
        toast.warning('No hay stock disponible para este producto');
        return false;
      }

      const existing = rows.find((row) =>
        sameLine(row, {
          codProductPresentation: item.codProductPresentation,
          idvariante: item.idvariante,
        })
      );
      const effectiveStock = normalizeStock(existing?.stock ?? item.stock);
      const currentAmount = existing?.amount ?? 0;

      if (effectiveStock != null && currentAmount + addAmount > effectiveStock) {
        toast.warning('No puedes agregar una cantidad mayor al stock disponible');
        return false;
      }

      dispatch({ type: 'ADD', payload: item });
      return true;
    },
    [rows]
  );

  const increase = useCallback(
    (id: string) => {
      const item = rows.find((row) => row.id === id);
      if (!item) return;
      const stock = normalizeStock(item.stock);
      if (stock != null && item.amount >= stock) {
        toast.warning('No puedes agregar una cantidad mayor al stock disponible');
        return;
      }
      dispatch({ type: 'INCREASE', payload: { id } });
    },
    [rows]
  );

  const decrease = useCallback((id: string) => dispatch({ type: 'DECREASE', payload: { id } }), []);

  const setAmount = useCallback(
    (id: string, amount: number) => {
      const item = rows.find((row) => row.id === id);
      if (!item) return;
      const normalizedAmount = amount < 1 ? 1 : Math.floor(amount);
      const stock = normalizeStock(item.stock);
      if (stock != null && normalizedAmount > stock) {
        toast.warning('No puedes agregar una cantidad mayor al stock disponible');
        dispatch({ type: 'SET_AMOUNT', payload: { id, amount: stock } });
        return;
      }
      dispatch({ type: 'SET_AMOUNT', payload: { id, amount: normalizedAmount } });
    },
    [rows]
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
