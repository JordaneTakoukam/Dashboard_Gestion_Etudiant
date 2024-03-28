import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';
import { ReponseApiPros } from './interface_reponse.js';
import EvenementProps from '../_types/evenement_type.js';


const api = `${apiUrl}/evenement`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateEvenement({ code, libelleFr, libelleEn, dateDebut, dateFin, periodeFr, periodeEn, etat, personnelFr, personnelEn, descriptionObservationFr, descriptionObservationEn, annee }: EvenementProps): Promise<ReponseApiPros> {
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

export async function apiUpdateEvenement({ _id, code, libelleFr, libelleEn, dateDebut, dateFin, periodeFr, periodeEn, etat, personnelFr, personnelEn, descriptionObservationFr, descriptionObservationEn, annee }: EvenementProps): Promise<ReponseApiPros> {
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

export async function getEvenementsByYear(annee:String, page:number): Promise<EvenementProps> {
    const pageSize : number = 10;
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
        const evenements: EvenementProps = response.data;

        return evenements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
