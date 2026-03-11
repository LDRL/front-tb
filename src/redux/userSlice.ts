import { EmptyUserState, User } from '@/pages/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: EmptyUserState,
  reducers: {
    editUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    setSearchUser: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editUser, clearUser,setSearchUser } = userSlice.actions;

export default userSlice.reducer;

