import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/matiere`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateMatiere({ code, libelleFr, libelleEn, niveau, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement }: MatiereType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { code, libelleFr, libelleEn, niveau, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement },
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

export async function apiUpdateMatiere({ _id, code, libelleFr, libelleEn, niveau, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement }: MatiereType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { code, libelleFr, libelleEn, niveau, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement },
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

export async function apiDeleteMatiere(matiereId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${matiereId}`,
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

export async function getMatieresByNiveauWithPagination({ niveauId, page }: { niveauId: string, page: number }): Promise<MatiereReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getMatieresByNiveauWithPagination/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: MatiereReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getMatieresByNiveau({ niveauId }: { niveauId: string}): Promise<ProgressionMatiereReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getMatieresByNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: ProgressionMatiereReturnGetType = response.data.data;

        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}