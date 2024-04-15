import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/user/`;
const token = localStorage.getItem(wstjqer);



// 
//
// get
export async function apiGetEtudiantsWithPagination({ page, annee, niveauId }: { page: number, annee:number, niveauId:string }): Promise<EtudiantListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getEtudiantsByLevelAndYear/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee:annee
                },
            },
        );
        const etudiants: EtudiantListGetType = response.data.data;

        return etudiants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetEtudiants({annee, niveauId }: {annee:number, niveauId:string }): Promise<EtudiantListGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAllEtudiantsByLevelAndYear/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee:annee
                },
            },
        );
        const etudiants: EtudiantListGetType = response.data.data;

        return etudiants;
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
