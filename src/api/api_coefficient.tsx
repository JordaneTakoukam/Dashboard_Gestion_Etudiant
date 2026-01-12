//src/api/api_evaluation.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/coefficient`;
const token = localStorage.getItem(wstjqer);


export async function apiSetCoefficient(coefficientData: {matiere:string,  niveau: string, annee: number, semestre: number, coefficient:number, modifiePar:string}): Promise<ReponseApiPros> {
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

