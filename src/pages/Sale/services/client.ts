import axiosClient, { getErrorMessage } from '@/utils/axiosClient';
import { ClientForm } from '@/pages/Client/models';
import { ClientAdapter } from '@/pages/Client/adapter';
const apiUrl = import.meta.env.VITE_API_URL;


export const createClient = async (client:ClientForm) => {
    try {
        const newClient = {
            nit: client.nit,
            nombres: client.name,
            apellidos: client.lastName,
            direccion: client.address,
            email: client.email,
            telefono: client.telphone,
            idtipoCli: client.idTypeCli
        }
        
        const {data} = await axiosClient.post(`${apiUrl}clientes`, newClient);

        const adaptedClient = ClientAdapter(data.data);
        return adaptedClient;

    } catch (error: any) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
}


