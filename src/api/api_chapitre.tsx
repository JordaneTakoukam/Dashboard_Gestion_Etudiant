import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/matiere/chapitre`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateChapitre({ annee, semestre, code, libelleFr, libelleEn, typesEnseignement,statut, user, matiere }: { annee:number, semestre:number, code?:string, libelleFr:string, libelleEn:string, typesEnseignement:EnseignementType[],statut:number, user:string, matiere:string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { annee, semestre, code, libelleFr, libelleEn, typesEnseignement, statut, user, matiere },
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

export async function apiUpdateChapitre({ _id, annee, semestre, code, libelleFr, libelleEn, typesEnseignement, matiere, statut }: ChapitreType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { annee, semestre, code, libelleFr, libelleEn, typesEnseignement, matiere, statut },
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

export async function apiUpdateStatutChap({ chapitre }: {chapitre:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/updateStatut/${chapitre}`,
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

export async function apiDeleteChapitre(chapitreId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${chapitreId}`,
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

export async function getChapitreByMatiereWithPagination({ matiereId, page, annee, semestre, langue }: { matiereId: string, page: number, annee:number, semestre:number, langue:string }): Promise<ChapitreReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getChapitres/${matiereId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee:annee,
                    semestre:semestre,
                    langue:langue
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: ChapitreReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiSearchChapitre({ searchString, langue, limit, matiereId, annee }: { langue:string, searchString: string, limit:number, matiereId:string, annee:number }): Promise<ChapitreReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchChapitre/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    matiereId:matiereId,
                    annee:annee
                }
            },
        );
        const chapitres: ChapitreReturnGetType = response.data.data;

        return chapitres;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignants(): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignants`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );
        const progress: number = response.data.data;
        return parseFloat(progress.toFixed(2));
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignantsNiveau(niveauId: string): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignantsNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );
        const progress: number = response.data.data;
        if(progress){
            return parseFloat(progress.toFixed(2));
        }
        return 0;
        
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignant(enseignantId: string): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignant/${enseignantId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );
        const progress: number = response.data.data;
        if(progress){
            return parseFloat(progress.toFixed(2));
        }
        return 0;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}