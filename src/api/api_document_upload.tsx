import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/document`;

const token = localStorage.getItem(wstjqer);

export async function apiSaveDocumentUpload({ formData}: { formData: FormData}): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<ReponseApiPros> = await axios.post(
            `${api}/upload`,
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
        console.error('Error saving documentupload:', error);
        throw error;
    }
}

export async function apiDeleteDocumentUpload(id: string): Promise<ReponseApiPros> {
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

export async function apiGetDocumentUploads({ page }: { page: number }): Promise<DocumentUploadReturnGetType> {
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
        const documentuploads: DocumentUploadReturnGetType = response.data.data;

        return documentuploads;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiDownloadDocumentUpload(id: string, file_path?:string): Promise<void> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/download/${id}`,
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
        console.error('Error downloading documentupload:', error);
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
        console.error('Erreur lors du téléchargement des documentuploads:', error);
        throw error;
    }
}
