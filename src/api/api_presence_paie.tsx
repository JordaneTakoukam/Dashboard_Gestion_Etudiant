import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/presence`;
const token = localStorage.getItem(wstjqer);



export async function apiPresence({ jour, semestre, annee, niveau, matiere, enseignant, heureDebut, heureFin }: PresencePaieType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { jour, semestre, annee, niveau, matiere, enseignant, heureDebut, heureFin },
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

// get
export async function apiGetPresencesWithTotalHoraire({ page, annee, semestre, niveauId }: { page: number, annee: number, semestre: number, niveauId: string }): Promise<PresencePaieListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPresencesWithTotalHoraire/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee: annee,
                    semestre: semestre
                },
            },
        );
        const presences: PresencePaieListGetType = response.data.data;
        return presences;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}