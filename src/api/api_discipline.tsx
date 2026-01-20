// src/api/api_discipline.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/discipline`;
const token = localStorage.getItem(wstjqer);

/**
 * Obtenir la liste des étudiants pour la saisie de discipline
 */
export async function getEtudiantsForDiscipline(evaluationId: string): Promise<EtudiantsForDisciplineReturnType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/etudiants/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting students for discipline:', error);
        throw error;
    }
}

/**
 * Saisir une note de discipline
 */
export async function apiSaisirNoteDiscipline(disciplineData: {
    evaluation: string,
    etudiant: string,
    note: number,
    appreciationFr?: string,
    appreciationEn?: string,
    manquements?: ManquementType[],
    bonus?: BonusType[],
    saisiePar: string,
    modifiePar?: string
}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/saisir`,
            disciplineData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error saving discipline note:', error);
        throw error;
    }
}

/**
 * Saisie rapide d'une note de discipline (validation + enregistrement)
 */
export async function saisieRapideNoteDiscipline(disciplineData: {
    evaluation: string,
    etudiant: string,
    note: number,
    appreciationFr?: string,
    appreciationEn?: string,
    manquements?: ManquementType[],
    bonus?: BonusType[],
    saisiePar: string,
    modifiePar?: string
}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/saisie-rapide`,
            disciplineData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error quick saving discipline note:', error);
        throw error;
    }
}

/**
 * Obtenir les notes de discipline d'une évaluation
 */
export async function getNotesDisciplineByEvaluation(
    evaluationId: string,
    page = 1,
    pageSize = 50
): Promise<DisciplineReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { page, pageSize },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting discipline notes:', error);
        throw error;
    }
}

/**
 * Délibérer les notes de discipline
 */
export async function apiDelibererDiscipline(evaluationId: string, valideePar: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/deliberer/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { valideePar }
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error deliberating discipline:', error);
        throw error;
    }
}

/**
 * Publier les notes de discipline
 */
export async function apiPublierNotesDiscipline(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/publier/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error publishing discipline notes:', error);
        throw error;
    }
}

/**
 * Verrouiller les notes de discipline
 */
export async function apiVerrouillerNotesDiscipline(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/verrouiller/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error locking discipline notes:', error);
        throw error;
    }
}

/**
 * Obtenir ma note de discipline (étudiant)
 */
export async function getMaNoteDiscipline(evaluationId: string): Promise<DisciplineType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/mes-notes/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting my discipline note:', error);
        throw error;
    }
}