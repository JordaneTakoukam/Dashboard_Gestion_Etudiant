import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';
import { ReponseApiPros } from '../interface_reponse.js';

const api = `${apiUrl}/api/v1/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateGrade({ code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/grade/create`,
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
        console.error('Error creating grade:', error);
        throw error;
    }
}

export async function apiUpdateGrade({ _id, code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/grade/update/${_id}`,
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
        console.error('Error updating grade:', error);
        throw error;
    }
}

export async function apiDeleteGrade(gradeId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/grade/delete/${gradeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting grade:', error);
        throw error;
    }
}
