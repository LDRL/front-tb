import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { setSearchUnit } from '@/redux/unitSlice';
import debounce from 'just-debounce-it';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import "./Header.css"

type HeaderProps = {
  onCreate: () => void;
};

const Header: React.FC<HeaderProps> = ({ onCreate }) => {
  const dispatch = useDispatch();
  const search = useSelector((state: any) => state.unit.search);
  const { can } = usePermission();

  const canCreateUnit = can(PERMISSIONS.UNITS.CREATE);

  const debouncedGetUnits = useCallback(debounce((search: string) => {
    dispatch(setSearchUnit(search));
  }, 300), [])

  const handleClick = () => {
    onCreate()
  };

  const { control, reset } = useForm({
    defaultValues: { search },
  });

  useEffect(() => {
    reset({ search });
  }, [search, reset]);

  const handleSearchChange = (value: string) => {
    debouncedGetUnits(value)
  };

  return (
    <div className='header_page'>
      <div style={{ alignItems: "right" }}>
        <FormInputText
          name="search"
          control={control}
          label="Buscar"
          externalOnChange={handleSearchChange}
        />
      </div>

      {canCreateUnit && (
        <div>
          <Button variant="contained" color="primary" onClick={handleClick} sx={{borderRadius: 5, display: 'flex', justifyContent: 'space-between', gap:1}}>
            <span>+</span> Nueva Unidad
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;