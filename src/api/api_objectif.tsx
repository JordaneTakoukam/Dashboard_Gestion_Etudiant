import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/matiere/objectif`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateObjectif({ annee, semestre, code, libelleFr, libelleEn, etat, statut, matiere,chapitre, user }: { annee:number, semestre:number, code?:string, libelleFr:string, libelleEn:string, etat:number, statut:number, matiere:string,chapitre?:string, user:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { annee, semestre, code, libelleFr, libelleEn,etat, statut, matiere,chapitre, user},
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

export async function apiUpdateObjectif({ _id, annee, semestre, code, libelleFr, libelleEn,etat, matiere,statut, chapitre }: ObjectifType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { annee, semestre, code, libelleFr, libelleEn,etat, matiere,statut, chapitre },
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

export async function apiUpdateEtatObjectif({objectifId, etat}: {objectifId: string, etat: number}): Promise<ReponseApiPros> {
    try {
        
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update_etat/${objectifId}/${etat}`,
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
export async function apiUpdateStatutObj({ objectif }: {objectif:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/updateStatut/${objectif}`,
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

export async function apiDeleteObjectif(objectifId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${objectifId}`,
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

export async function getObjectifByMatiereWithPagination({ matiereId, page, annee, semestre, langue }: { matiereId: string, page: number, annee:number, semestre:number, langue:string }): Promise<ObjectifReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getObjectifs/${matiereId}`,
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
        const matieres: ObjectifReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getObjectifByChapitreWithPagination({ chapitreId, page, annee, semestre, langue }: { chapitreId: string, page: number, annee:number, semestre:number, langue:string }): Promise<ObjectifReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getObjectifsChap/${chapitreId}`,
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
        const chapitres: ObjectifReturnGetType = response.data.data;
        
        return chapitres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionMatiere({matiereId}:{matiereId:string}): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionMatiere/${matiereId}`,
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

export async function apiSearchObjectif({ searchString, langue, limit, matiereId, annee }: { langue:string, searchString: string, limit:number, matiereId:string, annee:number }): Promise<ObjectifReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchObjectif/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    matiereId:matiereId,
                    annee:annee,
                }
            },
        );
        const objectifs: ObjectifReturnGetType = response.data.data;

        return objectifs;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgressionGlobalEnseignants({annee, semestre}:{annee:number, semestre:number}): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignantsObj`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    annee:annee,
                    semestre:semestre
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

export async function getProgressionGlobalEnseignantsNiveau({niveauId, annee, semestre}:{niveauId: string, annee:number, semestre:number}): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignantsNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    annee:annee,
                    semestre:semestre
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

export async function getProgressionGlobalEnseignant(enseignantId: string, annee:number, semestre:number): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getProgressionGlobalEnseignant/${enseignantId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params : {
                    annee:annee,
                    semestre : semestre
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