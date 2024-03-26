import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer,  } from '../../config.js'

const token = localStorage.getItem(wstjqer);

export async function apiGetAllSettings(): Promise<DataSettingProps> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${apiUrl}/settings`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const settings: DataSettingProps = response.data.settings;

        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
