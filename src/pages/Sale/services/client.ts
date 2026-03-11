import axios from 'axios';
import { Client } from '../models/sale.type';
import { getErrorMessage } from '@/utils/axiosClient';
const apiUrl = import.meta.env.VITE_API_URL;


export const createClient = async (client:Client) => {
    try {
        const newClient = {
            nit: client.nit,
            nombres: client.name,
            apellidos: client.lastName,
            emal: client.email,
            telefono: client.telphone
        }
        
        const {data} = await axios.post(`${apiUrl}clientes`, newClient);
        return data;

    } catch (error: any) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
}


