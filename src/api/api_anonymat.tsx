//src/api/api_evaluation.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/anonymat`;
const token = localStorage.getItem(wstjqer);



export async function apiGenererAnonymats(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/generer/${evaluationId}`,
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
        console.error('Error generating anonymats:', error);
        throw error;
    }
}

export async function getNumerosAnonymatsByEvaluation(
    evaluationId: string,
    page = 1,
    pageSize = 50
): Promise<AnonymatReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/numeros/${evaluationId}`,
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
        console.error('Error getting anonymats:', error);
        throw error;
    }
}

export async function getAnonymatsByEvaluation(
    evaluationId: string,
    page = 1,
    pageSize = 50
): Promise<AnonymatReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/all/${evaluationId}`,
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
        console.error('Error getting anonymats:', error);
        throw error;
    }
}

export async function apiVerifierAnonymat(numeroAnonymat: string, evaluationId?: string): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/verifier/${numeroAnonymat}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { evaluationId },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error verifying anonymat:', error);
        throw error;
    }
}

export async function getMonAnonymat(evaluationId: string): Promise<AnonymatType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/mon-anonymat/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting my anonymat:', error);
        throw error;
    }
}
