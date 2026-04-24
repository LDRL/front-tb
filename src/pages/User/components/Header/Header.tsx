import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';


import { useNavigate } from 'react-router-dom';
import { User } from '../../models';

import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchUser } from '@/redux/userSlice';


const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const debouncedGetUsers = useCallback(debounce((search: string) =>{
    dispatch(setSearchUser(search));
  },300 ),[])

  const handleClick = () => {
    navigate("create")
  };

  const { control } = useForm<User>({
    defaultValues: { _id: '', nombre:'', apellido:'', username: '', password:'', codigoemp:0},
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debouncedGetUsers(event.target.value)
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
          Crear Usuario
        </Button>
      </div>
    </div>
  );
};

export default Header;
