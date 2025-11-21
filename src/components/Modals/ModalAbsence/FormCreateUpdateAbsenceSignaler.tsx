import { useDispatch, useSelector } from 'react-redux';
import { setPeriodeIndex, setShowModalSignalerAbsence, } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Jour, jours } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { formatYear } from '../../../fonctions/fonction';
import { apiSignalerAbsence } from '../../../api/discipline/api_discipline';
import { config } from '../../../config';



function ModalCreateUpdate({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const index = useSelector((state: RootState) => state.setting.periodeIndex); // index courant à modifier
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);
    const [motif, setMotif] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
            setMotif("");
            setFiles([]);
        } else {
        }



        if (isFirstRender) {
            setIsDeleting(false);
            dispatch(setPeriodeIndex(-1));
            setIsFirstRender(false);
        }
    }, [periodeCours, isFirstRender, t]);


    const closeModal = () => {
        setIsFirstRender(true);
        dispatch(setShowModalSignalerAbsence());
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFiles(Array.from(event.target.files));
        }
    };

    const [isDeleting, setIsDeleting] = useState(false);


    const handleCreatePeriodeCours = async () => {
        
        if (periodeCours) {
            setIsLoading(true)
            let enseignant: UserState | EnseignantType | undefined;
            if(currentUser.role!==config.roles.enseignant){
                const enseignantPrincipal = index!=-1 && periodeCours.enseignements ?periodeCours.enseignements[index].enseignantPrincipal:undefined
                enseignant = enseignantPrincipal;
            }
            
            const formData = new FormData();
            // formData.append('type', config.typeNotifications.absence);
            formData.append('user', JSON.stringify(currentUser)); // Assume `currentUser` is an object
            if(enseignant){
                formData.append('enseignant', JSON.stringify(enseignant));
            }
            formData.append('motif', motif);
            formData.append('role', currentUser.role);
            formData.append('heure_debut_absence', periodeCours.heureDebut);
            formData.append('heure_fin_absence', periodeCours.heureFin);
            formData.append('jour_absence', periodeCours.jour.toString());
            formData.append('semestre', semestre.toString());
            formData.append('annee', annee.toString());
            formData.append('niveau', periodeCours.niveau);
            

            files.forEach((file, index) => {
                formData.append(`files`, file);
            });
            await apiSignalerAbsence(formData).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false);
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
                isLoading={isLoading}
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
                <label>{t('label.motif')}</label>
                <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={motif}
                    maxLength={100} // Limite à 100 caractères
                    onChange={(e) => { setMotif(e.target.value); }}
                />
                <label>{t('label.pieces_jointes')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
                {/* {errorHeureFin && <p className="text-red-500" >{errorHeureFin}</p>} */}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
