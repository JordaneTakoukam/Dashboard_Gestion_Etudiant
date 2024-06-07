import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { jours, semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import { apiCreateAbsence, apiDeleteAbsence, apiJustifierAbsence } from '../../../api/discipline/api_discipline';
import createToast from '../../../hooks/toastify';
import { ajouterAbsenceEnseignant, modifierAbsenceEnseignant, retirerAbsenceEnseignant } from '../../../_redux/features/absence/discipline_enseignant_slice';
import { formatYear, nbTotalAbsences } from '../../../fonctions/fonction';
import { ajouterAbsenceEtudiant, modifierAbsenceEtudiant, retirerAbsenceEtudiant } from '../../../_redux/features/absence/discipline_etudiant_slice';
import { deletePeriode } from '../../../_redux/features/periode_slice';
import { apiDeletePeriode } from '../../../api/api_periode';


function ModalCreateUpdateAbsence({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();



    const lang = useSelector((state: RootState) => state.setting.language);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [isFirstRender, setIsFirstRender] = useState(true);
    
    useEffect(() => {        
            if (periodeCours) {
                if(periodeCours.pause){
                    setModalTitle(t('form_delete.suppression')+t('form_delete.pause'));
                }else{
                    setModalTitle(t('form_delete.suppression')+t('form_delete.periode'));
                }
            } else {
                setModalTitle("");
            }
        
    }, [periodeCours, t]);

    const closeModal = () => {
        setIsFirstRender(true);
        dispatch(setShowModalDelete());
    };



    const handleDelete = async () => {
        if (periodeCours?._id != undefined) {
            await apiDeletePeriode(periodeCours._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (periodeCours._id) {
                        dispatch(deletePeriode({ id: periodeCours._id }));
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
                    {!periodeCours?.pause && <p className='pb-3'>{t('label.matiere')} : {(periodeCours&&periodeCours.matiere)?lang==='fr' ?periodeCours.matiere.libelleFr??"":periodeCours.matiere.libelleEn??"":""}</p>}

                    <p className=' pb-3'>{t('label.heure_debut')} : {periodeCours?.heureDebut??""}</p>

                    <p className=' pb-3'>{t('label.heure_fin')} : {periodeCours?.heureFin??""}</p>                    
                </div>
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdateAbsence;
