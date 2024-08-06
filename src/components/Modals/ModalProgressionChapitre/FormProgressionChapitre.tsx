import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../_redux/store';
import { setShowModal } from '../../../_redux/features/setting';
import { apiUpdateEtatChapitre } from '../../../api/api_chapitre';
import { updateChapitre } from '../../../_redux/features/chapitre_slice';
import createToast from '../../../hooks/toastify';
import { config } from '../../../config';

interface ModalProgressionChapitreProps {
    chapitre: ChapitreType | null;
}

function ModalProgressionChapitre({ chapitre }: ModalProgressionChapitreProps) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const closeModal = () => { dispatch(setShowModal()); setIsFirstRender(true);};
    const { t } = useTranslation();
    const userRole = useSelector((state: RootState) => state.user.role);

    const [selectedObjectifs, setSelectedObjectifs] = useState<{ [key: string]: boolean }>({});
    const [showNoObjectifsMessage, setShowNoObjectifsMessage] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        console.log(chapitre)
        if (chapitre?.objectifs) {
            const initialSelectedObjectifs = chapitre.objectifs.reduce((acc, objectif) => {
                if (objectif._id) {
                    acc[objectif._id] = objectif.etat === 1;
                }
                return acc;
            }, {} as { [key: string]: boolean });

            setSelectedObjectifs(initialSelectedObjectifs);

            // Afficher un message si le chapitre n'a pas d'objectifs
            setShowNoObjectifsMessage(chapitre.objectifs.length === 0);
        }
        if (isFirstRender) {
            setIsFirstRender(false);
            setSelectedObjectifs({});
            setShowNoObjectifsMessage(false);
        }
    }, [chapitre, isFirstRender, t]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(userRole!==config.roles.etudiant && userRole!==config.roles.etudiant){
            const isChecked = e.target.checked;
            const updatedSelection = chapitre?.objectifs?.reduce((acc, objectif) => {
                if (objectif._id) {
                    acc[objectif._id] = isChecked;
                }
                return acc;
            }, {} as { [key: string]: boolean }) || {};
            setSelectedObjectifs(updatedSelection);
        }
    };

    const handleObjectifChange = (id: string) => {
        if(userRole!==config.roles.etudiant && userRole!==config.roles.etudiant){
            setSelectedObjectifs(prevState => ({
                ...prevState,
                [id]: !prevState[id]
            }));
        }
    };

    const handleUpdate = async () => {
        if(userRole!==config.roles.etudiant && userRole!==config.roles.etudiant){
            if (chapitre?._id) {
                const updatedObjectifs = chapitre.objectifs?.map(objectif => ({
                    _id: objectif._id || '',
                    etat: selectedObjectifs[objectif._id || ''] ? 1 : 0
                })) || [];
        
                const newChapitreState = chapitre.objectifs?.length ? undefined : (Object.values(selectedObjectifs).every(val => val) ? chapitre.etat===1?0 : 1:0);
        
                try {
                    const response = await apiUpdateEtatChapitre({ chapitreId: chapitre._id, objectifs: updatedObjectifs, etat: newChapitreState });
                    if (response.success) {
                        dispatch(updateChapitre({
                            id: response.data._id,
                            chapitreData: {
                                _id: response.data._id,
                                annee: response.data.annee,
                                semestre: response.data.semestre,
                                code: response.data.code,
                                libelleFr: response.data.libelleFr,
                                libelleEn: response.data.libelleEn,
                                matiere: chapitre.matiere,
                                statut: response.data.statut,
                                etat: response.data.etat,
                                typesEnseignement: response.data.typesEnseignement,
                                objectifs:response.data.objectifs
                            }
                        }));
                        createToast(response.message[lang as keyof typeof response.message], '', 0);
                    } else {
                        createToast(response.message[lang as keyof typeof response.message], '', 2);
                    }
                    closeModal();
                } catch (error) {
                    createToast(t('label.error_update'), '', 2);
                    closeModal();
                }
            }
        }else{
            closeModal();
        }
    };

    return (
        <>
            <CustomDialogModal
                title={(userRole!==config.roles.etudiant && userRole!==config.roles.etudiant)?t('form_update.progression_chap'):t('label.progression_chap')}
                isModalOpen={isModalOpen}
                isUnique={(userRole===config.roles.etudiant || userRole===config.roles.etudiant)}
                isDelete={(userRole!==config.roles.etudiant && userRole!==config.roles.etudiant)}
                closeModal={closeModal}
                handleConfirm={handleUpdate}
            >
                {showNoObjectifsMessage ? (
                    <p>{t('label.info_objectifs')}</p>
                ) : (
                    <div className="space-y-4">
                        {(userRole!==config.roles.etudiant && userRole!==config.roles.etudiant) && <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="selectAll"
                                onChange={handleSelectAll}
                                checked={Object.values(selectedObjectifs).length > 0 && Object.values(selectedObjectifs).every(val => val)}
                                className="mr-2"
                            />
                            <label htmlFor="selectAll">{t('label.select_all')}</label>
                        </div>}
                        {chapitre?.objectifs && chapitre.objectifs.map(objectif => (
                            <div key={objectif._id || ''} className="flex items-center mb-2">
                                <input
                                    className={`${(userRole===config.roles.etudiant || userRole===config.roles.delegue) ? 'mr-2' : 'cursor-pointer mr-2' }`}
                                    type="checkbox"
                                    id={objectif._id || ''}
                                    checked={objectif._id ? selectedObjectifs[objectif._id] : false}
                                    onChange={() => objectif._id && handleObjectifChange(objectif._id)}
                                />
                                <label htmlFor={objectif._id || ''}>
                                    {lang === 'fr' ? objectif.libelleFr : objectif.libelleEn}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </CustomDialogModal>
        </>
    );
}

export default ModalProgressionChapitre;
