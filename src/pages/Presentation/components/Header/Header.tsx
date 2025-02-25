import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';


import { useNavigate } from 'react-router-dom';
import { Presentation } from '../../models';

import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchPresentation } from '@/redux/presentationSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const debouncedGetPresentations = useCallback(debounce((search: string) =>{
    dispatch(setSearchPresentation(search));
  },300 ),[])

  const handleClick = () => {
    navigate("create")
  };

  const { control } = useForm<Presentation>({
    defaultValues: { id: 0, name: ''},
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debouncedGetPresentations(event.target.value)
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
          Crear Presentación
        </Button>
      </div>
    </div>
  );
};

export default Header;
