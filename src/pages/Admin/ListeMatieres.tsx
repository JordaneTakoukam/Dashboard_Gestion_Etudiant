import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";
import { Niveau } from "./Niveaux";
import FormDelete from "../../components/Modals/ModalMatiere/FormDelete";
import FormCreateUpdate from "../../components/Modals/ModalMatiere/FormCreateUpdate";
import Chapitres from "./Chapitres";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { getMatieresByEnseignantNiveau, getMatieresByNiveauWithPagination } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from "../../_redux/features/matiere_slice";
import Enseignements from "./Enseignements";
import { config } from "../../config";
import { setSections, setCycles } from "../../_redux/features/data_setting_slice";
import { setShowModalChapitre, setShowModalEnseignement } from "../../_redux/features/setting";

const ListeDesMatieres = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // const [openChapitres, setOpenChapitre] = useState(false);
    // const [openEnseignements, setOpenEnseignements] = useState(false);
    const openChapitres = useSelector((state: RootState) => state.setting.showModal.openChapitre);
    const openEnseignements = useSelector((state: RootState) => state.setting.showModal.openEnseignement);
    const [selectedMatiere, setSelectedMatiere] = useState<MatiereType | null>(null);
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    // Utilisez useSelector pour accéder à l'état du reducer
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const niveauxEns:InscriptionType[]=currentUser.niveaux;
    
    
    const roles = config.roles;
    

    useEffect(() => {
        
        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyMatieres : MatiereReturnGetType={
                    matieres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                let currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                if(roles.enseignant === currentUser.role){
                    const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux[0]?.niveau);
                    currentNiveauId=currentNiveau?._id;
                }
                if (currentNiveauId) {
                    let fetchedMatieres=null;
                    if(currentUser && currentUser.role===roles.enseignant){
                        fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: currentNiveauId, enseignantId: currentUser._id });
                    }else{
                        fetchedMatieres = await getMatieresByNiveauWithPagination({ niveauId: currentNiveauId, page: 1 });
                    }
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                        console.log(matieres);
                    } else {
                        dispatch(setMatieres(emptyMatieres));
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                console.log(error);
                dispatch(setErrorPageMatiere(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchMatieres();
    }, [dispatch, t, niveauxEns]);

    const handleEditSection = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
    }

    const handleEditMatiere = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
        // setOpenChapitre(false);
        // setOpenEnseignements(false);
    }

    const handleAddMatiere = () => {
        setSelectedMatiere(null);
        dispatch(setShowModalChapitre(false));
        dispatch(setShowModalEnseignement(false));
    }

    const handleOpenChapitres = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
        // setOpenChapitre(true);
        // setOpenEnseignements(false);
        
    };

    const handleOpenEnseignement = (matiere: MatiereType) => {
        setSelectedMatiere(matiere);
        // setOpenEnseignements(true);
        // setOpenChapitre(false);
    };
    return (
        <>
            {!openChapitres && !openEnseignements && <Breadcrumb pageName={t('sub_menu.liste_matiere')} />}
            {!openChapitres && !openEnseignements && <Table data={matieres} onCreate={handleAddMatiere} onEdit={handleEditMatiere} onAddChap={handleOpenChapitres} onAddEnseignement={handleOpenEnseignement} />}

            {!openChapitres && !openEnseignements && <FormCreateUpdate matiere={selectedMatiere} />}
            {!openChapitres && !openEnseignements && <FormDelete matiere={selectedMatiere} />}
            {openChapitres && !openEnseignements && <Chapitres matiereSelectionnee={selectedMatiere} returnWithMatiere={handleAddMatiere} onEditMatiere={handleEditMatiere}/>}
            {openEnseignements && !openChapitres && <Enseignements matiereSelectionnee={selectedMatiere} returnWithMatiere={handleAddMatiere} onEditMatiere={handleEditMatiere}/>}
        </>
    );
};

export default ListeDesMatieres;
