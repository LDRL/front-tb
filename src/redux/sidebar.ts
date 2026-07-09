import { clearLocalStorage, persistLocalStorage } from "@/utils/localStorage.utility";
import { createSlice } from "@reduxjs/toolkit";

export interface SidebarInfo{
    state: boolean;
    mobileOpen: boolean;
}

export const EmptySidebarState: SidebarInfo = {
    state: false,
    mobileOpen: false
}

export const sidebarKey = 'sidebar';

export const sidebarSlice = createSlice({
    name:"sidebar",
    initialState: localStorage.getItem('sidebar') ? JSON.parse(localStorage.getItem('sidebar') as string): EmptySidebarState,
    reducers: {
        createSidebar: (_, action)=>{
            persistLocalStorage<SidebarInfo>(sidebarKey, action.payload);
            return action.payload;
        },
        updateSidebar: (state, action)=>{
            const result = {...state, ...action.payload}
            persistLocalStorage<SidebarInfo>(sidebarKey, result);
            return result;
        },
        toggleMobileMenu: (state) => {
            const result = { ...state, mobileOpen: !state.mobileOpen };
            persistLocalStorage<SidebarInfo>(sidebarKey, result);
            return result;
        },
        resetSidebar: () => {
            clearLocalStorage(sidebarKey);
            return EmptySidebarState;
        }
    }
});

export const { createSidebar, resetSidebar, updateSidebar, toggleMobileMenu } = sidebarSlice.actions;
export default sidebarSlice.reducer;