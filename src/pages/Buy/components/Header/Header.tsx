import React, { useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import "./Header.css"
import { FormInputText } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBuy } from '@/redux/buySlice';
import { useForm } from 'react-hook-form';
import debounce from 'just-debounce-it';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';

const Header: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state: any) => state.buy.search);

  const { can } = usePermission();
  const canCreate = can(PERMISSIONS.PURCHASES.CREATE);
  

  const debouncedSetSearch = useCallback(debounce((search: string) => {
    dispatch(setSearchBuy(search));
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

      {canCreate && (
        <div>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Nueva compra
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
