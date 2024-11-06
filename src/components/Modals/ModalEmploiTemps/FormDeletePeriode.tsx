import { useDispatch, useSelector } from 'react-redux';
import { setPeriodeIndex, setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { jours } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { formatYear } from '../../../fonctions/fonction';
import { deletePeriode, updatePeriode } from '../../../_redux/features/periode_slice';
import { apiDeletePeriode } from '../../../api/api_periode';


function ModalCreateUpdateAbsence({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();



    const lang = useSelector((state: RootState) => state.setting.language);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [isFirstRender, setIsFirstRender] = useState(true);
    const index = useSelector((state: RootState) => state.setting.periodeIndex); // index courant à modifier
    const [matiere, setMatiere]=useState<MatiereType>();
    
    useEffect(() => {        
            if (periodeCours) {
                if(periodeCours.pause){
                    setModalTitle(t('form_delete.suppression')+t('form_delete.pause'));
                }else{
                    setModalTitle(t('form_delete.suppression')+t('form_delete.periode'));
                    index!=-1 && periodeCours.enseignements && setMatiere(periodeCours.enseignements[index].matiere);
                }
            } else {
                setModalTitle("");
            }
        
    }, [periodeCours, index, t]);

    const closeModal = () => {
        setIsFirstRender(true);
        dispatch(setShowModalDelete());
    };



    const handleDelete = async () => {
        if (periodeCours?._id != undefined) {
            await apiDeletePeriode({periodeId:periodeCours._id, matiereIndex:index}).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (periodeCours._id) {
                        if((periodeCours.enseignements && periodeCours.enseignements.length==1) || periodeCours.pause){
                            dispatch(deletePeriode({ id: periodeCours._id }));
                        }else{
                           
                            dispatch(updatePeriode({
                                id: e.data._id,
                                periodeData: {
                                    _id: e.data._id,
                                    jour: e.data.jour,
                                    annee: e.data.annee,
                                    semestre: e.data.semestre,
                                    niveau: e.data.niveau,
                                    enseignements: e.data.enseignements,
                                    heureDebut: e.data.heureDebut,
                                    heureFin: e.data.heureFin,
                                    pause: e.data.pause,
                                }
                            }));
                        }
                        dispatch(setPeriodeIndex(-1));
                    }

                    closeModal();
                    // setIsDeleting(false); // Réinitialiser le toggle à false après la suppression
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

            })
        }

    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >

                <div>
                    <p className=' pb-3'>{t('label.annee')} : {periodeCours?formatYear(periodeCours.annee):""}</p>
                    <p className=' pb-3'>{t('label.semestre')} : {periodeCours?.semestre??""}</p>
                    <p className=' pb-3'>{t('label.jour')} : {periodeCours?lang==='fr'?jours.find(jour=>jour.ordre==periodeCours.jour)?.libelleFr:jours.find(jour=>jour.ordre==periodeCours.jour)?.libelleEn:""}</p>
                    {!periodeCours?.pause && <p className='pb-3'>{t('label.matiere')} : {matiere?lang==='fr' ?matiere.libelleFr??"":matiere.libelleEn??"":""}</p>}

                    <p className=' pb-3'>{t('label.heure_debut')} : {periodeCours?.heureDebut??""}</p>

                    <p className=' pb-3'>{t('label.heure_fin')} : {periodeCours?.heureFin??""}</p>                    
                </div>
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdateAbsence;
