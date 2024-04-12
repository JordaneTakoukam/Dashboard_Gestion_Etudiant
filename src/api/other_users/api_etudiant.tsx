import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/user/`;
const token = localStorage.getItem(wstjqer);



// 
//
// get
export async function apiGetEtudiants({ page }: { page: number }): Promise<EtudiantListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getEtudiants`,
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
        const list: EtudiantListGetType = response.data;

        return list;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

// 
//
// create
export async function apiCreateEtudiant({ ...newEtudiant }: EtudiantCreateType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/create-etudiant`,
            { ...newEtudiant },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        // console.error('Error creating section : ', error);
        throw error;
    }
}

//
//
// update 
export async function apiUpdateEtudiant(etudiantUpdate: EtudiantType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${etudiantUpdate._id}`,
            { ...etudiantUpdate },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        // console.error('Error updating section:', error);
        throw error;
    }
}

//
//
// delete
export async function apiDeleteEtudiant(id: string): Promise<ReponseApiPros> {
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
        // console.error('Error deleting section:', error);
        throw error;
    }
}
