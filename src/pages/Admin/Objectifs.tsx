import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableObjectif/Table";
import FormCreateUpdate from "../../components/Modals/ModalObjectif/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalObjectif/FormDelete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";
import { setObjectifLoading, setObjectifs, setErrorPageObjectif } from "../../_redux/features/objectif_slice";
import { getObjectifByMatiereWithPagination } from "../../api/api_objectif";
import createToast from "../../hooks/toastify";




const Objectifs = () => {
    const [selectedObjectif, setSelectedObjectif] = useState<ObjectifType | null>(null);
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const { data: { objectifs } } = useSelector((state: RootState) => state.objectifSlice);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    const handleEditObejctif = (objectif: ObjectifType) => {
        setSelectedObjectif(objectif);
    }
    const {t}=useTranslation();
    const handleAddObjectif = () => {
        setSelectedObjectif(null);
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedMatiere === undefined) {
            navigate('subjects/subject-list')
        }
    }, [selectedMatiere]);
    const dispatch = useDispatch();
    useEffect(() => {

        const fetchObjectifs = async () => {
            dispatch(setObjectifLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyObjectifs: ObjectifReturnGetType = {
                    objectifs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if(selectedMatiere && selectedMatiere._id){
                    const fetchedObjectifs = await getObjectifByMatiereWithPagination({ matiereId: selectedMatiere._id, page: 1, annee: currentYear, semestre: currentSemestre, langue:lang });
                        
                    if (fetchedObjectifs) { // Vérifiez si fetchedObjectifs n'est pas faux, vide ou indéfini
                        dispatch(setObjectifs(fetchedObjectifs));
                    } else {
                        dispatch(setObjectifs(emptyObjectifs));
                    }
                }else {
                    dispatch(setObjectifs(emptyObjectifs));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageObjectif(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setObjectifLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchObjectifs();
    }, [dispatch, selectedMatiere, t]); // Déclencher l'effet lorsque currentPage change
    
    
    return (
        <>
            
            <Breadcrumb isObjectif={true} pageName={t('sub_menu.objectifs')}/>
            <Table data={objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} />

            <FormCreateUpdate objectif={selectedObjectif} matiere={selectedMatiere}/>
            <FormDelete objectif={selectedObjectif}  matiere={selectedMatiere}/>

        </>
    );
};

export default Objectifs;
