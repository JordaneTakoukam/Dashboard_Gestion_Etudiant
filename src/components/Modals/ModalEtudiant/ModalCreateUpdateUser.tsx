import { useEffect, useState } from "react";
import CustomDialogModal from "../CustomDialogModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { setShowModal } from "../../../_redux/features/setting";
import { useTranslation } from "react-i18next";

interface ModalCreateUpdateUserProps {
    user: UserState | AdminType | null,
    type: string;
}


export function ModalCreateUpdateUser({ user, type }: ModalCreateUpdateUserProps) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const closeModal = () => {
        // setErrorNom("");
        // setErrorGenre("");
        // setErrorEmail("");
        // setErrorSection("");
        // setErrorCycle("");
        // setErrorNiveau("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleSubmit = () => {
        // 
        //
        //
        closeModal();
    }

    useEffect(() => {
        // UPDATE
        if (user) {
            if (type === 'administrateur') {
                setModalTitle(t('form_update.enregistrer') + t('form_update.administrateur'));
            }
            else if (type === 'enseignant') {
                setModalTitle(t('form_update.enregistrer') + t('form_update.enseignant'));
            }
            else if (type === 'etudiant') {
                setModalTitle(t('form_update.enregistrer') + t('form_update.etudiant'));
            }
        }
        // CREATE
        else {
            if (type === 'administrateur') {
                setModalTitle(t('form_save.enregistrer') + t('form_save.administrateur'));
            }
            else if (type === 'enseignant') {
                setModalTitle(t('form_save.enregistrer') + t('form_save.enseignant'));
            }
            else if (type === 'etudiant') {
                setModalTitle(t('form_save.enregistrer') + t('form_save.etudiant'));
            }
        }

        if (isFirstRender) {

            setIsFirstRender(false);
        }
    }, [user, isFirstRender, t]);


    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleSubmit}
            >
                <p>{type}</p>
            </CustomDialogModal>
        </>
    );

}