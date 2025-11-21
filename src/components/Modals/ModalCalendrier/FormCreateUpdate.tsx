import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateForInput, formatYear } from '../../../fonctions/fonction';
import { apiCreateEvenement, apiUpdateEvenement } from '../../../api/api_evenement';
import createToast from '../../../hooks/toastify';
import { createEvenement, updateEvenement } from '../../../_redux/features/evenement_slice';


function ModalCreateUpdate({ evenement }: { evenement : EvenementType | null }) {  
    const etats: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.etatsEvenement) ?? []; 
    const promotions: PromotionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.promotions) ?? []; 
    const lang = useSelector((state: RootState) => state.setting.language);
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const [annee, setAnnee] = useState(currentYear);
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [periodeFr, setPeriodeFr] = useState("");
    const [periodeEn, setPeriodeEn] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [etat, setEtat] = useState<CommonSettingProps>();
    const [promotion, setPromotion] = useState<PromotionProps>();
    const [personnelFr, setPersonnelFr] = useState("");
    const [personnelEn, setPersonnelEn] = useState("");
    const [descriptionObservationFr, setDescriptionObservationFr] = useState("");
    const [descriptionObservationEn, setDescriptionObservationEn] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorPeriodeFr, setErrorPeriodeFr] = useState("");
    const [errorPeriodeEn, setErrorPeriodeEn] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("");
    const [errorEtat, setErrorEtat] = useState("");
    const [errorPromotion, setErrorPromotion] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (evenement) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.evenement'));
            const currentEtat = etats.find(etat => etat._id === ""+evenement.etat);
            const currentPromotion = promotions.find(promotion => promotion._id === ""+evenement.promotion);
            setAnnee(evenement.annee);
            setCode(evenement.code);
            setLibelleFr(evenement.libelleFr);
            setLibelleEn(evenement.libelleEn);
            setPeriodeFr(evenement.periodeFr);
            setPeriodeEn(evenement.periodeEn);
            setDateDebut(formatDateForInput(evenement.dateDebut));
            setDateFin(formatDateForInput(evenement.dateFin));
            setEtat(currentEtat);
            setPromotion(currentPromotion);
            setPersonnelFr(evenement.personnelFr?evenement.personnelFr:"");
            setPersonnelEn(evenement.personnelEn?evenement.personnelEn:"");
            setDescriptionObservationFr(evenement.descriptionObservationFr?evenement.descriptionObservationFr:"");
            setDescriptionObservationEn(evenement.descriptionObservationEn?evenement.descriptionObservationEn:"");
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.evenement'));
            setAnnee(currentYear);
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setPeriodeFr("");
            setPeriodeEn("");
            setDateDebut("");
            setDateFin("");
            setEtat(undefined);
            setPromotion(undefined)
            setPersonnelFr("");
            setPersonnelEn("");
            setDescriptionObservationFr("");
            setDescriptionObservationEn("");
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorPeriodeFr("");
            setErrorPeriodeEn("");
            setErrorDateDebut("");
            setErrorDateFin("");
            setErrorEtat("");
            setErrorPromotion("");
            setIsFirstRender(false);
        }
    }, [evenement, isFirstRender, t]);

    const closeModal = () => { 
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorPeriodeFr("");
        setErrorPeriodeEn("");
        setErrorDateDebut("");
        setErrorDateFin("");
        setErrorEtat("");
        setErrorPromotion("");
        setIsFirstRender(true);

        // setLibelleFr("");
        // setLibelleEn("");
        // let subCode = code.substring(2);
        // if(parseInt(subCode)<9){
        //     subCode = "EV00"+(parseInt(subCode)+1);
        // }else{
        //     subCode = "EV0"+(parseInt(subCode)+1);
        // }
        // setCode(subCode);
        // setPeriodeFr("");
        // setPeriodeEn("")
        // setDateDebut("");
        // setDateFin("");
        dispatch(setShowModal()); 
    };

    const handleEtatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEtatLibelle = e.target.value;
        var selectedEtat = null;

        if (lang === 'fr') {
            selectedEtat = etats.find(etat => etat.libelleFr === selectedEtatLibelle);

        }
        else {
            selectedEtat = etats.find(etat => etat.libelleEn === selectedEtatLibelle);

        }


        if (selectedEtat) {
            setEtat(selectedEtat);
            setErrorEtat("");
        }
    };

    const handlePromotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPromotionLibelle = e.target.value;
        var selectedPromotion = null;

        if (lang === 'fr') {
            selectedPromotion = promotions.find(promotion => promotion.libelleFr === selectedPromotionLibelle);

        }
        else {
            selectedPromotion = promotions.find(promotion => promotion.libelleEn === selectedPromotionLibelle);

        }


        if (selectedPromotion) {
            setPromotion(selectedPromotion);
            setErrorPromotion("");
        }
    };
    
    
    

    const handleCreateUpdate = async () => {
        if (!code || !libelleFr || !periodeFr || !periodeEn || !dateDebut || !dateFin || !etat || !promotion) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelleFr) {
                setErrorLibelleFr(t('error.phase_activite_fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.phase_activite_en'));
            }
            if (!periodeFr) {
                setErrorPeriodeFr(t('error.periode_fr'));
            }
            if (!periodeEn) {
                setErrorPeriodeEn(t('error.periode_en'));
            }
            if (!dateDebut) {
                setErrorDateDebut(t('error.date_debut'));
            }
            if (!dateFin) {
                setErrorDateFin(t('error.date_fin'));
            }
            if (!etat) {
                setErrorEtat(t('error.etat'));
            }

            if (!promotion) {
                setErrorPromotion(t('error.promotion'));
            }

            return;
        }
        if(!evenement){
            setIsLoading(true);
            if (etat._id && promotion._id) {
                await apiCreateEvenement(
                    {
                        code, 
                        libelleFr, 
                        libelleEn, 
                        dateDebut, 
                        dateFin, 
                        periodeFr, 
                        periodeEn, 
                        etat : etat._id, 
                        promotion:promotion._id,
                        personnelFr, 
                        personnelEn, 
                        descriptionObservationFr, 
                        descriptionObservationEn, 
                        annee
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createEvenement({
                            
                            evenement: {
                                _id: e.data._id,
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                periodeFr: e.data.periodeFr,
                                periodeEn: e.data.periodeEn,
                                etat: e.data.etat,
                                promotion:e.data.promotion,
                                personnelFr: e.data.personnelFr,
                                personnelEn: e.data.personnelEn,
                                descriptionObservationFr: e.data.descriptionObservationFr,
                                descriptionObservationEn: e.data.descriptionObservationEn,
                                annee: e.data.annee
                            }
                            
                        }));

                        closeModal();

                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false)
                })
            }
        }else{
            if (etat._id && promotion._id) {
                setIsLoading(true);
                await apiUpdateEvenement(
                    {
                        code, 
                        libelleFr, 
                        libelleEn, 
                        dateDebut, 
                        dateFin, 
                        periodeFr, 
                        periodeEn, 
                        etat : etat._id, 
                        promotion:promotion._id,
                        personnelFr, 
                        personnelEn, 
                        descriptionObservationFr, 
                        descriptionObservationEn, 
                        annee,
                        _id:evenement._id
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(
                            updateEvenement({
                                id: e.data._id,
                                evenementData: {
                                    _id: e.data._id,
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    dateDebut: e.data.dateDebut,
                                    dateFin: e.data.dateFin,
                                    periodeFr: e.data.periodeFr,
                                    periodeEn: e.data.periodeEn,
                                    etat: e.data.etat,
                                    promotion:e.data.promotion,
                                    personnelFr: e.data.personnelFr,
                                    personnelEn: e.data.personnelEn,
                                    descriptionObservationFr: e.data.descriptionObservationFr,
                                    descriptionObservationEn: e.data.descriptionObservationEn,
                                    annee: e.data.annee
                                }
                            }));
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false)
                })
            }
        }
        
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
            >
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(annee)}
                    onChange={(e) => {setAnnee(parseInt(e.target.value)); setErrorCode("")}}
                />
                <label>{t('label.promotion')}</label><label className="text-red-500"> *</label>
                <select
                    value={promotion ? (lang === 'fr' ? promotion.libelleFr : promotion.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.promotion')}
                    onChange={handlePromotionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.promotion')}</option>
                    {promotions.map(promotion => (
                        <option key={promotion._id} value={lang === 'fr' ? promotion.libelleFr : promotion.libelleEn}>{lang === 'fr' ? promotion.libelleFr : promotion.libelleEn}</option>
                    ))}
                </select>
                {errorPromotion && <p className="text-red-500" >{errorPromotion}</p>}
                <label>{t('label.code')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {/* {errorCode && <p className="text-red-500" >{errorCode}</p>} */}
                <label>{t('label.phase_activite_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) =>{setLibelleFr(e.target.value); setErrorLibelleFr("");} }
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.phase_activite_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) =>{setLibelleEn(e.target.value); setErrorLibelleEn("");} }
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
                <label>{t('label.periode_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={periodeFr}
                    onChange={(e) =>{setPeriodeFr(e.target.value); setErrorPeriodeFr("");} }
                />
                {errorPeriodeFr && <p className="text-red-500">{errorPeriodeFr}</p>}
                <label>{t('label.periode_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={periodeEn}
                    onChange={(e) =>{setPeriodeEn(e.target.value); setErrorPeriodeEn("");} }
                />
                {errorPeriodeEn && <p className="text-red-500">{errorPeriodeEn}</p>}
                <label>{t('label.date_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) =>{setDateDebut(e.target.value); setErrorDateDebut("");} }
                />
                {errorDateDebut && <p className="text-red-500">{errorDateDebut}</p>}
                <label>{t('label.date_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateFin}
                    onChange={(e) =>{setDateFin(e.target.value); setErrorDateFin("");} }
                />
                {errorDateFin && <p className="text-red-500">{errorDateFin}</p>}
                <label>{t('label.etat')}</label><label className="text-red-500"> *</label>
                <select
                    value={etat ? (lang === 'fr' ? etat.libelleFr : etat.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.etat')}
                    onChange={handleEtatChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.etat')}</option>
                    {etats.map(etat => (
                        <option key={etat._id} value={lang === 'fr' ? etat.libelleFr : etat.libelleEn}>{lang === 'fr' ? etat.libelleFr : etat.libelleEn}</option>
                    ))}
                </select>
                {errorEtat && <p className="text-red-500">{errorEtat}</p>}
                <label>{t('label.personnel_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={personnelFr}
                    onChange={(e) =>{setPersonnelFr(e.target.value)} }
                />
                <label>{t('label.personnel_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={personnelEn}
                    onChange={(e) =>{setPersonnelEn(e.target.value)} }
                />
                <label>{t('label.description_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionObservationFr}
                    onChange={(e) =>{setDescriptionObservationFr(e.target.value)} }
                />
                <label>{t('label.description_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionObservationEn}
                    onChange={(e) =>{setDescriptionObservationEn(e.target.value)} }
                />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
