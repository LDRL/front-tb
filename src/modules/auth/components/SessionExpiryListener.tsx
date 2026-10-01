import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '@/redux/authSlice';
import { setSessionExpiredHandler } from '../lib/sessionExpiry';

export const SessionExpiryListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setSessionExpiredHandler(() => dispatch(logout()));

    return () => setSessionExpiredHandler(null);
  }, [dispatch]);

  return null;
};
