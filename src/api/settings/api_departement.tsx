import axios, { AxiosResponse } from 'axios';
import { config } from '../../config.js';
import { ReponseApiPros } from '../interface_reponse.js';
import { DepartementProps } from '../../_types/data_setting_type.js';

const api = `${config.apiUrl}/api/v1/setting`;

const token = localStorage.getItem(config.jwt_key);

export async function apiCreateDepartement({ code, region, libelleFr, libelleEn }: DepartementProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/departement/create`,
            { code, region, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating region:', error);
        throw error;
    }
}

export async function apiUpdateDepartement({ _id, code, libelleFr, libelleEn, region }: DepartementProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/departement/update/${_id}`,
            { code, libelleFr, libelleEn, region },
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

export async function apiDeleteDepartement(departementId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/departement/delete/${departementId}`,
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
