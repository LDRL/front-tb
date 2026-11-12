import { VariantDetail, VariantGroupDetail, VariantGroupErrors, VariantRowErrors } from '../models/product.domain.type';

export const VARIANT_ERRORS = {
  emptyList: 'Debe agregar al menos una variante activa',
  invalid: 'Revisá las variantes: cada una debe tener talla o color, sin combinaciones repetidas',
  groupInvalid: 'Revisá las variantes: cada grupo debe tener un color y al menos una talla seleccionada',
} as const;

const pairKey = (v: VariantDetail) => `${v.idtalla ?? 0}:${v.idcolor ?? 0}`;

export const validateVariantes = (rows: VariantDetail[], hasVariants: boolean) => {
  if (!hasVariants) {
    return { ok: true as const, errors: {}, message: '' };
  }

  const activeRows = rows.filter((r) => (r.estado ?? 1) === 1);
  if (activeRows.length === 0) {
    return { ok: false as const, errors: {}, message: VARIANT_ERRORS.emptyList };
  }

  const errors: Record<string, VariantRowErrors> = {};
  const seen = new Set<string>();

  rows.forEach((row) => {
    const rowErrors: VariantRowErrors = {};
    const idtalla = row.idtalla ?? null;
    const idcolor = row.idcolor ?? null;

    if (!idtalla && !idcolor) {
      rowErrors.combination = true;
    } else {
      const key = pairKey(row);
      if (seen.has(key)) {
        rowErrors.combination = true;
      } else {
        seen.add(key);
      }
    }

    if (Object.keys(rowErrors).length > 0 && row.id) {
      errors[row.id] = rowErrors;
    }
  });

  if (Object.keys(errors).length === 0) {
    return { ok: true as const, message: '' };
  }

  return {
    ok: false as const,
    errors,
    message: VARIANT_ERRORS.invalid,
  };
};

export const validateVariantGroups = (groups: VariantGroupDetail[], hasVariants: boolean) => {
  if (!hasVariants) {
    return { ok: true as const, errors: {}, message: '' };
  }

  const errors: Record<string, VariantGroupErrors> = {};
  let hasAnyActive = false;
  const seenPairs = new Set<string>();

  groups.forEach((g) => {
    const ge: VariantGroupErrors = {};
    if (g.idcolor == null) {
      ge.color = true;
    }
    const hasTallas = (g.tallas || []).length > 0;
    const hasBase = !!g.hasBase;
    if (!hasTallas && !hasBase) {
      ge.tallas = true;
    }

    if (hasBase) {
      if ((g.baseEstado ?? 1) === 1) hasAnyActive = true;
      const key = `${g.idcolor ?? 0}:0`;
      if (seenPairs.has(key)) ge.tallas = true; else seenPairs.add(key);
    }

    for (const t of g.tallas || []) {
      if ((t.estado ?? 1) === 1) hasAnyActive = true;
      const key = `${g.idcolor ?? 0}:${t.idtalla ?? 0}`;
      if (seenPairs.has(key)) {
        ge.tallas = true;
      } else {
        seenPairs.add(key);
      }
    }
    if (Object.keys(ge).length > 0 && g.id) errors[g.id] = ge;
  });

  if (!hasAnyActive || groups.length === 0) {
    return { ok: false as const, errors, message: VARIANT_ERRORS.emptyList };
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false as const, errors, message: VARIANT_ERRORS.groupInvalid };
  }
  return { ok: true as const, errors: {}, message: '' };
};
