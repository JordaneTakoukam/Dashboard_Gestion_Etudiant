import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/user`;

const token = localStorage.getItem(wstjqer);


export async function getUsersWithRole({ role }: { role: string }): Promise<UserReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getUsersWithRole/${role}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const users: UserReturnGetType = response.data.data;
        return users;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
