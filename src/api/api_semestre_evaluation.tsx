//src/api/api_evaluation.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/semestre`;
const token = localStorage.getItem(wstjqer);



// ========================================
// INFORMATIONS SEMESTRES
// ========================================

export async function getSemestresByNiveau(niveauId: string): Promise<SemestreInfoType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting semestres info:', error);
        throw error;
    }
}

export async function validerNiveauSemestre(
    niveauId: string,
    semestre: number
): Promise<ValidationNiveauSemestreType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/valider/${niveauId}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error validating niveau-semestre:', error);
        throw error;
    }
}