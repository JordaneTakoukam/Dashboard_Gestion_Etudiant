import axios, { AxiosResponse } from 'axios';
import { config } from '../../config.js';
import { ReponseApiPros } from '../interface_reponse.js';
import { CommonSettingProps } from '../../_types/data_setting_interface.js';

const api = `${config.apiUrl}/api/v1/setting`;

const token = localStorage.getItem(config.jwt_key);

export async function apiCreateRegion({ code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/region/create`,
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
        console.error('Error creating region:', error);
        throw error;
    }
}

export async function apiUpdateRegion({ _id, code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/region/update/${_id}`,
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
        console.error('Error updating region:', error);
        throw error;
    }
}

export async function apiDeleteRegion(regionId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/region/delete/${regionId}`,
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
