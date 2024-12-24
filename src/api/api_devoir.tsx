import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/devoir`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateDevoir({titreFr, titreEn, descriptionFr, descriptionEn, utilisateur, niveau, noteSur, questions, deadline, ordreAleatoire, tentativesMax, feedbackConfig, annee}: DevoirType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { titreFr, titreEn, descriptionFr, descriptionEn, utilisateur, niveau,noteSur, questions, deadline, ordreAleatoire, tentativesMax, feedbackConfig, annee },
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

export async function apiUpdateDevoir({ _id, titreFr, titreEn, descriptionFr, descriptionEn, utilisateur, niveau,noteSur, questions, deadline, ordreAleatoire, tentativesMax, feedbackConfig, annee }: DevoirType): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            {titreFr, titreEn, descriptionFr, descriptionEn, utilisateur, niveau,noteSur, questions, deadline, ordreAleatoire, tentativesMax, feedbackConfig, annee },
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

export async function apiDeleteDevoir(devoirId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${devoirId}`,
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

export async function apiSearchDevoir({ searchString, langue, limit }: { langue:string, searchString: string, limit:number }): Promise<DevoirReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchDevoir/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit
                }
            },
        );
        const devoirs: DevoirReturnGetType = response.data.data;

        return devoirs;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiSearchDevoirByEnseignant({ searchString, langue, limit, enseignantId }: { langue:string, searchString: string, limit:number, enseignantId:string }): Promise<DevoirReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchDevoirByEnseignant/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    enseignantId:enseignantId,
                }
            },
        );
        const devoirs: DevoirReturnGetType = response.data.data;

        return devoirs;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getDevoirsByNiveauPaginated({ niveauId, page, annee }: { niveauId: string, page: number, annee:number}): Promise<DevoirReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getDevoirsByNiveauPaginated/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee:annee,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const devoirs: DevoirReturnGetType = response.data.data;
        
        return devoirs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getDevoirsByEnseignantPaginated({ enseignantId, annee, page}: { enseignantId: string, annee:number, page:number }): Promise<DevoirReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getDevoirsByEnseignantPaginated/${enseignantId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    enseignantId: enseignantId,
                    annee:annee,
                    page:page,
                    pageSize:pageSize
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const devoirs: DevoirReturnGetType = response.data.data;
        
        return devoirs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function voirStatistiquesDevoir({ devoirId}: {devoirId: string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/voirStatistiquesDevoir/${devoirId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const devoirs: ReponseApiPros = response.data.data;
        
        return devoirs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}