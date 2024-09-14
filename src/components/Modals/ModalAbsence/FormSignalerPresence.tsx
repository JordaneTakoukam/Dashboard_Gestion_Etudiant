import { useDispatch, useSelector } from 'react-redux';
import { setShowModalPresenceManuelle } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Jour, jours } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { formatYear } from '../../../fonctions/fonction';
import { apiSignalerAbsence } from '../../../api/discipline/api_discipline';
import { config } from '../../../config';



function ModalSignalerPresence({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [semestre, setSemestre] = useState(currentSemester);
    const [matiere, setMatiere] = useState("");
    const [annee, setAnnee] = useState(currentYear);

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openPresenceM);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const currentUser: UserState = useSelector((state: RootState) => state.user);

    useEffect(() => {

        if (periodeCours) {
            setModalTitle(t('form_update.signaler_presence'));
            
            setJour(jours.find((jour) => periodeCours.jour == jour.ordre));
            setHeureDebut(periodeCours.heureDebut);
            setHeureFin(periodeCours.heureFin);
            setSemestre(periodeCours.semestre);
            setAnnee(periodeCours.annee);
            const libelle =  lang === 'fr'?periodeCours.matiere?.libelleFr || "":periodeCours.matiere?.libelleEn || ""
            setMatiere(libelle)
        } else {
        }



        if (isFirstRender) {
            setIsDeleting(false);
            setIsFirstRender(false);
        }
    }, [periodeCours, isFirstRender, t]);


    const closeModal = () => {
        setIsFirstRender(true);
        dispatch(setShowModalPresenceManuelle());
    };

   
    const [isDeleting, setIsDeleting] = useState(false);


    const handleCreatePeriodeCours = async () => {
        
        if (periodeCours) {
            let enseignant: UserState | EnseignantType | undefined;
            if(currentUser.role!==config.roles.enseignant){
                enseignant = periodeCours.enseignantPrincipal;
            }
            
            const formData = new FormData();
            // formData.append('type', config.typeNotifications.absence);
            formData.append('user', JSON.stringify(currentUser)); // Assume `currentUser` is an object
            if(enseignant){
                formData.append('enseignant', JSON.stringify(enseignant));
            }
            formData.append('role', currentUser.role);
            formData.append('heure_debut_absence', periodeCours.heureDebut);
            formData.append('heure_fin_absence', periodeCours.heureFin);
            formData.append('jour_absence', periodeCours.jour.toString());
            formData.append('semestre', semestre.toString());
            formData.append('annee', annee.toString());
            formData.append('niveau', periodeCours.niveau);
            

           
            await apiSignalerAbsence(formData).then((e: ReponseApiPros) => {
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
                
                <label>{t('label.matiere')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={matiere}
                    readOnly
                    onChange={(e) => { setMatiere(e.target.value); }}
                />
                
            </CustomDialogModal>

        </>
    );
}

export default ModalSignalerPresence;
