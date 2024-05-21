import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalSignalerAbsence, } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Jour, jours, semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { FaTrash } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from '../../../_redux/features/matiere_slice';
import { getMatieresByNiveau } from '../../../api/api_matiere';
import createToast from '../../../hooks/toastify';
import { createPeriode, deletePeriode, updatePeriode } from '../../../_redux/features/periode_slice';
import { formatYear } from '../../../fonctions/fonction';
import { apiCreatePeriode, apiDeletePeriode, apiUpdatePeriode } from '../../../api/api_periode';
import { apiSignalerAbsence } from '../../../api/discipline/api_discipline';



function ModalCreateUpdate({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openSignalerAbsence);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const currentUser: UserState = useSelector((state: RootState) => state.user);

    useEffect(() => {

        if (periodeCours) {
            setModalTitle(t('form_update.signaler'));
            
            setJour(jours.find((jour) => periodeCours.jour == jour.ordre));
            setHeureDebut(periodeCours.heureDebut);
            setHeureFin(periodeCours.heureFin);
            setSemestre(periodeCours.semestre);
            setAnnee(periodeCours.annee);
        } else {
        }



        if (isFirstRender) {
            setIsDeleting(false);
            setIsFirstRender(false);
        }
    }, [periodeCours, isFirstRender, t]);


    const closeModal = () => {
        setIsFirstRender(true);
        dispatch(setShowModalSignalerAbsence());
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
    };

    




    const [isDeleting, setIsDeleting] = useState(false);


    const handleCreatePeriodeCours = async () => {
        // if (!jour || !heureDebut || !heureFin || !semestre) {
        //     if (!jour) {
        //         // setErrorJour(t('error.jour'));
        //     }
        //     if (!heureDebut) {
        //         // setErrorHeureDebut(t('error.heure_debut'));
        //     }
        //     if (!heureFin) {
        //         // setErrorHeureFin(t('error.heure_fin'));
        //     }
                
        //     if (!enseignant) {
        //         // setErrorEnseignant(t('error.enseignant'));
        //     }
        //     if (!cycle) {
        //         setErrorCycle(t('error.cycle'));
        //     }
        //     if (!niveau) {
        //         setErrorNiveau(t('error.niveau'));
        //     }

        //     if (!matiere) {
        //         setErrorMatiere(t('error.matiere'));
        //     }

        //     if (!semestre) {
        //         setErrorSemestre(t('error.semestre'));
        //     }

        //     if (!typeEnseignement) {
        //         setErrorTypeEnseignement(t('error.type_ens_periode'));
        //     }

        //     if (!salleCours) {
        //         setErrorSalle(t('error.salle'));
        //     }

        //     return;
        // }
        
        
        if (periodeCours) {
            await apiSignalerAbsence(
                {
                    user:currentUser,
                    enseignant:periodeCours.enseignantPrincipal,
                    role:currentUser.role,
                    heure_debut_absence:periodeCours.heureDebut,
                    heure_fin_absence:periodeCours.heureFin,
                    jour_absence:periodeCours.jour,
                    semestre,
                    annee,
                    niveau:periodeCours.niveau
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        }
            
        
        
    }
    

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreatePeriodeCours}
            >
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(annee)}
                    readOnly
                    onChange={(e) => { setAnnee(parseInt(e.target.value)); }}
                />
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={semestre}
                    readOnly
                    onChange={(e) => { setSemestre(parseInt(e.target.value)); }}
                />
               
                {/* {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>} */}
                <label>{t('label.jour')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    readOnly
                    value={lang === 'fr' ? jour?.libelleFr??"" : jour?.libelleEn??""}
                    onChange={(e) => { setHeureDebut(e.target.value) }}
                />
                
                <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    readOnly
                    value={heureDebut}
                    onChange={(e) => { setHeureDebut(e.target.value) }}
                />
                {/* {errorHeureDebut && <p className="text-red-500" >{errorHeureDebut}</p>} */}
                <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    readOnly
                    value={heureFin}
                    onChange={(e) => { setHeureFin(e.target.value); }}
                />
                {/* {errorHeureFin && <p className="text-red-500" >{errorHeureFin}</p>} */}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
