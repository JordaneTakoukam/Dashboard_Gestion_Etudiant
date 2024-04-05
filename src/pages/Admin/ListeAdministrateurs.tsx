import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableAdministrateur/Table";
import { useTranslation } from "react-i18next";
import { ModalCreateUpdateUser } from "../../components/Modals/ModalEtudiant/ModalCreateUpdateUser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { SectionRefresh } from "../../components/ui/SectionRefresh";
import { setAdminsLoading } from "../../_redux/features/admin_slice";
import FormDelete from "../../components/Modals/ModalAdministrateur/FormDelete";
import { PageErreur } from "../../components/_Global/PageErreur";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageNoData } from "../../components/_Global/PageNoData";


const ListeDesAdministrateur = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedAdministrateur, setSelectedAdministrateur] = useState<AdminType | null>(null);
    const administrateurs = useSelector((state: RootState) => state.admin.data.list);

    const pageIsLoading = useSelector((state: RootState) => state.admin.pageIsLoading);
    const pageError = useSelector((state: RootState) => state.admin.pageError);

    const handleEditAdmin = (administrateur: AdminType) => {
        setSelectedAdministrateur(administrateur);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddUpdateAdmin = () => {
        setSelectedAdministrateur(null);
    }

    const handleRefresh = async () => {
        dispatch(setAdminsLoading(true));
        // Wait for 1 second
        setTimeout(() => {
            dispatch(setAdminsLoading(false));
        }, 1000);
    };




    // GESTION DES du filtre de l'input
    const [searchText, setSearchText] = useState<string>('');


    return (
        <>
            <Breadcrumb pageName={t('sub_menu.administrateurs')} />
            <SectionRefresh refreshFunction={handleRefresh} />


            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        administrateurs.length === 0 ?

                            <PageNoData
                                titrePage={t('aucun.administrateur')}
                                titreBouton={t('label.ajouter') + ' ' + t('recherche.administrateur')}
                                showModalCreate={() => { }}
                                refreshFunction={handleRefresh}
                            />
                            : <Table
                                data={administrateurs}
                                onCreate={handleAddUpdateAdmin}
                                onEdit={handleEditAdmin}
                            />

            }


            <ModalCreateUpdateUser type="administrateur" user={selectedAdministrateur} />
            <FormDelete administrateur={selectedAdministrateur} />

        </>
    );
};

export default ListeDesAdministrateur;
