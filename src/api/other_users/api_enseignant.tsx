import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/user/`;
const token = localStorage.getItem(wstjqer);



// 
//
// get
export async function apiGetEnseignants({ page }: { page: number }): Promise<EnseignantListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getEnseignants`,
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
        const list: EnseignantListGetType = response.data;

        return list;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

// 
//
// create
export async function apiCreateEnseignant({ ...newEnseignant }: EnseignantCreateType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/create-enseignant`,
            { ...newEnseignant },
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
export async function apiUpdateEnseignant(enseignantUpdate: EnseignantType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${enseignantUpdate._id}`,
            { ...enseignantUpdate },
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
export async function apiDeleteEnseignant(id: string): Promise<ReponseApiPros> {
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
