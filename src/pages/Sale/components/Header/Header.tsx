import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';


import { useNavigate } from 'react-router-dom';

import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchSale } from '@/redux/saleSlice';
import { hasPermission } from '@/modules/auth/helper/auth.helper';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const search = useSelector((state: any) => state.auth.search);

  const user = useSelector((state: any) => state.auth.user);
  const canCreateSale = hasPermission(user,PERMISSIONS.SALES.CREATE
  );

  const debouncedGetSales = useCallback(debounce((search: string) =>{
    dispatch(setSearchSale(search));
  },300 ),[])

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
    debouncedGetSales(value);
  };

  return (
    <div className='header'>
      <div style={{ alignItems: "right" }}>
        <FormInputText
          name="search"
          control={control}
          label="Buscar"
          externalOnChange={handleSearchChange}
        />
      </div>

      <div>
        {canCreateSale && (
          <Button variant="contained" color="primary" onClick={handleClick}>
            Nueva venta
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
