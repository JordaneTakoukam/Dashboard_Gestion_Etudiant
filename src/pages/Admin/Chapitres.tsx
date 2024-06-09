import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalChapitre/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalChapitre/FormDelete";
import Table from "../../components/Tables/TableChapitre/Table";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";
import { setChapitreLoading, setChapitres, setErrorPageChapitre } from "../../_redux/features/chapitre_slice";
import { getChapitreByMatiereWithPagination } from "../../api/api_chapitre";
import createToast from "../../hooks/toastify";

const Chapitres = () => {
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);
    const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType | null>(null);

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const { data: { chapitres } } = useSelector((state: RootState) => state.chapitreSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedMatiere === undefined) {
            navigate('subjects/subject-list')
        }
    }, [selectedMatiere])
    const handleEditChapitre = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
        
    }
    
    const {t}=useTranslation();
    const handleAddChapitre = () => {
        setSelectedChapitre(null);
        
    }

    const dispatch = useDispatch();
    useEffect(() => {

        const fetchChapitres = async () => {
            dispatch(setChapitreLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyChapitres: ChapitreReturnGetType = {
                    chapitres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if(selectedMatiere && selectedMatiere._id){
                    const fetchedChapitres = await getChapitreByMatiereWithPagination({ matiereId: selectedMatiere._id, page: 1, annee: currentYear, semestre: currentSemestre, langue:lang });
                        
                    if (fetchedChapitres) { // Vérifiez si fetchedChapitres n'est pas faux, vide ou indéfini
                        dispatch(setChapitres(fetchedChapitres));
                    } else {
                        dispatch(setChapitres(emptyChapitres));
                    }
                }else {
                    dispatch(setChapitres(emptyChapitres));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageChapitre(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setChapitreLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchChapitres();
    }, [dispatch, selectedMatiere, t]); // Déclencher l'effet lorsque currentPage change

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.chapitres')} isChapitre={true} />
            <Table data={chapitres}  onCreate={handleAddChapitre} onEdit={handleEditChapitre} />

            <FormCreateUpdate chapitre={selectedChapitre} matiere={selectedMatiere}/>
            <FormDelete chapitre={selectedChapitre}  matiere={selectedMatiere}/>

        </>
    );
};

export default Chapitres;


// interface ChapitresProps {
//     matiereSelectionnee?: MatiereType | null; 
//     onEditMatiere?: (matiere : MatiereType) => void;
//     returnWithMatiere?:()=>void;
    
// }

// const Chapitres = ({ matiereSelectionnee, returnWithMatiere, onEditMatiere }: ChapitresProps) => {
//     const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType | null>(null);
//     const [matiereChapitres, setMatiereChapitres] = useState<ChapitreType[]>([]); // État pour les chapitres de la matière
//     const [openChapitres, setOpenChapitres] = useState(false);
//     const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
//     const handleEditChapitre = (chapitre: ChapitreType) => {
//         setSelectedChapitre(chapitre);
//         setOpenChapitres(false);
//     }
//     const handleUpdateChapitre = (chapitre: ChapitreType) => {
//         setSelectedChapitre(chapitre);
//     }
//     const {t}=useTranslation();
//     const handleAddChapitre = () => {
//         setSelectedChapitre(null);
//         setOpenChapitres(false);
//     }

//     const handleOpenChapitres = (chapitre: ChapitreType) => {
//         setSelectedChapitre(chapitre);
//         setOpenChapitres(true);
//     };


    
    
    
//     return (
//         <>
//             {!openChapitres && <Breadcrumb pageName={t('sub_menu.chapitres')} isChapitre={true} isChapitre={false} returnWithMatiere={returnWithMatiere}/>}
//             {!openChapitres && <Table data={matiereSelectionnee?.chapitres}  onCreate={handleAddChapitre} onEdit={handleEditChapitre} onAddObj={handleOpenChapitres} matiere={matiereSelectionnee} onEditMatiere={onEditMatiere}/>}

//             {!openChapitres && <FormCreateUpdate chapitre={selectedChapitre} matiere={matiereSelectionnee}/>}
//             {!openChapitres && <FormDelete chapitre={selectedChapitre}  matiere={matiereSelectionnee}/>}
//             {/* {openChapitres && <Chapitres chapitreSelectionnee={selectedChapitre} returnWithChapitre={handleAddChapitre} onEditMatiere={onEditMatiere} onEditChapitre={handleUpdateChapitre} matiereCourant={matiereSelectionnee}/>} */}

//         </>
//     );
// };

// export default Chapitres;

// export const typesEnseignement:TypeEnseignement[]=[cm, td, tp];

