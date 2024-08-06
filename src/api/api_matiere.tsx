import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/matiere`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateMatiere({ code, libelleFr, libelleEn, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement, chapitres, objectifs }: MatiereType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            { code, libelleFr, libelleEn, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement, chapitres, objectifs },
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

export async function apiUpdateMatiere({ _id, code, libelleFr, libelleEn, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement, chapitres, objectifs }: MatiereType): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { code, libelleFr, libelleEn, prerequisFr, prerequisEn, approchePedFr, approchePedEn, evaluationAcquisFr, evaluationAcquisEn, typesEnseignement, chapitres, objectifs },
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

export async function apiDeleteMatiere(matiereId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${matiereId}`,
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

export async function apiSearchMatiere({ searchString, langue, limit }: { langue:string, searchString: string, limit:number }): Promise<MatiereReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchMatiere/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit
                }
            },
        );
        const matieres: MatiereReturnGetType = response.data.data;

        return matieres;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiSearchMatiereByEnseignant({ searchString, langue, limit, enseignantId, annee }: { langue:string, searchString: string, limit:number, enseignantId:string, annee:number }): Promise<MatiereReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchMatiereByEnseignant/${langue}/${searchString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    limit:limit,
                    enseignantId:enseignantId,
                    annee:annee
                }
            },
        );
        const matieres: MatiereReturnGetType = response.data.data;

        return matieres;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getMatieresByNiveauWithPagination({ niveauId, page, annee, semestre, langue }: { niveauId?: string, page: number, annee?:number, semestre?:number, langue:string }): Promise<MatiereReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getMatieresByNiveauWithPagination/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    langue:langue,
                    page: page,
                    pageSize: pageSize,
                    annee:annee,
                    semestre:semestre
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: MatiereReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
export async function getMatieresByEnseignantNiveau({ niveauId, enseignantId, annee, semestre, langue }: { niveauId: string, enseignantId: string, annee:number, semestre:number, langue:string }): Promise<MatiereReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getMatieresByEnseignantNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    langue:langue,
                    enseignantId: enseignantId,
                    annee:annee,
                    semestre:semestre
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: MatiereReturnGetType = response.data.data;
        
        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListMatByEnseignantNiveau({ niveauId, enseignantId, annee, semestre, departement, section, cycle, niveau, langue }: { niveauId: string, enseignantId: string, annee: number, semestre:number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListMatByEnseignantNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    enseignantId: enseignantId,
                    annee:annee,
                    semestre:semestre,
                    departement:departement,
                    section:section,
                    cycle:cycle,
                    niveau:niveau,
                    langue:langue
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

export async function generateProgressByEnseignant({ niveauId, enseignantId, annee, semestre, departement, section, cycle, niveau, langue, fileType }: { niveauId: string, enseignantId: string, annee: number, semestre:number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string, fileType:string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateProgressByEnseignant/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    enseignantId: enseignantId,
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

export async function generateProgressChapitreByEnseignant({ niveauId, enseignantId, annee, semestre, departement, section, cycle, niveau, langue, fileType }: { niveauId: string, enseignantId: string, annee: number, semestre:number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string, fileType:string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateProgressChapitreByEnseignant/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    enseignantId: enseignantId,
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

export async function getMatieresByNiveau({ langue, niveauId, annee, semestre }: { niveauId?: string, annee?:number, semestre?:number, langue: string}): Promise<ProgressionMatiereReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getMatieresByNiveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    langue:langue,
                    annee:annee,
                    semestre:semestre
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const matieres: ProgressionMatiereReturnGetType = response.data.data;

        return matieres;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListMatByNiveau({ annee, semestre, departement, section, cycle, niveau, langue }: { annee?: number, semestre?:number, departement?:CommonSettingProps, section?:SectionProps, cycle?:CycleProps, niveau?:NiveauProps, langue:string}): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListMatByNiveau/${annee}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    departement:departement,
                    section:section,
                    cycle:cycle,
                    niveau:niveau,
                    langue:langue
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

export async function generateProgressByNiveau({ annee, semestre, departement, section, cycle, niveau, langue, fileType }: {  annee: number, semestre:number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string, fileType:string}): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateProgressByNiveau/${annee}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
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

export async function generateProgressChapitreByNiveau({ annee, semestre, departement, section, cycle, niveau, langue, fileType, filename }: {  annee: number, semestre:number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string, fileType:string, filename?:string}): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateProgressChapitreByNiveau/${annee}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    departement:departement,
                    section:section,
                    cycle:cycle,
                    niveau:niveau,
                    langue:langue,
                    fileType:fileType,
                    filename:filename,
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