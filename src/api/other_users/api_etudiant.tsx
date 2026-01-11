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

export async function apiSearchEtudiant({ searchString, limit }: {  searchString: string, limit:number }): Promise<EtudiantListGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/searchEtudiant/${searchString}/${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
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

export async function generateListEtudiant({ 
    annee, 
    departement, 
    section, 
    cycle, 
    niveau, 
    langue, 
    fileType 
}: { 
    annee: number, 
    departement: CommonSettingProps, 
    section: SectionProps, 
    cycle: CycleProps, 
    niveau: NiveauProps, 
    langue: string, 
    fileType: string 
}): Promise<Blob> {
    try {
        console.log('=== Début requête PDF ===');
        
        const response: AxiosResponse = await axios.post(
            `${api}/generateListEtudiant/${annee}`,
            {
                departement,
                section,
                cycle,
                niveau,
                langue,
                fileType
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                responseType: 'blob',
                timeout: 60000 // 60 secondes
            },
        );

        console.log('Response reçue:', {
            status: response.status,
            contentType: response.headers['content-type'],
            size: response.data.size
        });

        // Vérifier que c'est bien un PDF
        if (response.data.type !== 'application/pdf') {
            // Tenter de lire le contenu pour voir si c'est une erreur JSON
            const text = await response.data.text();
            console.error('Réponse non-PDF reçue:', text);
            throw new Error('La réponse n\'est pas un PDF');
        }

        const pdfBlob: Blob = response.data;
        
        console.log('=== PDF reçu avec succès ===');
        
        return pdfBlob;
    } catch (error) {
        console.error('=== Erreur génération PDF ===');
        console.error('Error:', error);
        
        if (axios.isAxiosError(error) && error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            
            // Si c'est un blob d'erreur, le lire
            if (error.response.data instanceof Blob) {
                const text = await error.response.data.text();
                console.error('Error body:', text);
            }
        }
        
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
            `${api}/getTotalEtudiantsByNiveaux`,
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
        
        return totalAbsenceEtudiant;
    } catch (error) {
        console.error('Error getting total students per section:', error);
        throw error;
    }
}

// create
export async function apiCreateEtudiant({ nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, categorie, fonction, service, commune, nationalite, diplomeEntre, specialite }: EtudiantType): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/create/create-etudiant`,
            { nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, absences, niveaux, categorie, fonction, service, commune, nationalite, diplomeEntre, specialite },
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
export async function apiUpdateEtudiant({ _id, nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, niveaux, categorie, fonction, service, commune, roles, nationalite, diplomeEntre, specialite }: EtudiantType): Promise<ReponseApiPros> {

    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update/${_id}`,
            { nom, genre, email, photo_profil, contact, matricule, prenom, date_naiss, lieu_naiss, date_entree, niveaux, categorie, fonction, service, commune, roles, nationalite, diplomeEntre, specialite },
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
