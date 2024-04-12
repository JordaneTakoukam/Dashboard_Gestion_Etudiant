import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormDelete from "../../components/Modals/ModalEnseignant/FormDelete";
import Table from "../../components/Tables/TablesEnseignants/Table";
import { Commune } from "./Communes";
import { Niveau } from "./Niveaux";
import { Abscences } from "../CommonPage/Abscences";
import { Grade } from "./Grades";
import { Categorie } from "./Categories";
import { useTranslation } from "react-i18next";
import { ModalCreateUpdateEnseignant } from "../../components/Modals/ModalEnseignant/FormCreateUpdate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setShowModal } from "../../_redux/features/setting";
import { setEnseignant, setEnseignantsLoading, setErrorPageEnseignant } from "../../_redux/features/enseignant_slice";
import { apiGetEnseignants } from "../../api/other_users/api_enseignant";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import { SectionRefresh } from "../../components/ui/SectionRefresh";
import { ModalNonAutoriser } from "../../components/Modals/_NonAutoriser/ModalNonAutoriser";
import { r_adm, r_enseig, r_sup_ad } from "../../config";


const ListeDesEnseignant = () => {
    const userRole = useSelector((state: RootState) => state.user.role);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedEnseignant, setSelectedEnseignant] = useState<EnseignantType | null>(null);
    const enseignants = useSelector((state: RootState) => state.enseignant.data.list);

    const pageIsLoading = useSelector((state: RootState) => state.enseignant.pageIsLoading);
    const pageError = useSelector((state: RootState) => state.enseignant.pageError);

    const handleEdit = (enseignant: EnseignantType) => {
        setSelectedEnseignant(enseignant);
    }

    const handleCreate = () => {
        handleAddOrUpdate();
        dispatch(setShowModal())
    }
    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddOrUpdate = () => {
        setSelectedEnseignant(null);
    }

    const handleRefresh = async () => {
        await fetchList();
    };

    const fetchList = async () => {
        dispatch(setEnseignantsLoading(true));
        try {
            const fetchResult = await apiGetEnseignants({ page: 1 });

            if (fetchResult) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                dispatch(setEnseignant(fetchResult));
                dispatch(setErrorPageEnseignant(null));
            } else {
                dispatch(setErrorPageEnseignant(t('message.erreur')));
            }
        } catch (error) {
            dispatch(setErrorPageEnseignant(t('message.erreur')));
        } finally {
            dispatch(setEnseignantsLoading(false)); // Définissez le loading à false après le chargement
        }
    };

    // recuperer initalement la liste des admin
    useEffect(() => {
        if (enseignants.length === 0) {
            handleRefresh();
        }
    }, [dispatch]);


    return (
        <>
            <Breadcrumb pageName={t('sub_menu.liste_enseignant')} />

            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        enseignants.length === 0 ?
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
                                    data={enseignants}
                                    onCreate={handleAddOrUpdate}
                                    onEdit={handleEdit}
                                />
                            </div>

            }


            {
                userRole === r_sup_ad || userRole === r_adm ?
                    <div>
                        <ModalCreateUpdateEnseignant enseignant={selectedEnseignant} />
                        <FormDelete enseignant={selectedEnseignant} />
                    </div>
                    : <ModalNonAutoriser />
            }

        </>
    );
};

export default ListeDesEnseignant;







export interface Enseignant {
    id?: number
    nom: string;
    prenom?: string;
    genre: string;
    dateNaiss?: string,
    lieuNaiss?: string;
    email: string;
    contact?: string;
    matricule?: string;
    niveaux?: Niveau[];
    grade?: Grade;
    categorie?: Categorie;
    region?: CommonSettingProps;
    commune?: Commune;
    dateEntreeAdmin?: string;
    abscences: Abscences[];
}


export const absencesEnseignant: Abscences[] = [
    {
        id: 1,
        date: "01/01/2023",
        debutPeriode: "07:30",
        finPeriode: "09:30",
        semestre: 1,
    },
    {
        id: 2,
        date: "10/01/2023",
        debutPeriode: "07:30",
        finPeriode: "09:30",
        semestre: 1,
    },
    {
        id: 3,
        date: "15/01/2023",
        debutPeriode: "12:30",
        finPeriode: "16:30",
        semestre: 1,
    },
    {
        id: 4,
        date: "17/02/2023",
        debutPeriode: "10:30",
        finPeriode: "12:30",
        semestre: 1,
    },
]
export const enseignant: Enseignant = {
    id: 1,
    nom: "Jane",
    prenom: "Smith",
    email: "test@123",
    contact: "655484959",
    matricule: "CD5678",
    genre: "H",
    abscences: absencesEnseignant,
}
export const enseignants: Enseignant[] = [
    {
        id: 1,
        nom: "Jane",
        prenom: "Smith",
        email: "test@123",
        contact: "655484959",
        matricule: "CD5678",
        genre: "H",
        abscences: [],

    },
    {
        id: 2,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre: "M",
        abscences: [],
    },
    {
        id: 3,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre: "F",
        abscences: [],
    },
    {
        id: 4,
        nom: "Bob",
        prenom: "Brown",
        email: "test@123",
        contact: "677978745",
        matricule: "GH3456",
        genre: "H",
        abscences: [],
    },
    {
        id: 5,
        nom: "Emily",
        prenom: "Taylor",
        email: "test@123",
        contact: "677966888",
        matricule: "IJ7890",
        genre: "F",
        abscences: [],
    },
    {
        id: 6,
        nom: "Michael",
        prenom: "Anderson",
        email: "test@123",
        contact: "655489566",
        matricule: "KL2345",
        genre: "H",
        abscences: [],
    },
    {
        id: 7,
        nom: "Sophia",
        prenom: "Martinez",
        email: "test@123",
        contact: "677944777",
        matricule: "MN6789",
        genre: "F",
        abscences: [],
    },
    {
        id: 8,
        nom: "William",
        prenom: "Garcia",
        email: "test@123",
        contact: "655484343",
        matricule: "OP0123",
        genre: "H",
        abscences: [],
    },
    {
        id: 9,
        nom: "Olivia",
        prenom: "Hernandez",
        email: "test@123",
        contact: "677955666",
        matricule: "QR4567",
        genre: "F",
        abscences: [],
    },
    {
        id: 10,
        nom: "James",
        prenom: "Lopez",
        email: "test@123",
        contact: "677988877",
        matricule: "ST8901",
        genre: "H",
        abscences: [],
    },
    {
        id: 11,
        nom: "Maria",
        prenom: "Ramirez",
        email: "test@123",
        contact: "677999888",
        matricule: "UV2345",
        genre: "F",
        abscences: [],
    }
];
