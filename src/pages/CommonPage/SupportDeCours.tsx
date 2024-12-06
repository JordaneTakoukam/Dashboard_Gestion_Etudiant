import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { setErrorPageSupportDeCours, setSupportDeCours, setSupportDeCoursLoading } from "../../_redux/features/support_cours_slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import Loading from "../../components/ui/loading";
import { config } from "../../config";
import { apiGetSupportDeCours } from "../../api/api_support_cours";
import Table from "../../components/Tables/TableSupportDeCours/Table";
import ModalRole from "../../components/Modals/ModalEtudiant/ModalRole";
import ModalCreateSupportDeCours from "../../components/Modals/ModalSupportDeCours/FormCreateUpdate";
import ModalDeleteSupportDeCours from "../../components/Modals/ModalSupportDeCours/FormDelete";
import ModalDetailSupportDeCours from "../../components/Modals/ModalSupportDeCours/FormDetails";



const SupportDeCours = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedSupportDeCours, setSelectedSupportDeCours] = useState<SupportDeCoursType | null>(null);

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const userRole = useSelector((state: RootState) => state.user.role);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { supportsDeCours } } = useSelector((state: RootState) => state.supportDeCoursSlice);


    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading) ?? [];
    

    useEffect(() => {
        
        const fetchSupportDeCours = async () => {
            dispatch(setSupportDeCoursLoading(true)); // Définissez le loading à true avant le chargement
            try {
                // Initialisation de currentCycleId et currentNiveauId
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                const emptySupportDeCours: SupportDeCoursListGetType = {
                    supportsDeCours: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                let type = undefined;
                if(userRole === config.roles.etudiant || userRole === config.roles.delegue){
                    type = 1;
                }
                if(currentNiveauId){
                    const fetchedSupportDeCours = await apiGetSupportDeCours({ niveau: currentNiveauId, page: 1, annee:currentYear, type:type });
                    if (fetchedSupportDeCours) { // Vérifiez si fetchedSupportDeCourss n'est pas faux, vide ou indéfini
                        dispatch(setSupportDeCours(fetchedSupportDeCours));
                        
                    } else {
                        
                        dispatch(setSupportDeCours(emptySupportDeCours));
                    }
                }else{
                    dispatch(setSupportDeCours(emptySupportDeCours));
                }
               
            } catch (error) {
                dispatch(setErrorPageSupportDeCours(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setSupportDeCoursLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchSupportDeCours();
    }, [dispatch, t]);
    const handleEditSupportDeCours = (supportDeCours: SupportDeCoursType) => {
        setSelectedSupportDeCours(supportDeCours);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddSupportDeCours = () => {
        setSelectedSupportDeCours(null);
    }

    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.supports_de_cours')} />
            {
                settingIsLoading ?
                    <Loading /> :
                        <Table data={supportsDeCours} onCreate={handleAddSupportDeCours} onEdit={handleEditSupportDeCours} />
            }
            {/* Boite de dialogue */}
            <ModalCreateSupportDeCours supportDeCours={selectedSupportDeCours} />
            <ModalDeleteSupportDeCours supportDeCours={selectedSupportDeCours} />
            <ModalDetailSupportDeCours supportDeCours={selectedSupportDeCours} />
        </>
    );
};

export default SupportDeCours;


