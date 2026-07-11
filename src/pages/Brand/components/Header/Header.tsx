import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setSearchBrand } from '@/redux/brandSlice';
import debounce from 'just-debounce-it';
import "./Header.css"

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state: any) => state.brand.search);

  const debouncedGetBrands = useCallback(debounce((search: string) =>{
    dispatch(setSearchBrand(search));
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
    debouncedGetBrands(value)
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
          Crear Marca
        </Button>
      </div>
    </div>
  );
};

export default Header;
