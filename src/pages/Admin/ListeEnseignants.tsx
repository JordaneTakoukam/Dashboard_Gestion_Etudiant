import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { setErrorPageEnseignant, setEnseignant, setEnseignantsLoading } from "../../_redux/features/enseignant_slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { apiGetEnseignantsWithPagination } from "../../api/other_users/api_enseignant";
import Table from "../../components/Tables/TablesEnseignants/Table";
import ModalCreateEnseignant from "../../components/Modals/ModalEnseignant/FormCreateUpdate";
import ModalDeleteEnseignant from "../../components/Modals/ModalEnseignant/FormDelete";



const ListeDesEnseignants = () => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [selectedEnseignant, setSelectedEnseignant] = useState<EnseignantType | null>(null);
    
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { enseignants } } = useSelector((state: RootState) => state.enseignantSlice);


    useEffect(() => {
        const fetchEnseignants = async () => {
            dispatch(setEnseignantsLoading(true)); // Définissez le loading à true avant le chargement
            try {
                // Initialisation de currentCycleId et currentNiveauId
               
                const emptyEnseignants : EnseignantListGetType={
                    enseignants: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                const fetchedEnseignants = await apiGetEnseignantsWithPagination({page:1});
                if (fetchedEnseignants) { // Vérifiez si fetchedEnseignants n'est pas faux, vide ou indéfini
                    dispatch(setEnseignant(fetchedEnseignants));
                    console.log(enseignants);
                } else {
                    dispatch(setEnseignant(emptyEnseignants));
                }
            } catch (error) {
                dispatch(setErrorPageEnseignant(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setEnseignantsLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchEnseignants();
    }, [dispatch, t]);
    const handleEditEnseignant = (enseignant: EnseignantType) => {
        setSelectedEnseignant(enseignant);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddEnseignant = () => {
        setSelectedEnseignant(null);
    }
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.liste_enseignant')} />
            
            <Table data={enseignants} onCreate={handleAddEnseignant} onEdit={handleEditEnseignant} />

            {/* Boite de dialogue */}
            <ModalCreateEnseignant enseignant={selectedEnseignant} /> 
            <ModalDeleteEnseignant enseignant={selectedEnseignant}/>
        </>
    );
};

export default ListeDesEnseignants;


