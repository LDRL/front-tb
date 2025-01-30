import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';


import { useNavigate } from 'react-router-dom';

import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchSale } from '@/redux/saleSlice';
import { Sale } from '../../models';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const debouncedGetSales = useCallback(debounce((search: string) =>{
    dispatch(setSearchSale(search));
  },300 ),[])

  const handleClick = () => {
    navigate("create")
  };

  const { control } = useForm<Sale>({
    defaultValues: { id: 0, direction: ''},
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debouncedGetSales(event.target.value)
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
        <Button variant="contained" color="primary" onClick={handleClick}>
          Nueva venta
        </Button>
      </div>
    </div>
  );
};

export default Header;
