//src/api/api_evaluation.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/note`;
const token = localStorage.getItem(wstjqer);



export async function apiSaisirNote(noteData: Partial<NoteType>): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/saisir`,
            noteData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
}

export async function getNotesByEvaluationMatiere(
    evaluationId: string,
    matiereId: string,
    page = 1,
    pageSize = 50
): Promise<NoteReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}/${matiereId}`,
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
        console.error('Error getting notes:', error);
        throw error;
    }
}

export async function getMesNotes(evaluationId: string): Promise<any> {
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
        console.error('Error getting my notes:', error);
        throw error;
    }
}

export async function apiDelibererEvaluation(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/deliberer/${evaluationId}`,
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
        console.error('Error deliberating:', error);
        throw error;
    }
}

export async function apiPublierResultats(evaluationId: string): Promise<ReponseApiPros> {
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
        console.error('Error publishing results:', error);
        throw error;
    }
}

export async function apiVerrouillerNotes(evaluationId: string): Promise<ReponseApiPros> {
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
        console.error('Error locking notes:', error);
        throw error;
    }
}

export async function calculerMoyennes(evaluationId: string): Promise<MoyenneEtudiantType[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/moyennes/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error calculating moyennes:', error);
        throw error;
    }
}
