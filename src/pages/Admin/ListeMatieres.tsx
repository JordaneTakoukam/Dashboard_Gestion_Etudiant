import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";
import { Niveau } from "./Niveaux";
import FormDelete from "../../components/Modals/ModalMatiere/FormDelete";
import FormCreateUpdate from "../../components/Modals/ModalMatiere/FormCreateUpdate";
import { Enseignant } from "./ListeEnseignants";
import Chapitres, { Chapitre } from "./Chapitres";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { getMatieresByNiveauWithPagination } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from "../../_redux/features/matiere_slice";

export interface Matiere {
    id? : number;
    code: string;
    libelle: string;
    prerequis?: string;
    evaluationDesAcquis?: string;
    niveau: Niveau;
    enseignant:Enseignant;
    enseignantSup?:Enseignant
    approchePedagogique?: string;
    chapitres? : Chapitre[];
}




const ListeDesMatieres = () => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [openChapitres, setOpenChapitre]=useState(false);
    const [selectedMatiere, setSelectedMatiere] = useState<MatiereType | null>(null);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveau);
    const currentNiveauId =niveaux && niveaux.length>0 && niveaux[0]._id;
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);

    useEffect(() => {
        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                if (currentNiveauId) {
                    const fetchedMatieres = await getMatieresByNiveauWithPagination({ niveauId: currentNiveauId, page: 1 });
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                        console.log(matieres);
                    } else {
                        // Traitez le cas où fetchedMatieres est faux, vide ou indéfini
                        // Vous pouvez ignorer cette condition si vous souhaitez simplement ne rien faire dans ce cas
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageMatiere(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchMatieres();
    }, [currentNiveauId, dispatch]);

    const handleEditSection = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
    }

    const handleEditMatiere = (matiere : MatiereType) => {
        setSelectedMatiere(matiere);
        setOpenChapitre(false);
    }

    const handleAddMatiere = () => {
        console.log("is call");
        setSelectedMatiere(null);
        setOpenChapitre(false);
    }

    const handleOpenChapitres = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
        setOpenChapitre(true);
    };
    return (
        <>
            {!openChapitres && <Breadcrumb pageName={t('sub_menu.liste_matiere')} />}
            {!openChapitres && <Table data={matieres} onCreate={handleAddMatiere} onEdit={handleEditMatiere} onAddChap={handleOpenChapitres}/>}
            
            {!openChapitres && <FormCreateUpdate matiere={selectedMatiere}/>}
            {!openChapitres && <FormDelete matiere={selectedMatiere}/>}
            {openChapitres && <Chapitres matiereSelectionnee={selectedMatiere} returnWithMatiere={handleAddMatiere}/>}
        </>
    );
};

export default ListeDesMatieres;

export const enseignants: Enseignant[] = [];

export const matieres: Matiere[] = [];
