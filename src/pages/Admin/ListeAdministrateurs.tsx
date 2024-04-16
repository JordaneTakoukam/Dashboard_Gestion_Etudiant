import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableAdministrateur/Table";
import { useTranslation } from "react-i18next";
import { ModalCreateUpdateAdmin } from "../../components/Modals/ModalAdministrateur/ModalCreateUpdateAdministrateur";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { SectionRefresh } from "../../components/ui/SectionRefresh";
import { setAdmin, setAdminsLoading, setErrorPageAdmin } from "../../_redux/features/admin_slice";
import FormDelete from "../../components/Modals/ModalAdministrateur/FormDelete";
import { PageErreur } from "../../components/_Global/PageErreur";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageNoData } from "../../components/_Global/PageNoData";
import { apiGetAdministrateurs } from "../../api/other_users/api_administrateur";
import { setShowModal } from "../../_redux/features/setting";
import { r_sup_ad } from "../../config";
import { ModalNonAutoriser } from "../../components/Modals/_NonAutoriser/ModalNonAutoriser";


const ListeDesAdministrateur = () => {
    const userRole = useSelector((state: RootState) => state.user.role);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedAdministrateur, setSelectedAdministrateur] = useState<AdminType | null>(null);
    const administrateurs = useSelector((state: RootState) => state.admin.data.list);

    const pageIsLoading = useSelector((state: RootState) => state.admin.pageIsLoading);
    const pageError = useSelector((state: RootState) => state.admin.pageError);

    const handleEdit = (administrateur: AdminType) => {
        setSelectedAdministrateur(administrateur);
    }

    const handleCreate = () => {
        handleAddOrUpdate();
        dispatch(setShowModal())
    }
    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddOrUpdate = () => {
        setSelectedAdministrateur(null);
    }

    const handleRefresh = async () => {
        await fetchList();
    };

    const fetchList = async () => {
        dispatch(setAdminsLoading(true));
        try {
            const fetchResult = await apiGetAdministrateurs({ page: 1 });

            if (fetchResult) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                dispatch(setAdmin(fetchResult));
                dispatch(setErrorPageAdmin(null));
            } else {
                dispatch(setErrorPageAdmin(t('message.erreur')));
            }
        } catch (error) {
            dispatch(setErrorPageAdmin(t('message.erreur')));
        } finally {
            dispatch(setAdminsLoading(false)); // Définissez le loading à false après le chargement
        }
    };

    // recuperer initalement la liste des admin
    useEffect(() => {
        if (administrateurs.length === 0) {
            handleRefresh();
        }
    }, [dispatch]);



    return (
        <>
            <Breadcrumb pageName={t('sub_menu.administrateurs')} />

            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        administrateurs.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.administrateur')}
                                titreBouton={t('ajouter_votre_premier.administrateur')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh}
                            />
                            :
                            <div>
                                <SectionRefresh refreshFunction={handleRefresh} />
                                <Table
                                    data={administrateurs}
                                    onCreate={handleAddOrUpdate}
                                    onEdit={handleEdit}
                                />
                            </div>

            }


            {/* {
                userRole === r_sup_ad ?
                <div>
                    <ModalCreateUpdateAdmin admin={selectedAdministrateur} />
                    <FormDelete administrateur={selectedAdministrateur} />
                </div>
                : <ModalNonAutoriser />
            } */}

            <div>
                <ModalCreateUpdateAdmin admin={selectedAdministrateur} />
                <FormDelete administrateur={selectedAdministrateur} />
            </div>

        </>
    );
};

export default ListeDesAdministrateur;
