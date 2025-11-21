import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateSalleDeCours({ code, libelleFr, libelleEn, nbPlace }: SalleDeCoursProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/salle-de-cour/create`,
            { code, libelleFr, libelleEn, nbPlace},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating salle de cours:', error);
        throw error;
    }
}

export async function apiUpdateSalleDeCours({ _id, code, libelleFr, libelleEn, nbPlace }: SalleDeCoursProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/salle-de-cour/update/${_id}`,
            { code, libelleFr, libelleEn, nbPlace },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating salle de cours:', error);
        throw error;
    }
}

export async function apiDeleteSalleDeCours(salleDeCoursId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/salle-de-cour/delete/${salleDeCoursId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting salle de cours:', error);
        throw error;
    }
}
