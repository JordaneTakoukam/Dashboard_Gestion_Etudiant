import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/permission`;

const token = localStorage.getItem(wstjqer);

export async function apiCreatePermission({ nom, libelleFr, libelleEn, descriptionFr, descriptionEn }:PermissionType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            {nom, libelleFr, libelleEn, descriptionFr, descriptionEn},
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

export async function apiUpdatePermission({ _id, nom, libelleFr, libelleEn, descriptionFr, descriptionEn }: PermissionType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { nom, libelleFr, libelleEn, descriptionFr, descriptionEn },
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

export async function apiDeletePermission(permissionId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${permissionId}`,
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

export async function getPermissionsWithPagination({page, langue }: { page: number, langue:string }): Promise<PermissionReturnGetType> {
    const limit: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPermissionsWithPagination`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    limit: limit,
                    langue:langue
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: PermissionReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiSearchPermission({ searchString, langue, limit}: { langue:string, searchString: string, limit:number}): Promise<PermissionReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchPermission/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    langue:langue,
                }
            },
        );
        const permissions: PermissionReturnGetType = response.data.data;

        return permissions;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}