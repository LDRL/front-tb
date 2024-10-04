import { clearLocalStorage, persistLocalStorage } from "@/utils/localStorage.utility";
import { createSlice } from "@reduxjs/toolkit";

export interface SidebarInfo{
    state: false
}

export const EmptySidebarState: SidebarInfo = {
    state: false
}

export const sidebarKey = 'sidebar';

export const sidebarSlice = createSlice({
    name:"sidebar",
    initialState: localStorage.getItem('sidebar') ? JSON.parse(localStorage.getItem('sidebar') as string): EmptySidebarState,
    reducers: {
        createSidebar: (state, action)=>{
            persistLocalStorage<SidebarInfo>(sidebarKey, action.payload);
            return action.payload;
        },
        updateSidebar: (state, action)=>{
            const result = {...state, ...action.payload}
            persistLocalStorage<SidebarInfo>(sidebarKey, result);
            return result;
        },
        resetSidebar: () => {
            clearLocalStorage(sidebarKey);
            return EmptySidebarState;
        }
    }
});

export const { createSidebar,resetSidebar, updateSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;