import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/presence`;
const token = localStorage.getItem(wstjqer);



export async function apiPresence({ jour, semestre, annee, niveau, matiere, utilisateur, heureDebut, heureFin }: PresencePaieType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { jour, semestre, annee, niveau, matiere, utilisateur, heureDebut, heureFin },
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

// get
export async function apiGetPresencesWithTotalHoraire({ page, annee, semestre, niveauId }: { page: number, annee: number, semestre: number, niveauId: string }): Promise<PresencePaieListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getPresencesWithTotalHoraire/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    annee: annee,
                    semestre: semestre
                },
            },
        );
        const presences: PresencePaieListGetType = response.data.data;
        return presences;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListPresenceByNiveau({ niveauId, annee, semestre, departement, section, cycle, niveau, langue, fileType }: { niveauId: string, annee: number, semestre:number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string, fileType:string}): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListPresenceByNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee:annee,
                    semestre:semestre,
                    departement:departement,
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

export async function apiSearchPresenceEnseignant({ searchString, limit }: { searchString: string, limit:number }): Promise<PresencePaieListGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchEnseignantPresence`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    searchString:searchString
                }
            },
        );
        const presences: PresencePaieListGetType = response.data.data;

        return presences;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}