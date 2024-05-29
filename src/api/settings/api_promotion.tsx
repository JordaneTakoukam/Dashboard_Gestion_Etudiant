import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreatePromotion({ code, libelleFr, libelleEn, annee }: PromotionProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/promotion/create`,
            { code, libelleFr, libelleEn, annee },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating promotion:', error);
        throw error;
    }
}

export async function apiUpdatePromotion({ _id, code, libelleFr, libelleEn, annee }: PromotionProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/promotion/update/${_id}`,
            { code, libelleFr, libelleEn, annee },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating promotion:', error);
        throw error;
    }
}

export async function apiDeletePromotion(promotionId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/promotion/delete/${promotionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting promotion:', error);
        throw error;
    }
}
