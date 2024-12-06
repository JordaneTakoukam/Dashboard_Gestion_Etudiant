import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { setErrorPageEnseignant, setEnseignant, setEnseignantsLoading } from "../../_redux/features/enseignant_slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { apiGetEnseignantsWithPagination } from "../../api/other_users/api_enseignant";
import Table from "../../components/Tables/TableEnseignant/Table";
import ModalCreateEnseignant from "../../components/Modals/ModalEnseignant/FormCreateUpdate";
import ModalDeleteEnseignant from "../../components/Modals/ModalEnseignant/FormDelete";
import Loading from "../../components/ui/loading";



const ListeDesEnseignants = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: { enseignants } } = useSelector((state: RootState) => state.enseignantSlice);
    const [selectedEnseignant, setSelectedEnseignant] = useState<EnseignantType | null>(null);
    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading) ?? [];


    // Utilisez useSelector pour accéder à l'état du reducer


    const handleEditEnseignant = (enseignant: EnseignantType) => {
        setSelectedEnseignant(enseignant);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddEnseignant = () => {
        setSelectedEnseignant(null);
    }

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                dispatch(setEnseignantsLoading(true));
                const fetchedEnseignants = await apiGetEnseignantsWithPagination({ page: 1 });
                if (fetchedEnseignants) {
                    dispatch(setErrorPageEnseignant(null));
                    dispatch(setEnseignant(fetchedEnseignants));
                } else {
                    dispatch(setErrorPageEnseignant(t('message.erreur')));
                }
            } catch (error) {
                dispatch(setErrorPageEnseignant(t('message.erreur')));
            } finally {
                dispatch(setEnseignantsLoading(false));
            }
        };

        fetchEnseignants();
    }, [dispatch, t]);
    

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.liste_enseignant')} />
            {
                settingIsLoading ?
                    <Loading /> :
                        <Table data={enseignants} onCreate={handleAddEnseignant} onEdit={handleEditEnseignant} />
            }

            {/* Boite de dialogue */}
            <ModalCreateEnseignant enseignant={selectedEnseignant} />
            <ModalDeleteEnseignant enseignant={selectedEnseignant} />
        </>
    );
};

export default ListeDesEnseignants;


