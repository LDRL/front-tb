import axios from 'axios';

import { getErrorMessage } from '@/utils/axiosClient';
import { ClientForm } from '@/pages/Client/models/client.domain.type';
import { SaleClientAdapter } from '../adapter/sale.adapter';
const apiUrl = import.meta.env.VITE_API_URL;


export const createClient = async (client:ClientForm) => {
    try {
        const newClient = {
            nit: client.nit,
            nombres: client.name,
            apellidos: client.lastName,
            direccion: client.address,
            emal: client.email,
            telefono: client.telphone,
            idtipoCli: client.idTypeCli
        }
        
        const {data} = await axios.post(`${apiUrl}clientes`, newClient);

        //SaleClientAdapter
        //return data;

    
        const adaptedClient = SaleClientAdapter(data.data);
        return adaptedClient;

    } catch (error: any) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
}


