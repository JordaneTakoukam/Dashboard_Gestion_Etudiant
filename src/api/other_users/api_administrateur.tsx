import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/user`;
const token = localStorage.getItem(wstjqer);



// 
//
// get
export async function apiGetAdministrateurs({ page }: { page: number }): Promise<AdminListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAdministrateurs`,
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
        const list: AdminListGetType = response.data;

        return list;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

// 
//
// create
export async function apiCreateAdministrateur({nom, genre, email, photo_profil, contact, matricule,nationalite, prenom, date_naiss, lieu_naiss, date_entree, categorie, fonction, service, commune }: AdminCreateType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/create-admin`,
            { nom, genre, email, photo_profil, contact, matricule,nationalite, prenom, date_naiss, lieu_naiss, date_entree, categorie, fonction, service, commune },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section : ', error);
        throw error;
    }
}

//
//
// update 
export async function apiUpdateAdministrateur(adminUpdate: AdminType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${adminUpdate._id}`,
            { ...adminUpdate },
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

//
//
// delete
export async function apiDeleteAdministrateur(id: string): Promise<ReponseApiPros> {
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
