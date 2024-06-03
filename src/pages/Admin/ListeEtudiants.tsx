import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import ModalDeleteEtudiant from "../../components/Modals/ModalEtudiant/DialogDeleteEtudiant";
import TableEtudiant from "../../components/Tables/TablesEtudiants/TableEdudiants";
import { useTranslation } from "react-i18next";
import { setErrorPageEtudiant, setEtudiant, setEtudiantsLoading } from "../../_redux/features/etudiant_slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { apiGetEtudiantsWithPagination } from "../../api/other_users/api_etudiant";
import ModalCreateEtudiant from "../../components/Modals/ModalEtudiant/DialogCreateEtudiant";
import ModalRole from "../../components/Modals/ModalEtudiant/ModalRole";
import Loading from "../../components/ui/loading";



const ListeDesEtudiants = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedEtudiant, setSelectedEtudiant] = useState<EtudiantType | null>(null);

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { etudiants } } = useSelector((state: RootState) => state.etudiantSlice);


    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading) ?? [];

    useEffect(() => {
        const fetchEtudiants = async () => {
            dispatch(setEtudiantsLoading(true)); // Définissez le loading à true avant le chargement
            try {
                // Initialisation de currentCycleId et currentNiveauId
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                const emptyEtudiants: EtudiantListGetType = {
                    etudiants: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if (currentNiveauId) {
                    const fetchedEtudiants = await apiGetEtudiantsWithPagination({ niveauId: currentNiveauId, page: 1, annee: currentYear });
                    if (fetchedEtudiants) { // Vérifiez si fetchedEtudiants n'est pas faux, vide ou indéfini
                        dispatch(setEtudiant(fetchedEtudiants));
                        console.log(etudiants);
                    } else {
                        dispatch(setEtudiant(emptyEtudiants));
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageEtudiant(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setEtudiantsLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchEtudiants();
    }, [dispatch, t]);
    const handleEditEtudiant = (etudiant: EtudiantType) => {
        setSelectedEtudiant(etudiant);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddEtudiant = () => {
        setSelectedEtudiant(null);
    }

    const handleAddRole = (etudiant: EtudiantType) => {
        setSelectedEtudiant(etudiant);
    };
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.liste_etudiant')} />
            {
                settingIsLoading ?
                    <div className=" pt-30 lg:pt-50"><Loading /></div> :
                    <TableEtudiant data={etudiants} onCreate={handleAddEtudiant} onAddRole={handleAddRole} onEdit={handleEditEtudiant} />
            }
            {/* Boite de dialogue */}
            <ModalCreateEtudiant etudiant={selectedEtudiant} />
            <ModalDeleteEtudiant etudiant={selectedEtudiant} />{/*Supprimer un étudiant */}
            <ModalRole etudiant={selectedEtudiant} />{/*Supprimer un étudiant */}
        </>
    );
};

export default ListeDesEtudiants;


