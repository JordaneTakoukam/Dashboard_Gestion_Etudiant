import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/matiere/objectif`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateObjectif({ annee, semestre, code, libelleFr, libelleEn, etat, matiere }: ObjectifType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { annee, semestre, code, libelleFr, libelleEn,etat, matiere},
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

export async function apiUpdateObjectif({ _id, annee, semestre, code, libelleFr, libelleEn,etat, matiere }: ObjectifType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { annee, semestre, code, libelleFr, libelleEn,etat, matiere },
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

export async function apiDeleteObjectif(objectifId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${objectifId}`,
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

export async function getObjectifByMatiereWithPagination({ matiereId, page, annee, semestre }: { matiereId: string, page: number, annee:number, semestre:number }): Promise<ObjectifReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getObjectifs/${matiereId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee:annee,
                    semestre:semestre
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: ObjectifReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionMatiere({matiereId}:{matiereId:string}): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionMatiere/${matiereId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );
        const progress: number = response.data.data;
        return parseFloat(progress.toFixed(2));
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignants({annee, semestre}:{annee:number, semestre:number}): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignants`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    annee:annee,
                    semestre:semestre
                }
            },
        );
        const progress: number = response.data.data;
        return parseFloat(progress.toFixed(2));
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignantsNiveau({niveauId, annee, semestre}:{niveauId: string, annee:number, semestre:number}): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignantsNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    annee:annee,
                    semestre:semestre
                }
            },
        );
        const progress: number = response.data.data;
        if(progress){
            return parseFloat(progress.toFixed(2));
        }
        return 0;
        
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignant(enseignantId: string, annee:number, semestre:number): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignant/${enseignantId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params : {
                    annee:annee,
                    semestre : semestre
                }
            },
        );
        const progress: number = response.data.data;
        if(progress){
            return parseFloat(progress.toFixed(2));
        }
        return 0;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}