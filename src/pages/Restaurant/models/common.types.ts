export type RestaurantEntityId = string;

export type RestaurantUnit =
  | 'unit'
  | 'piece'
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'portion'
  | 'rodaja'
  ;

export type BusinessChannel = 'restaurant' | 'cafe';

export interface AuditFields {
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
