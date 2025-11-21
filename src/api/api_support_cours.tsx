import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/support-de-cours`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateSupportDeCours({ formData}: { formData: FormData}): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<ReponseApiPros> = await axios.post(
            `${api}/create`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'token': token,
                }
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error saving supportdecours:', error);
        throw error;
    }
}

export async function apiUpdateSupportDeCours({ formData, supportId}: { formData: FormData, supportId:string}): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<ReponseApiPros> = await axios.put(
            `${api}/update/${supportId}`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'token': token,
                }
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error saving supportdecours:', error);
        throw error;
    }
}

export async function apiDeleteSupportDeCours(id: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${id}`,
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

export async function apiGetSupportDeCours({ page, type, annee, niveau }: { page: number, type?:number, annee:number, niveau:string }): Promise<SupportDeCoursListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getSupportsByFilters`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    type:type,
                    annee:annee,
                    niveau:niveau
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const supportdecours: SupportDeCoursListGetType = response.data.data;

        return supportdecours;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function apiSearchSupportDeCours({role,userId, langue, limit, niveauId, recherche }: {role:string, userId:string, langue:string, limit: number, niveauId?:string, recherche:string }): Promise<SupportDeCoursListGetType> {
    
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchSupports`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    role: role,
                    userId:userId,
                    langue:langue,
                    limit: limit,
                    niveauId:niveauId,
                    recherche:recherche
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const supportdecours: SupportDeCoursListGetType = response.data.data;

        return supportdecours;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiDownloadSupportDeCours(id: string, file_path?:string): Promise<void> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/downloadSupport/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token':token, 
                },
                responseType: 'blob', // Important for handling binary data (file download)
            },
        );

        // Extract the file name from the Content-Disposition header
        if(file_path){
            const fileName = file_path.split('/').pop();
            if(fileName){
                // Create a URL for the file and trigger a download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); // Set the file name
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }

        // return response.data;
    } catch (error) {
        console.error('Error downloading supportdecours:', error);
        throw error;
    }
}

