import { useDispatch, useSelector } from 'react-redux';
import { setShowModalPresenceManuelle } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Jour, jours } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { formatYear } from '../../../fonctions/fonction';
import { apiPresence } from '../../../api/api_presence_paie';



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
            
            await apiPresence({jour:periodeCours.jour, semestre:periodeCours.semestre, annee:periodeCours.annee, niveau:periodeCours.niveau, 
                matiere:periodeCours.matiere, utilisateur:currentUser, heureDebut:periodeCours.heureDebut, heureFin:periodeCours.heureFin}).then((e: ReponseApiPros) => {
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
