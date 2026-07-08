import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '@/redux/productSlice';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import debounce from 'just-debounce-it';


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const search = useSelector((state: any) => state.product.search);

  const debouncedSetSearch = useCallback(debounce((search: string) => {
    dispatch(setSearch(search));
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
    debouncedSetSearch(value);
  };

  return (
    <div className='header_page'>
      <div>
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

export default Header;
