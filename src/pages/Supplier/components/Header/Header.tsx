import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';
import { Supplier } from '../../models';

import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchSupplier } from '@/redux/supplierSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const debouncedGetSuppliers = useCallback(debounce((search: string) =>{
    dispatch(setSearchSupplier(search));
  },300 ),[])

  const handleClick = () => {
    navigate("create")
  };

  const { control } = useForm<Supplier>({
    defaultValues: { _id: '', nombre:'', direccion:'', telefono: '', email:''},
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debouncedGetSuppliers(event.target.value)
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
          Crear Proveedor
        </Button>
      </div>
    </div>
  );
};

export default Header;
