import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { openModal, setSearch } from '@/redux/productSlice';
// import { dialogOpenSubject$ } from '@/components/CustomDialog/CustomDialog';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { Product } from '../../models';

import debounce from 'just-debounce-it';

import { Navigate, useNavigate } from 'react-router-dom';

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const debouncedGetProducts= useCallback(debounce((search: string) =>{
    dispatch(setSearch(search));
  },300 ),[])


  const handleClick = () => {
    navigate("create")

  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Product>({
    defaultValues: { id: 0, name: '', price: 0},
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(event.target.value)
    const newSearch = event.target.value;
    debouncedGetProducts(event.target.value)
     // dispatch(setSearch(event.target.value));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          Crear Producto
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
