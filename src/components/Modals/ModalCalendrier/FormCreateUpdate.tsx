import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EvenementProps from '../../../_types/evenement_type';


function ModalCreateUpdate({ evenement }: { evenement : EvenementProps | null }) {  
    const etats: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.etatEvenement) ?? []; 
    const lang = useSelector((state: RootState) => state.setting.language);
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [annee, setAnnee] = useState("");
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [periodeFr, setPeriodeFr] = useState("");
    const [periodeEn, setPeriodeEn] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [etat, setEtat] = useState<CommonSettingProps>();
    const [personnelFr, setPersonnelFr] = useState("");
    const [personnelEn, setPersonnelEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorPeriodeFr, setErrorPeriodeFr] = useState("");
    const [errorPeriodeEn, setErrorPeriodeEn] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("");
    const [errorEtat, setErrorEtat] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (evenement) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.evenement'));
            const currentEtat = etats.find(etat => etat._id === ""+evenement.etat);
            setAnnee(evenement.annee);
            setCode(evenement.code);
            setLibelleFr(evenement.libelleFr);
            setLibelleFr(evenement.libelleEn);
            setPeriodeFr(evenement.periodeFr);
            setPeriodeEn(evenement.periodeEn);
            setDateDebut(evenement.dateDebut);
            setDateFin(evenement.dateFin);
            setEtat(currentEtat);
            setPersonnelFr(evenement.personnelFr?evenement.personnelFr:"");
            setPersonnelEn(evenement.personnelEn?evenement.personnelEn:"");
            setDescriptionFr(evenement.descriptionObservationFr?evenement.descriptionObservationFr:"");
            setDescriptionEn(evenement.descriptionObservationEn?evenement.descriptionObservationEn:"");
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.evenement'));
            setAnnee("");
            setCode("");
            setLibelleFr("");
            setLibelleFr("");
            setPeriodeFr("");
            setPeriodeEn("");
            setDateDebut("");
            setDateFin("");
            setEtat(undefined);
            setPersonnelFr("");
            setPersonnelEn("");
            setDescriptionFr("");
            setDescriptionEn("");
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
    
    
    

    const handleCreateUpdate = () => {
        if (!code || !libelleFr || !periodeFr || !periodeEn || !dateDebut || !dateFin || !etat) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelleFr) {
                setErrorLibelleFr(t('error.libelle_fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.libelle_en'));
            }
            if (!periodeFr) {
                setErrorPeriodeFr(t('error.periode_fr'));
            }
            if (!periodeEn) {
                setErrorPeriodeEn(t('error.periode_en'));
            }
            if (!dateDebut) {
                setErrorDateDebut(t('error.dateDebut'));
            }
            if (!dateFin) {
                setErrorDateFin(t('error.dateFin'));
            }
            if (!etat) {
                setErrorEtat(t('error.etat'));
            }

            return;
        }
        
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={annee}
                    onChange={(e) => {setAnnee(e.target.value); setErrorCode("")}}
                />
                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) =>{setLibelleFr(e.target.value); setErrorLibelleFr("");} }
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
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
                <label>{t('label.dateDebut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) =>{setDateDebut(e.target.value); setErrorDateDebut("");} }
                />
                {errorDateDebut && <p className="text-red-500">{errorDateDebut}</p>}
                <label>{t('label.dateFin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
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
                    value={descriptionFr}
                    onChange={(e) =>{setDescriptionFr(e.target.value)} }
                />
                <label>{t('label.description_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionEn}
                    onChange={(e) =>{setDescriptionEn(e.target.value)} }
                />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
