//src/api/api_coefficient.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/coefficient`;
const token = localStorage.getItem(wstjqer);


export async function apiSetCoefficient(coefficientData: {
    matiere: string,  
    niveau: string, 
    annee: number, 
    semestre: number, 
    coefficient: number, 
    modifiePar: string
}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/set`,
            coefficientData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error setting coefficient:', error);
        throw error;
    }
}

export async function getCoefficientsByNiveau(
    niveauId: string,
    annee?: number,
    semestre?: number,
    page = 1,
    pageSize = 50
): Promise<CoefficientReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { annee, semestre, page, pageSize },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting coefficients:', error);
        throw error;
    }
}

export async function getLatestCoefficientByMatiere(
    matiereId: string, 
    niveauId: string
): Promise<{ success: boolean; data?: CoefficientMatiereType; message?: any }> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/latest/${matiereId}/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching latest coefficient:', error);
        throw error;
    }
}

export async function getCoefficient(
    matiereId: string,
    niveauId: string,
    annee: number,
    semestre: number
): Promise<{ success: boolean; data?: CoefficientMatiereType; message?: any }> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${matiereId}/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { annee, semestre },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching coefficient:', error);
        throw error;
    }
}

export async function deleteCoefficient(coefficientId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${coefficientId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting coefficient:', error);
        throw error;
    }
}

export async function copierCoefficients(copyData: {
    niveauSource: string,
    anneeSource: number,
    semestreSource: number,
    niveauCible: string,
    anneeCible: number,
    semestreCible: number
}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/copier`,
            copyData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error copying coefficients:', error);
        throw error;
    }
}