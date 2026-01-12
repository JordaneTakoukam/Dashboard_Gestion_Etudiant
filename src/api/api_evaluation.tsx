//src/api/api_evaluation.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/evaluation`;
const token = localStorage.getItem(wstjqer);

// ========================================
// ÉVALUATIONS
// ========================================

export async function apiCreateEvaluation(evaluationData: Partial<EvaluationType>): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            evaluationData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error creating evaluation:', error);
        throw error;
    }
}

export async function apiUpdateEvaluation(evaluationData: Partial<EvaluationType> & { _id: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${evaluationData._id}`,
            evaluationData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating evaluation:', error);
        throw error;
    }
}

export async function apiDeleteEvaluation(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting evaluation:', error);
        throw error;
    }
}

export async function getEvaluationsByNiveau({
    niveauId,
    annee,
    semestre,
    page = 1,
    pageSize = 10
}: {
    niveauId: string;
    annee?: number;
    semestre?: number;
    page?: number;
    pageSize?: number;
}): Promise<EvaluationReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee,
                    semestre,
                    page,
                    pageSize,
                },
            },
        );
       
        return response.data.data;
    } catch (error) {
        console.error('Error getting evaluations:', error);
        throw error;
    }
}

export async function apiChangerStatutEvaluation(evaluationId: string, statut: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/statut/${evaluationId}`,
            { statut },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error changing evaluation status:', error);
        throw error;
    }
}

