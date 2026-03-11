
import { AuthState ,EmptyUserState} from "@/modules/auth/models/login.type";
import { User } from "@/pages/User";
import { clearLocalStorage, persistLocalStorage } from "@/utils/localStorage.utility";
import { createSlice } from "@reduxjs/toolkit";



export const userKey = 'auth';

export const authSlice = createSlice({
    name:"auth",
    initialState: localStorage.getItem(userKey) ? JSON.parse(localStorage.getItem(userKey) as string): EmptyUserState,
    reducers: {
        login: (state, action)=>{
            persistLocalStorage<AuthState>(userKey, action.payload);
            return action.payload;
        },
        setUser: (state, action)=>{
            const result = {...state, ...action.payload}
            persistLocalStorage<User>(userKey, result);
            return result;
        },
        logout: () => {
            clearLocalStorage(userKey);
            return EmptyUserState;
        }
    }
});

export const { login, setUser,logout } = authSlice.actions;
export default authSlice.reducer;