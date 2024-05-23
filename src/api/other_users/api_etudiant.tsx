import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/user`;
const token = localStorage.getItem(wstjqer);



// 
//
// get
export async function apiGetEtudiantsWithPagination({ page, annee, niveauId }: { page: number, annee: number, niveauId: string }): Promise<EtudiantListGetType> {
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
                    annee: annee
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

export async function apiGetEtudiants({ annee, niveauId }: { annee: number, niveauId: string }): Promise<EtudiantListGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getAllEtudiantsByLevelAndYear/${niveauId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee: annee
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

export async function generateListEtudiant({ annee, departement, section, cycle, niveau, langue }: { annee: number, departement: CommonSettingProps, section: SectionProps, cycle: CycleProps, niveau: NiveauProps, langue: string }): Promise<Blob> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/generateListEtudiant/${annee}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    departement: departement,
                    section: section,
                    cycle: cycle,
                    niveau: niveau,
                    langue: langue
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

export async function apiGetTotalEtudiantByYear({ annee }: { annee: number }): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getTotalEtudiantsByYear`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee: annee
                },
            },
        );
        const totalEtudiant: number = response.data.data;
        return totalEtudiant;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiGetTotalEtudiantByNiveaux({ niveaux, annee }: { niveaux: InscriptionType[], annee: number }): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/getTotalEtudiantsByNiveau`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    niveaux: niveaux,
                    annee: annee
                },
            },
        );
        const totalEtudiant = response.data.data;
        return totalEtudiant.totalEtudiant;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function apiGetNbEtudiantsParSection({ annee }: { annee: number }): Promise<{ [section: string]: number }> {
    try {
        const response: AxiosResponse<{ data: { [section: string]: number } }> = await axios.get(
            `${api}/getNbEtudiantsParSection`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    annee: annee
                },
            },
        );
        const totalEtudiant = response.data.data;
        console.log(totalEtudiant)
        return totalEtudiant;
    } catch (error) {
        console.error('Error getting total students per section:', error);
        throw error;
    }
}

export async function apiGetNbAbsenceEtudiantsParSection({ annee, semestre }: { annee: number, semestre: number }): Promise<{ [section: string]: number }> {
    try {
        const response: AxiosResponse<{ data: { [section: string]: number } }> = await axios.get(
            `${api}/getNbAbsencesParSection`,
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
        const totalAbsenceEtudiant = response.data.data;
        console.log(totalAbsenceEtudiant)
        return totalAbsenceEtudiant;
    } catch (error) {
        console.error('Error getting total students per section:', error);
        throw error;
    }
}

// create
export async function apiCreateEtudiant({ nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, categorie, fonction, service, commune }: EtudiantType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/create-etudiant`,
            { nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, categorie, fonction, service, commune },
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
export async function apiUpdateEtudiant({ _id, nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, grade, date_entree, niveaux, categorie, fonction, service, commune, roles }: EtudiantType): Promise<ReponseApiPros> {

    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { nom, genre, email, photo_profil, contact, grade, matricule, prenom, date_naiss, lieu_naiss, date_entree, niveaux, categorie, fonction, service, commune, roles },
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
