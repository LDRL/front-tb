import { useSelector } from 'react-redux';
import { AppStore } from '@/redux/store';
import { hasPermission } from '@/modules/auth/helper/auth.helper';

export const usePermission = () => {
  const user = useSelector((state: AppStore) => state.auth.user);

  const can = (permission: string): boolean => hasPermission(user, permission);

  return { user, can };
};