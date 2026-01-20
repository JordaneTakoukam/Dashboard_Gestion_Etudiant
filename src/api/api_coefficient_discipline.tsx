// src/api/api_coefficient_discipline.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/coefficient-discipline`;
const token = localStorage.getItem(wstjqer);

/**
 * Créer ou mettre à jour un coefficient de discipline
 */
export async function apiSetCoefficientDiscipline(coefficientData: {
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
        console.error('Error setting discipline coefficient:', error);
        throw error;
    }
}

/**
 * Obtenir le coefficient de discipline
 */
export async function getCoefficientDiscipline(
    niveauId: string,
    annee: number,
    semestre: number
): Promise<CoefficientDisciplineType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { annee, semestre }
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting discipline coefficient:', error);
        throw error;
    }
}

/**
 * Obtenir tous les coefficients de discipline d'un niveau
 */
export async function getCoefficientsDisciplineByNiveau(
    niveauId: string,
    annee?: number,
    semestre?: number,
    page = 1,
    pageSize = 50
): Promise<CoefficientDisciplineReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { annee, semestre, page, pageSize }
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting discipline coefficients:', error);
        throw error;
    }
}

/**
 * Obtenir le coefficient de discipline le plus récent
 */
export async function getLatestCoefficientDiscipline(niveauId: string): Promise<CoefficientDisciplineType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/latest/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting latest discipline coefficient:', error);
        throw error;
    }
}

/**
 * Supprimer un coefficient de discipline
 */
export async function deleteCoefficientDiscipline(coefficientId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${coefficientId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting discipline coefficient:', error);
        throw error;
    }
}

/**
 * Copier les coefficients de discipline d'une période vers une autre
 */
export async function copierCoefficientsDiscipline(copyData: {
    niveauSource: string,
    anneeSource: number,
    semestreSource: number,
    niveauCible: string,
    anneeCible: number,
    semestreCible: number,
    modifiePar: string
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
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error copying discipline coefficients:', error);
        throw error;
    }
}