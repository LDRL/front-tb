import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ComboTemplate,
  InventoryItem,
  MenuProduct,
  ModifierGroup,
  Recipe,
  RestaurantCatalog,
  defaultRestaurantCatalog,
} from '../models';
import { restaurantCatalogRepository } from '../services';

type CatalogStatus = 'idle' | 'loading' | 'ready' | 'saving' | 'error';

interface RestaurantCatalogContextValue {
  catalog: RestaurantCatalog;
  status: CatalogStatus;
  error: string | null;
  reload: () => Promise<void>;
  save: (next: RestaurantCatalog) => Promise<void>;
  upsertInventoryItem: (item: InventoryItem) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  upsertRecipe: (item: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  upsertModifierGroup: (item: ModifierGroup) => Promise<void>;
  deleteModifierGroup: (id: string) => Promise<void>;
  upsertProduct: (item: MenuProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  upsertCombo: (item: ComboTemplate) => Promise<void>;
  deleteCombo: (id: string) => Promise<void>;
}

const RestaurantCatalogContext = createContext<RestaurantCatalogContextValue | undefined>(undefined);

const upsertById = <T extends { id: string }>(items: T[], item: T): T[] => {
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx === -1) return [...items, item];
  const next = [...items];
  next[idx] = item;
  return next;
};

const removeById = <T extends { id: string }>(items: T[], id: string): T[] =>
  items.filter((i) => i.id !== id);

export const RestaurantCatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catalog, setCatalog] = useState<RestaurantCatalog>({
    ...defaultRestaurantCatalog,
    inventoryItems: [],
    recipes: [],
    modifierGroups: [],
    products: [],
    combos: [],
  });
  const [status, setStatus] = useState<CatalogStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await restaurantCatalogRepository.getCatalog();
      setCatalog(data);
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el catálogo gastronómico');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(async (next: RestaurantCatalog) => {
    setStatus('saving');
    setError(null);
    try {
      const saved = await restaurantCatalogRepository.saveCatalog(next);
      setCatalog(saved);
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar el catálogo gastronómico');
      setStatus('error');
      throw e;
    }
  }, []);

  const upsertInventoryItem = useCallback(
    async (item: InventoryItem) => {
      await save({ ...catalog, inventoryItems: upsertById(catalog.inventoryItems, item) });
    },
    [catalog, save]
  );

  const deleteInventoryItem = useCallback(
    async (id: string) => {
      await save({ ...catalog, inventoryItems: removeById(catalog.inventoryItems, id) });
    },
    [catalog, save]
  );

  const upsertRecipe = useCallback(
    async (item: Recipe) => {
      await save({ ...catalog, recipes: upsertById(catalog.recipes, item) });
    },
    [catalog, save]
  );

  const deleteRecipe = useCallback(
    async (id: string) => {
      await save({ ...catalog, recipes: removeById(catalog.recipes, id) });
    },
    [catalog, save]
  );

  const upsertModifierGroup = useCallback(
    async (item: ModifierGroup) => {
      await save({ ...catalog, modifierGroups: upsertById(catalog.modifierGroups, item) });
    },
    [catalog, save]
  );

  const deleteModifierGroup = useCallback(
    async (id: string) => {
      await save({ ...catalog, modifierGroups: removeById(catalog.modifierGroups, id) });
    },
    [catalog, save]
  );

  const upsertProduct = useCallback(
    async (item: MenuProduct) => {
      await save({ ...catalog, products: upsertById(catalog.products, item) });
    },
    [catalog, save]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await save({ ...catalog, products: removeById(catalog.products, id) });
    },
    [catalog, save]
  );

  const upsertCombo = useCallback(
    async (item: ComboTemplate) => {
      await save({ ...catalog, combos: upsertById(catalog.combos, item) });
    },
    [catalog, save]
  );

  const deleteCombo = useCallback(
    async (id: string) => {
      await save({ ...catalog, combos: removeById(catalog.combos, id) });
    },
    [catalog, save]
  );

  const value = useMemo<RestaurantCatalogContextValue>(
    () => ({
      catalog,
      status,
      error,
      reload,
      save,
      upsertInventoryItem,
      deleteInventoryItem,
      upsertRecipe,
      deleteRecipe,
      upsertModifierGroup,
      deleteModifierGroup,
      upsertProduct,
      deleteProduct,
      upsertCombo,
      deleteCombo,
    }),
    [
      catalog,
      status,
      error,
      reload,
      save,
      upsertInventoryItem,
      deleteInventoryItem,
      upsertRecipe,
      deleteRecipe,
      upsertModifierGroup,
      deleteModifierGroup,
      upsertProduct,
      deleteProduct,
      upsertCombo,
      deleteCombo,
    ]
  );

  return <RestaurantCatalogContext.Provider value={value}>{children}</RestaurantCatalogContext.Provider>;
};

export const useRestaurantCatalog = (): RestaurantCatalogContextValue => {
  const ctx = useContext(RestaurantCatalogContext);
  if (!ctx) {
    throw new Error('useRestaurantCatalog must be used within RestaurantCatalogProvider');
  }
  return ctx;
};

export const createRestaurantId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `rest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};
