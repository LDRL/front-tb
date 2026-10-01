import { Detail, PrecioCliente, RowErrors } from '../models/product.domain.type';

export const PRESENTATION_ERRORS = {
  emptyList: 'Debe agregar al menos una presentación',
  emptyOrDuplicated: 'Revisá las presentaciones: no pueden estar vacías ni repetidas',
  incomplete: 'Completá precio y cantidad base de todas las presentaciones',
} as const;

const hasValidPrice = (p: PrecioCliente) => p.idtipoCli > 0 && p.precio > 0;

/**
 * Maps edited rows to the payload shape, dropping prices the user left
 * half-filled instead of sending zeroed entries to the API.
 */
export const buildPresentacionesPayload = (rows: Detail[]): Detail[] =>
  rows.map((row) => {
    const validPrecios = (row.precios ?? []).filter(hasValidPrice);

    return { ...row, precios: validPrecios.length > 0 ? validPrecios : undefined };
  });

/**
 * Validates the presentation rows. Pure: no React, no side effects, so the
 * rules can be reasoned about and unit tested on their own.
 */
export const validatePresentaciones = (rows: Detail[]) => {
  if (rows.length === 0) {
    return { ok: false as const, errors: {}, message: PRESENTATION_ERRORS.emptyList };
  }

  const errors: Record<string, RowErrors> = {};
  const seen = new Set<number>();

  rows.forEach((row) => {
    const rowErrors: RowErrors = {};

    if (!row.idPresentation) {
      rowErrors.idPresentation = true;
    } else if (seen.has(row.idPresentation)) {
      rowErrors.idPresentation = true;
    } else {
      seen.add(row.idPresentation);
    }

    if (!row.price || row.price <= 0) {
      rowErrors.price = true;
    }

    if (!row.baseQuantity || row.baseQuantity <= 0) {
      rowErrors.baseQuantity = true;
    }

    if (Object.keys(rowErrors).length > 0 && row.id) {
      errors[row.id] = rowErrors;
    }
  });

  if (Object.keys(errors).length === 0) {
    return { ok: true as const, message: '' };
  }

  const hasPresentationError = Object.values(errors).some(e => e.idPresentation);

  return {
    ok: false as const,
    errors,
    message: hasPresentationError
      ? PRESENTATION_ERRORS.emptyOrDuplicated
      : PRESENTATION_ERRORS.incomplete,
  };
};
