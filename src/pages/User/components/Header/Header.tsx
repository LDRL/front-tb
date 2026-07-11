import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
//import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import "./Header.css"
import { FormInputText } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'just-debounce-it';
import { setSearchUser } from '@/redux/userSlice';
import { useForm } from 'react-hook-form';
//import { setSearchUser } from '@/redux/userSlice';


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state: any) => state.user.search);

  const debouncedSetSearch = useCallback(debounce((search: string) => {
    dispatch(setSearchUser(search));
  }, 300), [])

  const { control, reset } = useForm({
    defaultValues: { search },
  });

  useEffect(() => {
    reset({ search });
  }, [search, reset]);

  const handleSearchChange = (value: string) => {
    debouncedSetSearch(value);
  };

  const handleClick = () => {
    navigate("create")
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
          Crear Usuario
        </Button>
      </div>
    </div>
  );
};

export default Header;