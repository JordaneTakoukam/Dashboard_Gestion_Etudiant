import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/absence`;
const token = localStorage.getItem(wstjqer);

export async function apiGetAbsencesSignaler({ userId, niveauxId, role, annee, semestre }: { userId: string, niveauxId?:string[], role:string, annee:number, semestre:number }): Promise<SignalementAbsence[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAbsencesSignaler/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    niveauxId:niveauxId,
                    role:role,
                    annee:annee,
                    semestre: semestre,
                },
            },
        );
        const absences = response.data.data.absences;

        return absences;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiSignalerAbsence({user,enseignant,role,heure_debut_absence,heure_fin_absence,jour_absence,semestre,annee,niveau}: SignalementAbsence): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/signaler`,
            { user, enseignant, role, heure_debut_absence, heure_fin_absence, jour_absence,semestre,annee,niveau },
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




export async function apiGetAbsencesByUserAndFilter({ userId, semestre, annee }: { userId: string, semestre: Number, annee: Number }): Promise<AbsenceType[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAbsencesByUserAndFilter/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const absences = response.data.data.absences;

        return absences;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetAbsencesWithEnseignantsByFilter({ page, semestre, annee }: { page?: number, semestre?: Number, annee?: Number }): Promise<EnseignantDisciplineListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAbsencesWithEnseignantsByFilter`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const enseignants = response.data.data;

        return enseignants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetAllAbsencesWithEnseignantsByFilter({semestre, annee }: { semestre?: Number, annee?: Number }): Promise<EnseignantDisciplineListGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAllAbsencesWithEnseignantsByFilter`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const enseignants = response.data.data;

        return enseignants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListAbsenceEnseignant({langue, semestre, annee }: {langue:string, semestre?: Number, annee?: Number}): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListAbsenceEnseignant`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    semestre: semestre,
                    annee: annee,
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

export async function apiGetAbsencesWithEtudiantsByFilter({ page, semestre, annee, niveauId }: { page?: number, semestre?: Number, annee?: Number, niveauId:string }): Promise<EtudiantDisciplineListGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAbsencesWithEtudiantsByFilter/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const etudiants = response.data.data;

        return etudiants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetAllAbsencesWithEtudiantsByFilter({semestre, annee, niveauId }: { semestre?: Number, annee?: Number, niveauId:string }): Promise<EtudiantDisciplineListGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAllAbsencesWithEtudiantsByFilter/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const etudiants = response.data.data;

        return etudiants;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateListAbsenceEtudiant({semestre, annee, departement, section, cycle, niveau, langue }: { semestre?: Number, annee?: Number, departement:CommonSettingProps, section:SectionProps, cycle:CycleProps, niveau:NiveauProps, langue:string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListAbsenceEtudiant/${annee}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
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

export async function apiGetTotalHoursOfAbsenceByTeacher({semestre, annee }: {semestre?: Number, annee?: Number }): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getTotalHoursOfAbsenceByTeacher`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const total = response.data.data;

        return total;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}
export async function apiGetTotalHoursOfAbsenceByStudent({semestre, annee }: {semestre?: Number, annee?: Number }): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getTotalHoursOfAbsenceByStudent`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    semestre: semestre,
                    annee: annee
                },
            },
        );
        const total = response.data.data;

        return total;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}
export async function apiCreateAbsence({ userId, ...absence }: CreateAbsenceType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/${userId}`,
            { ...absence },
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


export async function apiDeleteAbsence({ userId, absenceId }: DeleteAbsenceType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${userId}/${absenceId}`,
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

export async function apiJustifierAbsence({userId, ...absence }: UpdateAbsenceType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update`,
            { ...absence },
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


