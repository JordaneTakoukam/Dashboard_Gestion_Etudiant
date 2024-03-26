import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';
import { ReponseApiPros } from '../interface_reponse.js';

const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateNiveau({ code, cycle, libelleFr, libelleEn }: NiveauProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/niveau/create`,
            { code, cycle, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating niveau:', error);
        throw error;
    }
}

export async function apiUpdateNiveau({ _id, code, libelleFr, libelleEn, cycle }: NiveauProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/niveau/update/${_id}`,
            { code, libelleFr, libelleEn, cycle },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating region:', error);
        throw error;
    }
}

export async function apiDeleteNiveau(niveauId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/niveau/delete/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting region:', error);
        throw error;
    }
}
