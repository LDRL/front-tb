import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setSearchCategory } from '@/redux/categorySlice';

import debounce from 'just-debounce-it';

import "./Header.css"

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state: any) => state.category.search);

  const debouncedGetCategories = useCallback(debounce((search: string) =>{
    dispatch(setSearchCategory(search));
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
    debouncedGetCategories(value)
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

      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Crear Categoría
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
