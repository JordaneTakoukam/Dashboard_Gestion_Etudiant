import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/absence`;
const token = localStorage.getItem(wstjqer);


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
