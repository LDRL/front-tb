import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';


import { useNavigate } from 'react-router-dom';

import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchPresentation } from '@/redux/presentationSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const search = useSelector((state: any) => state.presentation.search);


  const debouncedGetPresentations = useCallback(debounce((search: string) =>{
    dispatch(setSearchPresentation(search));
  },300 ),[])

  const handleClick = () => {
    navigate("create")
  };

 const { control} = useForm({
    defaultValues: { search },
  });

  const handleSearchChange = (value: string) => {
    debouncedGetPresentations(value)
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
          Crear Presentación
        </Button>
      </div>
    </div>
  );
};

export default Header;
