import { useMutation } from '@tanstack/react-query';
//import axios from 'axios';

import {LoginResponse, LoginData } from '../models/login.type';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';

//const apiUrl = 'http://localhost:8080/';
const apiUrl = import.meta.env.VITE_API_URL;

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (data) => {
      const response = await axiosClient.post<LoginResponse>(`${apiUrl}auth/login`, data);

      return response.data;
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};