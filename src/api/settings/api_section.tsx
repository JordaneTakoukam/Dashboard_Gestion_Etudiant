import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateSection({ code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/section/create`,
            { code, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section:', error);
        throw error;
    }
}

export async function apiUpdateSection({ _id, code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/section/update/${_id}`,
            { code, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating section:', error);
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
        console.error('Error deleting section:', error);
        throw error;
    }
}
