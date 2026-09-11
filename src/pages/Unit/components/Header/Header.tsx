import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setSearchUnit } from '@/redux/unitSlice';
import debounce from 'just-debounce-it';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import "./Header.css"

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state: any) => state.unit.search);
  const { can } = usePermission();

  const canCreateUnit = can(PERMISSIONS.UNITS.CREATE);

  const debouncedGetUnits = useCallback(debounce((search: string) => {
    dispatch(setSearchUnit(search));
  }, 300), [])

  const handleClick = () => {
    navigate("create")
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
          <Button variant="contained" color="primary" onClick={handleClick}>
            Crear Unidad de Medida
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;