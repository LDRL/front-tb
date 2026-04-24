import { EmptySupplierState, Supplier } from '@/pages/Supplier';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const supplierSlice = createSlice({
  name: 'supplier',
  initialState: EmptySupplierState,
  reducers: {
    editSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.currentSupplier = action.payload;
    },
    clearSupplier: (state) => {
      state.currentSupplier = null;
    },
    setSearchSupplier: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editSupplier, clearSupplier,setSearchSupplier } = supplierSlice.actions;

export default supplierSlice.reducer;

