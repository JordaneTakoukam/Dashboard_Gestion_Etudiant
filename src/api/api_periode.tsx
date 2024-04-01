import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';
import { ReponseApiPros } from './interface_reponse.js';


const api = `${apiUrl}/periode`;

const token = localStorage.getItem(wstjqer);

export async function apiCreatePeriode({ jour, semestre, annee, niveau, matiere, typeEnseignement, heureDebut, heureFin, salleCours }: PeriodeType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { jour, semestre, annee, niveau, matiere, typeEnseignement, heureDebut, heureFin, salleCours },
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

export async function apiUpdatePeriode({ _id, jour, semestre, annee, niveau, matiere, typeEnseignement, heureDebut, heureFin, salleCours }: PeriodeType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { jour, semestre, annee, niveau, matiere, typeEnseignement, heureDebut, heureFin, salleCours },
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

export async function apiDeletePeriode(periodeId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${periodeId}`,
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

export async function getPeriodesByNiveau({ niveauId, annee, semestre }: { niveauId: string, annee:number, semestre:number }): Promise<PeriodeReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesByNiveau/${niveauId}`,
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

        // Extraction de tous les objets de paramètres de la réponse
        const periodes: PeriodeReturnGetType = response.data.data;

        return periodes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPeriodesAVenirByNiveau({ niveauId }: { niveauId: string }): Promise<PeriodeReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesAVenirByNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const periodes: PeriodeReturnGetType = response.data.data;

        return periodes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
