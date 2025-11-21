import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateSection({ code, departement, libelleFr, libelleEn }: SectionProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/section/create`,
            { code, departement, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating departement:', error);
        throw error;
    }
}

export async function apiUpdateSection({ _id, code, libelleFr, libelleEn, departement }: SectionProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/section/update/${_id}`,
            { code, libelleFr, libelleEn, departement },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating departement:', error);
        throw error;
    }
}

export async function apiDeleteSection(sectionId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/section/delete/${sectionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting departement:', error);
        throw error;
    }
}
