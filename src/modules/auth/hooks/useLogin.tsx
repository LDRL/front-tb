import { useMutation } from '@tanstack/react-query';

import axiosClient from '@/utils/axiosClient';
import { AuthState } from '../models/login.domain.type';
import { loginAdapter } from '../adapter/login.adapter';
import { LoginApiResponse } from '../models/login.api.type';
import { LoginData } from '../models/login.request.type';

const apiUrl = import.meta.env.VITE_API_URL;

export const useLoginMutation = () => {
  return useMutation<AuthState,unknown,LoginData>({
    mutationFn: async (data) => {
      const response =
        await axiosClient.post<LoginApiResponse>(
          `${apiUrl}auth/login`,
          data
        );

      return loginAdapter(
        response.data
      );
    }
  });
};