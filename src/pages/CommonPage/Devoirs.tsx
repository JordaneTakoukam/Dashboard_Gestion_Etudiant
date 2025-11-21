import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormDelete from "../../components/Modals/ModalDevoir/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { getDevoirsByEnseignantPaginated, getDevoirsByNiveauPaginated } from "../../api/api_devoir";
import createToast from "../../hooks/toastify";
import { setDevoirLoading, setDevoirs, setErrorPageDevoir } from "../../_redux/features/devoir_slice";
import { config } from "../../config";
import Loading from "../../components/ui/loading";
import Table from "../../components/Tables/TableDevoir/Table";
import FormCreateUpdate from "../../components/Modals/ModalDevoir/FormCreateUpdate";

const Devoirs = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // const [openChapitres, setOpenChapitre] = useState(false);
    // const [openEnseignements, setOpenEnseignements] = useState(false);

    const [selectedDevoir, setSelectedDevoir] = useState<DevoirType | null>(null);
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    // Utilisez useSelector pour accéder à l'état du reducer
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const { data: { devoirs } } = useSelector((state: RootState) => state.devoirSlice);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const niveauxEns: InscriptionType[] = currentUser.niveaux;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en


    const roles = config.roles;


    useEffect(() => {

        const fetchDevoirs = async () => {
            dispatch(setDevoirLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyDevoirs: DevoirReturnGetType = {
                    devoirs: [],
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
                if (roles.etudiant === currentUser.role || roles.delegue === currentUser.role) {
                    const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux[0]?.niveau);
                    currentNiveauId = currentNiveau?._id;
                }
                if (currentNiveauId) {
                    let fetchedDevoirs=null;
                    if(currentUser && currentUser.role===roles.enseignant){
                        fetchedDevoirs = await getDevoirsByEnseignantPaginated({enseignantId: currentUser._id, annee:currentYear, page:1 });
                    }else{
                        fetchedDevoirs = await getDevoirsByNiveauPaginated({ niveauId: currentNiveauId, page: 1,  annee: currentYear });
                    }
                    if (fetchedDevoirs) { // Vérifiez si fetchedDevoirs n'est pas faux, vide ou indéfini
                        dispatch(setDevoirs(fetchedDevoirs));
                    } else {
                        dispatch(setDevoirs(emptyDevoirs));
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageDevoir(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setDevoirLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchDevoirs();
        
    }, [dispatch, t, niveauxEns]);


    const handleEditDevoir = (devoir: DevoirType) => {
        setSelectedDevoir(devoir);
    }

    const handleAddDevoir = () => {
        setSelectedDevoir(null);
    }


    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.cahier_exercice')} />


            {settingIsLoading ? 
                <Loading /> :
                    <Table data={devoirs} onCreate={handleAddDevoir} onEdit={handleEditDevoir} />
            }

            <FormCreateUpdate devoir={selectedDevoir} />
            <FormDelete devoir={selectedDevoir} />
        </>
    );
};

export default Devoirs;
