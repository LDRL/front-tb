import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppConfig, ConfigState, defaultAppConfig, defaultAppFeatures } from '@/modules/config/models';
import { configRepository } from '@/modules/config/services';
import type { RootState } from './store';

const initialState: ConfigState = {
  config: {
    ...defaultAppConfig,
    features: { ...defaultAppFeatures },
  },
  status: 'idle',
  error: null,
};

export const loadConfig = createAsyncThunk<AppConfig>('config/load', async () => {
  return configRepository.getConfig();
});

export const saveConfig = createAsyncThunk<AppConfig, AppConfig>('config/save', async (config) => {
  return configRepository.saveConfig(config);
});

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadConfig.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.status = 'ready';
        state.error = null;
      })
      .addCase(loadConfig.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Error al cargar la configuración';
      })
      .addCase(saveConfig.pending, (state) => {
        state.status = 'saving';
        state.error = null;
      })
      .addCase(saveConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.status = 'ready';
        state.error = null;
      })
      .addCase(saveConfig.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Error al guardar la configuración';
      });
  },
});

export const selectAppConfig = (state: RootState) => state.config.config;
export const selectConfigStatus = (state: RootState) => state.config.status;
export const selectConfigError = (state: RootState) => state.config.error;
export const selectBusinessMode = (state: RootState) => state.config.config.businessMode;
export const selectIsRestaurantMode = (state: RootState) =>
  state.config.config.businessMode === 'restaurant';
export const selectAppFeatures = (state: RootState) => state.config.config.features;
export const selectFeature = (feature: keyof AppConfig['features']) => (state: RootState) =>
  state.config.config.features[feature];

export default configSlice.reducer;
