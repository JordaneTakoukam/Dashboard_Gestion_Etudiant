import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { setShowModalDetails } from '../../../_redux/features/setting';
import { formatDate } from '../../../fonctions/fonction';



function ModalDetailSupportDeCours({ supportDeCours }: { supportDeCours : SupportDeCoursType|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.details);
    const closeModal = () => { dispatch(setShowModalDetails()); };
    const lang = useSelector((state: RootState) => state.setting.language);


    return (
        <>
            <CustomDialogModal
                title={t('label.details')}
                isModalOpen={isModalOpen}
                isUnique={true}
                closeModal={closeModal}
                handleConfirm={closeModal}
            >
                <p>{`${t('label.date_ajout')} : ${supportDeCours?formatDate(supportDeCours.dateAjout):"/"}`}</p>
                <p>{`${t('label.titre')} : ${lang === 'fr'?supportDeCours?.titre_fr||"":supportDeCours?.titre_en||"/"}`}</p>
                <p>{`${t('label.type')} : ${supportDeCours?supportDeCours.type==0?t('label.enseignant'):t('label.etudiant'):"/"}`}</p>
                <p>{`${t('label.type_fichier')} : ${supportDeCours?supportDeCours.fichier.split('.').pop()?.toUpperCase():"/"}`}</p>
                <p>{`${t('label.taille_fichier')} : ${supportDeCours?supportDeCours.size+" Ko":"/"}`}</p>
                <p>{`${t('label.descrip')} : ${lang === 'fr'?supportDeCours?.description_fr||"/":supportDeCours?.description_en||"/"}`}</p> 
            </CustomDialogModal>
        </>
    );
}

export default ModalDetailSupportDeCours



