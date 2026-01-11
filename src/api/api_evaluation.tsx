//src/api/api_evaluation.tsx

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/evaluation`;
const token = localStorage.getItem(wstjqer);

// ========================================
// ÉVALUATIONS
// ========================================

export async function apiCreateEvaluation(evaluationData: Partial<EvaluationType>): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create`,
            evaluationData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error creating evaluation:', error);
        throw error;
    }
}

export async function apiUpdateEvaluation(evaluationData: Partial<EvaluationType> & { _id: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${evaluationData._id}`,
            evaluationData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating evaluation:', error);
        throw error;
    }
}

export async function apiDeleteEvaluation(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting evaluation:', error);
        throw error;
    }
}

export async function getEvaluationsByNiveau({
    niveauId,
    annee,
    semestre,
    page = 1,
    pageSize = 10
}: {
    niveauId: string;
    annee?: number;
    semestre?: number;
    page?: number;
    pageSize?: number;
}): Promise<EvaluationReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee,
                    semestre,
                    page,
                    pageSize,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting evaluations:', error);
        throw error;
    }
}

export async function apiChangerStatutEvaluation(evaluationId: string, statut: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/statut/${evaluationId}`,
            { statut },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error changing evaluation status:', error);
        throw error;
    }
}

// ========================================
// ANONYMATS
// ========================================

export async function apiGenererAnonymats(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/anonymat/generer/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error generating anonymats:', error);
        throw error;
    }
}

export async function getNumerosAnonymatsByEvaluation(
    evaluationId: string,
    page = 1,
    pageSize = 50
): Promise<AnonymatReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/anonymat/numeros/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { page, pageSize },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting anonymats:', error);
        throw error;
    }
}

export async function apiVerifierAnonymat(numeroAnonymat: string, evaluationId?: string): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/anonymat/verifier/${numeroAnonymat}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { evaluationId },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error verifying anonymat:', error);
        throw error;
    }
}

export async function getMonAnonymat(evaluationId: string): Promise<AnonymatType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/anonymat/mon-anonymat/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting my anonymat:', error);
        throw error;
    }
}

// ========================================
// NOTES
// ========================================

export async function apiSaisirNote(noteData: Partial<NoteType>): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/note/saisir`,
            noteData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
}

export async function getNotesByEvaluationMatiere(
    evaluationId: string,
    matiereId: string,
    page = 1,
    pageSize = 50
): Promise<NoteReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/note/${evaluationId}/${matiereId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { page, pageSize },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting notes:', error);
        throw error;
    }
}

export async function getMesNotes(evaluationId: string): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/note/mes-notes/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting my notes:', error);
        throw error;
    }
}

export async function apiDelibererEvaluation(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/note/deliberer/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error deliberating:', error);
        throw error;
    }
}

export async function apiPublierResultats(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/note/publier/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error publishing results:', error);
        throw error;
    }
}

export async function apiVerrouillerNotes(evaluationId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/note/verrouiller/${evaluationId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error locking notes:', error);
        throw error;
    }
}

export async function calculerMoyennes(evaluationId: string): Promise<MoyenneEtudiantType[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/note/moyennes/${evaluationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error calculating moyennes:', error);
        throw error;
    }
}

// ========================================
// COEFFICIENTS
// ========================================

export async function apiSetCoefficient(coefficientData: Partial<CoefficientMatiereType>): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/coefficient/set`,
            coefficientData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error setting coefficient:', error);
        throw error;
    }
}

export async function getCoefficientsByNiveau(
    niveauId: string,
    annee?: number,
    semestre?: number,
    page = 1,
    pageSize = 50
): Promise<CoefficientReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/coefficient/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: { annee, semestre, page, pageSize },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting coefficients:', error);
        throw error;
    }
}

// ========================================
// INFORMATIONS SEMESTRES
// ========================================

export async function getSemestresByNiveau(niveauId: string): Promise<SemestreInfoType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/semestres/niveau/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error getting semestres info:', error);
        throw error;
    }
}

export async function validerNiveauSemestre(
    niveauId: string,
    semestre: number
): Promise<ValidationNiveauSemestreType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/semestres/valider/${niveauId}/${semestre}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );
        return response.data.data;
    } catch (error) {
        console.error('Error validating niveau-semestre:', error);
        throw error;
    }
}