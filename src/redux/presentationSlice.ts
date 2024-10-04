import { EmptyPresentationState, Presentation } from '@/pages/Presentation';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const presentationSlice = createSlice({
  name: 'presentation',
  initialState: EmptyPresentationState,
  reducers: {
    editPresentation: (state, action: PayloadAction<Presentation | null>) => {
      state.currentPresentation = action.payload;
    },
    clearPresentation: (state) => {
      state.currentPresentation = null;
    },
    setSearchPresentation: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editPresentation, clearPresentation,setSearchPresentation } = presentationSlice.actions;

export default presentationSlice.reducer;

