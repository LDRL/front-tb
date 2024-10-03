import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';


import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';

import debounce from 'just-debounce-it';

import { Navigate, useNavigate } from 'react-router-dom';
import { setSearchCategory } from '@/redux/categorySlice';
import { Category } from '../../models';

import "./Header.css"

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const debouncedGetCategories = useCallback(debounce((search: string) =>{
    dispatch(setSearchCategory(search));
  },300 ),[])

  const handleClick = () => {
    navigate("create")
  };

  const { control } = useForm<Category>({
    defaultValues: { id: 0, name: ''},
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debouncedGetCategories(event.target.value)
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
          Crear Categoría
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
