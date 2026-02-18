import axios, { AxiosResponse } from 'axios';
import { ApiClient, Client } from '../models/sale.type';
import { SaleClientAdapter } from '../adapter';
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

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`Error creating sale: ${error.response.data}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error creating sale: ${error}`);
        }
    }
}


