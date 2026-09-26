import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormInputText } from '@/components';
import { useForm } from 'react-hook-form';
import { setSearchCategory } from '@/redux/categorySlice';

import debounce from 'just-debounce-it';

import "./Header.css"
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';

type HeaderProps = {
  onCreate: () => void;
};

const CreateProduct: React.FC<HeaderProps> = ({ onCreate }) => {
  const dispatch = useDispatch();
  const search = useSelector((state: any) => state.category.search);
  const { can } = usePermission();
  const canCreate = can(PERMISSIONS.CATEGORIES.CREATE);

  const debouncedGetCategories = useCallback(debounce((search: string) =>{
    dispatch(setSearchCategory(search));
  },300 ),[])

  const handleClick = () => {
    onCreate()
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

      {canCreate && (
        <div>
          <Button variant="contained" color="primary" onClick={handleClick} sx={{borderRadius: 5, display: 'flex', justifyContent: 'space-between', gap:1}}>
            <span>+</span> Nueva Categoría
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
