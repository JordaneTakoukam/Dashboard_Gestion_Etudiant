import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/devoir/question`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateQuestion({ textFr,textEn,type,options,nbPoint, devoir }: QuestionType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { textFr,textEn,type,options,nbPoint, devoir },
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

export async function apiUpdateQuestion({ _id, textFr,textEn,type,options,nbPoint, devoir }: QuestionType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { textFr,textEn,type,options,nbPoint, devoir },
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


export async function apiDeleteQuestion(questionId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${questionId}`,
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

export async function obtenirQuestionsDevoir({ devoirId, page }: { devoirId: string, page: number}): Promise<QuestionReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/obtenirQuestionsDevoir/${devoirId}`,
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
        const devoirs: QuestionReturnGetType = response.data.data;
        
        return devoirs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiSearchQuestion({ searchString, langue, limit, devoirId}: { langue:string, searchString: string, limit:number, devoirId:string }): Promise<QuestionReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchQuestion/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    devoirId:devoirId,
                }
            },
        );
        const questions: QuestionReturnGetType = response.data.data;

        return questions;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}