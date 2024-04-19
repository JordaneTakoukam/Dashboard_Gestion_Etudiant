import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/absence`;
const token = localStorage.getItem(wstjqer);




export async function apiGetAbsencesWithEnseignantsByFilter({ page, semestre, annee }: { page?: number, semestre?: string, annee?: string }): Promise<EnseignantDisciplineListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAbsencesWithEnseignantsByFilter`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const enseignants = response.data.data;

        return enseignants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}
