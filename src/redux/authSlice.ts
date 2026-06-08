import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {AuthState,EmptyAuthState} from "@/modules/auth/models/login.domain.type";

import {clearLocalStorage,persistLocalStorage} from "@/utils/localStorage.utility";

export const userKey = "auth";

const getInitialState = (): AuthState => {
  try {
    const stored = localStorage.getItem(userKey);

    if (!stored) return EmptyAuthState;

    const parsed = JSON.parse(stored);

    if (!parsed?.token || !parsed?.user) {
      return EmptyAuthState;
    }

    return parsed as AuthState;

  } catch {
    return EmptyAuthState;
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),

  reducers: {

    login: (_state, action: PayloadAction<AuthState>) => {

      if (!action.payload?.token || !action.payload?.user) {
        return EmptyAuthState;
      }

      const newState: AuthState = {
        token: action.payload.token,
        user: action.payload.user
      };

      persistLocalStorage<AuthState>(userKey, newState);

      return newState;
    },

    logout: () => {
      clearLocalStorage(userKey);
      return EmptyAuthState;
    }
  }
});

export const {login,logout} = authSlice.actions;

export default authSlice.reducer;