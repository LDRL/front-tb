import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadConfig } from '@/redux/configSlice';
import type { AppDispatch } from '@/redux/store';

const ConfigBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadConfig());
  }, [dispatch]);

  return null;
};

export default ConfigBootstrap;
