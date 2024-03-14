import axios, { AxiosResponse } from 'axios';
import { config } from './../../../config.js'

const api = `${config.apiUrl}/api/v1/settings`;

const token = localStorage.getItem(config.jwt_key);

export async function apiGetAllSettings(): Promise<any[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const settings: any[] = response.data.settings;

        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
