import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';
import { niveaux } from '../pages/Admin/Niveaux.js';


const api = `${apiUrl}/periode-enseignement`;

const token = localStorage.getItem(wstjqer);

export async function apiCreatePeriodeEnseignement({ annee, semestre, periodeFr, periodeEn, dateDebut, dateFin, niveau, enseignements }: PeriodeEnseignementType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { annee, semestre, periodeFr, periodeEn, dateDebut, dateFin, niveau, enseignements },
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

export async function apiUpdatePeriodeEnseignement({ _id, annee, semestre, periodeFr, periodeEn, dateDebut, dateFin, niveau, enseignements }: PeriodeEnseignementType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { annee, semestre, periodeFr, periodeEn, dateDebut, dateFin, niveau, enseignements },
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

export async function apiDeletePeriodeEnseignement(matiereId: string): Promise<ReponseApiPros> {
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

export async function getPeriodesEnseignementWithPagination({ niveauId, page, annee, semestre }: { niveauId: string, page: number, annee:number, semestre:number }): Promise<PeriodeEnseignementReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesEnseignementWithPagination/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee: annee,
                    semestre:semestre
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: PeriodeEnseignementReturnGetType = response.data.data;        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPeriodesEnseignement({ niveauId, annee, semestre }: { niveauId: string, annee:number, semestre:number }): Promise<ProgressionPeriodeEnseignementReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesEnseignement/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee: annee,
                    semestre:semestre
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: ProgressionPeriodeEnseignementReturnGetType = response.data.data;   
        console.log(matieres);
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListPeriodeEnseignement({ niveauId, annee, semestre }: { niveauId: string, annee:number, semestre:number }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListPeriodeEnseignement/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee: annee,
                    semestre:semestre
                },
                responseType: 'blob',
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const pdfBlob: Blob = response.data;

        return pdfBlob;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateProgressionPeriodeEnseignement({ periode }: { periode:PeriodeEnseignementType }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateProgressionPeriodeEnseignement`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    periode: periode
                },
                responseType: 'blob',
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const pdfBlob: Blob = response.data;

        return pdfBlob;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}