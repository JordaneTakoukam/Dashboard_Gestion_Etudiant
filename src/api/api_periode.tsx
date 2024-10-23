import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/periode`;

const token = localStorage.getItem(wstjqer);

export async function apiCreatePeriode({ jour, semestre, annee, niveau, matieres, typesEnseignements, enseignantsPrincipaux, enseignantsSuppleants, heureDebut, heureFin, sallesCours, pause }: PeriodeType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { jour, semestre, annee, niveau, matieres, typesEnseignements, enseignantsPrincipaux, enseignantsSuppleants, heureDebut, heureFin, sallesCours, pause },
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

export async function apiUpdatePeriode({ _id, jour, semestre, annee, niveau, matieres, typesEnseignements, enseignantsPrincipaux, enseignantsSuppleants, heureDebut, heureFin, sallesCours, pause }: PeriodeType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { jour, semestre, annee, niveau, matieres, enseignantsPrincipaux, enseignantsSuppleants, typesEnseignements, heureDebut, heureFin, sallesCours, pause },
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

export async function apiDeletePeriode({periodeId, matiereIndex}:{periodeId:string, matiereIndex:number}): Promise<ReponseApiPros> {
    console.log(matiereIndex)
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${periodeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    matiereIndex,
                }
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting section:', error);
        throw error;
    }
}

export async function getPeriodesByNiveau({ niveauId, annee, semestre }: { niveauId: string, annee:number, semestre:number }): Promise<PeriodeReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesByNiveau/${niveauId}`,
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

        // Extraction de tous les objets de paramètres de la réponse
        const periodes: PeriodeReturnGetType = response.data.data;

        return periodes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateEmploisDuTemps({ section, cycle, niveau, langue, annee, semestre, fileType }: {section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string, annee:number, semestre:number, fileType:string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateEmploisDuTemps/${annee}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    section:section,
                    cycle:cycle,
                    niveau:niveau,
                    langue:langue,
                    fileType:fileType
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

export async function getPeriodesAVenirByNiveau({ niveauId, annee, semestre }: { niveauId: string, annee:number, semestre:number }): Promise<PeriodeReturnGetType> {
    const nbElement=5;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesAVenirByNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params : {
                    annee:annee,
                    semestre : semestre,
                    nbElement:nbElement
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const periodes: PeriodeReturnGetType = response.data.data;

        return periodes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPeriodesAVenirByEnseignant({ enseignantId, annee, semestre }: { enseignantId: string, annee:number, semestre:number }): Promise<PeriodeReturnGetType> {
    const nbElement=10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPeriodesAVenirByEnseignant/${enseignantId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params : {
                    annee:annee,
                    semestre : semestre,
                    nbElement:nbElement
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const periodes: PeriodeReturnGetType = response.data.data;
        console.log(periodes);

        return periodes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}