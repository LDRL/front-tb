import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { setSearchColor } from '@/redux/colorSlice';
import debounce from 'just-debounce-it';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import './Header.css';

type HeaderProps = {
  onCreate: () => void;
};

const Header: React.FC<HeaderProps> = ({ onCreate }) => {
  const dispatch = useDispatch();
  const search = useSelector((state: any) => state.color.search);
  const { can } = usePermission();

  const canCreateColor = can(PERMISSIONS.COLORS.CREATE);

  const debouncedGetColors = useCallback(
    debounce((search: string) => {
      dispatch(setSearchColor(search));
    }, 300),
    []
  );

  const handleClick = () => {
    onCreate();
  };

  const { control, reset } = useForm({
    defaultValues: { search },
  });

  useEffect(() => {
    reset({ search });
  }, [search, reset]);

  const handleSearchChange = (value: string) => {
    debouncedGetColors(value);
  };

  return (
    <div className="header_page">
      <div style={{ alignItems: 'right' }}>
        <FormInputText
          name="search"
          control={control}
          label="Buscar"
          externalOnChange={handleSearchChange}
        />
      </div>

      {canCreateColor && (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', gap: 1 }}
          >
            <span>+</span> Nuevo Color
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
