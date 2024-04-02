import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';
import { ReponseApiPros } from './interface_reponse.js';


const api = `${apiUrl}/matiere/chapitre`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateChapitre({ code, libelleFr, libelleEn, typesEnseignement, matiere, objectifs, competences }: ChapitreType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { code, libelleFr, libelleEn, typesEnseignement, matiere, objectifs, competences },
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

export async function apiUpdateChapitre({ _id, code, libelleFr, libelleEn, typesEnseignement, matiere, objectifs, competences }: ChapitreType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { code, libelleFr, libelleEn, typesEnseignement, matiere, objectifs, competences },
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

export async function apiDeleteChapitre(chapitreId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${chapitreId}`,
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