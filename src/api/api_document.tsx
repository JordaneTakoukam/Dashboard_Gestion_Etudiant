import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/document`;

const token = localStorage.getItem(wstjqer);

export async function apiSaveDocument({ formData, nomFr, nomEn }: { formData: FormData, nomFr:string, nomEn:string}): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<ReponseApiPros> = await axios.post(
            `${api}/upload`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'token': token,
                },
                params:{
                    nomFr,
                    nomEn
                }
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error saving document:', error);
        throw error;
    }
}

export async function apiDeleteDocument(id: string): Promise<ReponseApiPros> {
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

export async function apiGetDocuments({ page }: { page: number }): Promise<DocumentReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getDocuments`,
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
        const documents: DocumentReturnGetType = response.data.data;

        return documents;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiDownloadDocument(id: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/download/${id}/${lang}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token':token, 
                },
                responseType: 'blob', // Important for handling binary data (file download)
            },
        );

        // Create a URL for the file and trigger a download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `document_${id}.${lang}`); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.remove();

        return response.data;
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
}

export async function apiDownloadPiecesJointes(file_paths:string[]): Promise<void> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/download-pieces-jointes`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    file_paths
                },
                responseType: 'blob', // Important pour gérer les données binaires (téléchargement de fichiers)
            },
        );

        // Créer une URL pour le fichier et déclencher le téléchargement
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'documents.zip'); // Nom du fichier ZIP
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error('Erreur lors du téléchargement des documents:', error);
        throw error;
    }
}
