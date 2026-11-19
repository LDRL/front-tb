export interface ApiColor {
  _id: number;
  nombre: string;
  hex: string;
  estado: boolean;
}

export interface ApiResponseColor {
  message: string;
  data: ApiColor[];
  ok: boolean;
  meta: {
    total: number;
  };
}

export interface Color {
  id: number;
  name: string;
  hex: string;
  status: boolean;
}

export const ColorEmptyState: Color = {
  id: 0,
  name: '',
  hex: '',
  status: true,
};

export type ColorList = Array<Color>;

export interface ColorState {
  currentColor: Color | null;
  search: string;
}

export const EmptyColorState: ColorState = {
  currentColor: null,
  search: '',
};

export type CreateOrUpdateColorResponse = {
  ok: boolean;
  message: string;
  data: ApiColor;
  meta: null;
};
