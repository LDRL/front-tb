import { EmptyRoleState, Role } from '@/pages/Rol/models/role.domain.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const rolSlice = createSlice({
  name: 'rol',
  initialState: EmptyRoleState,
  reducers: {
    editRole: (state, action: PayloadAction<Role | null>) => {
      state.currentRole = action.payload;
    },
    clearRole: (state) => {
      state.currentRole = null;
    },
    setSearchRole: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editRole, clearRole, setSearchRole } = rolSlice.actions;
export default rolSlice.reducer;
