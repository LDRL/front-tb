import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import debounce from 'just-debounce-it';
import { FormInputText } from '@/components';
import { setSearchCaja } from '@/redux/cajaSlice';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';

type HeaderProps = {
  onCreate: () => void;
};

const Header: React.FC<HeaderProps> = ({ onCreate }) => {
  const dispatch = useDispatch();
  const search = useSelector((state: any) => state.caja.search);
  const { can } = usePermission();
  const canCreate = can(PERMISSIONS.CAJA.CREATE);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSearchCaja(value));
    }, 300),
    []
  );

  const { control, reset } = useForm({
    defaultValues: { search },
  });

  useEffect(() => {
    reset({ search });
  }, [search, reset]);

  return (
    <div className="header_page">
      <div style={{ alignItems: 'right' }}>
        <FormInputText
          name="search"
          control={control}
          label="Buscar"
          externalOnChange={debouncedSearch}
        />
      </div>

      {canCreate && (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={onCreate}
            sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', gap: 1 }}
          >
            <span>+</span> Nueva caja
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
