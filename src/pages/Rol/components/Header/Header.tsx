import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import debounce from 'just-debounce-it';
import "./Header.css"
import { setSearchRole } from '@/redux/rolSlice';
const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debouncedSearch = useCallback(debounce((search: string) => {
    dispatch(setSearchRole(search));
  }, 300), []);

  const handleClick = () => {
    navigate("create");
  };

  const { control } = useForm({ defaultValues: { search: '' } });

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
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
          Crear Rol
        </Button>
      </div>
    </div>
  );
};

export default Header;
