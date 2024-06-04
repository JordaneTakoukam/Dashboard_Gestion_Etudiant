import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";
import FormDelete from "../../components/Modals/ModalMatiere/FormDelete";
import FormCreateUpdate from "../../components/Modals/ModalMatiere/FormCreateUpdate";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { getMatieresByEnseignantNiveau, getMatieresByNiveauWithPagination } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from "../../_redux/features/matiere_slice";
import { config } from "../../config";
import Loading from "../../components/ui/loading";
import { Root } from "react-dom/client";

const ListeDesMatieres = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // const [openChapitres, setOpenChapitre] = useState(false);
    // const [openEnseignements, setOpenEnseignements] = useState(false);

    const [selectedMatiere, setSelectedMatiere] = useState<MatiereType | null>(null);
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    // Utilisez useSelector pour accéder à l'état du reducer
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const niveauxEns: InscriptionType[] = currentUser.niveaux;


    const roles = config.roles;


    useEffect(() => {

        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyMatieres: MatiereReturnGetType = {
                    matieres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                let currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                if (roles.enseignant === currentUser.role) {
                    const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux[0]?.niveau);
                    currentNiveauId = currentNiveau?._id;
                }
                if (currentNiveauId) {
                    let fetchedMatieres=null;
                    if(currentUser && currentUser.role===roles.enseignant){
                        fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: currentNiveauId, enseignantId: currentUser._id, annee:currentYear, semestre:currentSemestre });
                    }else{
                        fetchedMatieres = await getMatieresByNiveauWithPagination({ niveauId: undefined, page: 1,  annee: undefined, semestre: undefined });
                    }
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                    } else {
                        dispatch(setMatieres(emptyMatieres));
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
        
    }, [dispatch, t, niveauxEns]);


    const handleEditMatiere = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
    }

    const handleAddMatiere = () => {
        setSelectedMatiere(null);
    }


    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.liste_matiere')} />


            {settingIsLoading ? <div className=" pt-30 lg:pt-50"><Loading /></div> :

                <Table data={matieres} onCreate={handleAddMatiere} onEdit={handleEditMatiere} />

            }

            <FormCreateUpdate matiere={selectedMatiere} />
            <FormDelete matiere={selectedMatiere} />
        </>
    );
};

export default ListeDesMatieres;
