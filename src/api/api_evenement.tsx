import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/evenement`;

const token = localStorage.getItem(wstjqer);

interface PDFResponse {
    data: Blob; // Utilisez Blob pour gérer les données binaires (PDF)
}

export async function apiCreateEvenement({ code, libelleFr, libelleEn, dateDebut, dateFin, periodeFr, periodeEn, etat, personnelFr, personnelEn, descriptionObservationFr, descriptionObservationEn, annee }: EvenementType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { code, libelleFr, libelleEn, dateDebut, dateFin, periodeFr, periodeEn, etat, personnelFr, personnelEn, descriptionObservationFr, descriptionObservationEn, annee },
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

export async function apiUpdateEvenement({ _id, code, libelleFr, libelleEn, dateDebut, dateFin, periodeFr, periodeEn, etat, personnelFr, personnelEn, descriptionObservationFr, descriptionObservationEn, annee }: EvenementType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { code, libelleFr, libelleEn, dateDebut, dateFin, periodeFr, periodeEn, etat, personnelFr, personnelEn, descriptionObservationFr, descriptionObservationEn, annee },
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

export async function apiDeleteEvenement(evenementId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${evenementId}`,
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

export async function getEvenementsByYear({ annee, page }: { annee: number, page: number }): Promise<EvenementReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getByYearByPage/${annee}`,
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
        const evenements: EvenementReturnGetType = response.data.data;

        return evenements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getAllEvenementsByYear({ annee}: { annee: number}): Promise<EvenementReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAllEvenementsByYear/${annee}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const evenements: EvenementReturnGetType = response.data.data;

        return evenements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getFirstTenEventsOfYear({ annee}: { annee: number}): Promise<EvenementReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getFirstTenEventsOfYear/${annee}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const evenements: EvenementReturnGetType = response.data.data;
        return evenements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListEvent({annee, langue}:{annee: number, langue:string}): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListEvent/${annee}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    langue:langue
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
