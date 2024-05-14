import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/user`;
const token = localStorage.getItem(wstjqer);



// 
//
// get
export async function apiGetEnseignantsWithPagination({ page, grade, categorie, service, fonction }: { page: number, grade?: string, categorie?: string, service?: string, fonction?: string }): Promise<EnseignantListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getEnseignantsByFilter`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    grade: grade,
                    categorie: categorie,
                    service: service,
                    fonction: fonction
                },
            },
        );
        const enseignants: EnseignantListGetType = response.data.data;
        return enseignants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetEnseignants({ grade, categorie, service, fonction }: { grade?: string, categorie?: string, service?: string, fonction?: string }): Promise<EnseignantListGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAllEnseignantsByFilter`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    grade: grade,
                    categorie: categorie,
                    service: service,
                    fonction: fonction
                },
            },
        );
        const enseignants: EnseignantListGetType = response.data.data;

        return enseignants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListEnseignant({ grade, categorie, service, fonction }: { grade?: string, categorie?: string, service?: string, fonction?: string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListEnseignant`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    grade: grade,
                    categorie: categorie,
                    service: service,
                    fonction: fonction
                },
                responseType: 'blob',
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const pdfBlob: Blob = response.data;

        return pdfBlob;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetEnseignantsByNomPrenom(): Promise<EnseignantListGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getEnseignantsByNomPrenom`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        const enseignants: EnseignantListGetType = response.data.data;

        return enseignants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetTotalEnseignants(): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getTotalEnseignants`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        const totalEnseignant: number = response.data.data;
        console.log("====" + totalEnseignant);
        return totalEnseignant;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetNiveauxByEnseignant({ enseignantId, annee, semestre }: { enseignantId: string, annee: number, semestre: number }): Promise<InscriptionType[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getNiveauxByEnseignant/${enseignantId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee: annee,
                    semestre: semestre
                },
            },
        );
        const niveaux: InscriptionType[] = response.data.data;
        console.log("====" + niveaux);
        return niveaux;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

// create
export async function apiCreateEnseignant({ nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, grade, categorie, fonction, service, commune }: EnseignantCreateType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/create-enseignant`,
            { nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, grade, categorie, fonction, service, commune },
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


// update 
export async function apiUpdateEnseignant({ _id, nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, grade, categorie, fonction, service, commune }: EnseignantType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, grade, categorie, fonction, service, commune },
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
