import { useMemo } from 'react';

import { useFetchPresentacionOptions } from '@/hooks/useOption';
import { Detail } from '../models/product.domain.type';

/**
 * Builds a display name for a presentation.
 *
 * The product endpoints do not always carry the nested Presentacion object, so
 * the name the adapter mapped can be empty. Falls back to the presentation
 * catalog by id, and to the id itself as a last resort, so a row is never
 * rendered blank.
 *
 * Shared by the desktop table and the mobile cards so both resolve names the
 * same way, and so the catalog is fetched once for both.
 */
export const usePresentationName = () => {
  const { data: presentacionOptions = [] } = useFetchPresentacionOptions('');

  const nameById = useMemo(
    () => new Map(presentacionOptions.map(o => [o.value, o.label])),
    [presentacionOptions]
  );

  return useMemo(
    () => (detalle: Detail) =>
      detalle.name || nameById.get(detalle.idPresentation) || `#${detalle.idPresentation}`,
    [nameById]
  );
};
