import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsersWithRole } from '../../../api/api_user';
import { formatYear } from '../../../fonctions/fonction';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { apiCreatePeriodeEnseignement, apiUpdatePeriodeEnseignement } from '../../../api/api_periode_enseignement';
import createToast from '../../../hooks/toastify';
import { createPeriodeEnseignement, updatePeriodeEnseignement } from '../../../_redux/features/periode_enseignement_slice';


function ModalCreateUpdate({ periodeEnseignement }: { periodeEnseignement: PeriodeEnseignementType | null }) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en;
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);
    const [periodeFr, setPeriodeFr] = useState("");
    const [periodeEn, setPeriodeEn] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [section, setSection] = useState<CommonSettingProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();

    const [enseignements, setEnseignements] = useState<EnseignementType[]>([{ typeEnseignement: '', enseignantPrincipal: undefined, enseignantSuppleant: undefined }]);

    const [errorCode, setErrorCode] = useState("");
    const [errorPeriodeFr, setErrorPeriodeFr] = useState("");
    const [errorPeriodeEn, setErrorPeriodeEn] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);



    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les cycles en fonction de l'ID de la section
            const result: CycleProps[] = cycles.filter(cycle => "" + cycle.section === sectionId);

            setFilteredCycle(result);
            
        }
    };

    // filtrer les donnee a partir de l'id du cycle selectionner
    const filterNiveauByCycle = (cycleId: string | undefined) => {
        if (cycleId && cycleId !== '') {
            // Filtrer les cycles en fonction de l'ID de la cycle
            const result: NiveauProps[] = niveaux.filter(niveau => "" + niveau.cycle === cycleId);

            setFilteredNiveau(result);
        }
    };

   
    useEffect(() => {
        
        if (periodeEnseignement) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.periode_enseignement'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + periodeEnseignement.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentNiveau._id);
            setAnnee(periodeEnseignement.annee);
            setSemestre(periodeEnseignement.semestre);
            setPeriodeFr(periodeEnseignement.periodeFr);
            setPeriodeEn(periodeEnseignement.periodeEn);
            setDateDebut(periodeEnseignement.dateDebut ? periodeEnseignement.dateDebut : "");
            setDateFin(periodeEnseignement.dateFin ? periodeEnseignement.dateFin : "");
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.periode_enseignement'));
            setPeriodeFr("");
            setPeriodeEn("");
            setDateDebut("");
            setDateFin("");
            setAnnee(currentYear);
            setSemestre(currentSemester);
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorPeriodeFr("");
            setErrorPeriodeEn("");
            setErrorDateDebut("");
            setErrorDateFin("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setErrorSemestre("");
            setIsFirstRender(false);
        }
    }, [periodeEnseignement, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorPeriodeFr("");
        setErrorPeriodeEn("");
        setErrorDateDebut("");
        setErrorDateFin("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorSemestre("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        var selectedSection = null;

        if (lang === 'fr') {
            selectedSection = sections.find(section => section.libelleFr === selectedSectionLibelle);

        }
        else {
            selectedSection = sections.find(section => section.libelleEn === selectedSectionLibelle);

        }


        if (selectedSection) {
            setSection(selectedSection);
            filterCycleBySection(selectedSection._id);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        var selectedCycle = null;

        if (lang === 'fr') {
            selectedCycle = cycles.find(cycle => cycle.libelleFr === selectedCycleLibelle);

        }
        else {
            selectedCycle = cycles.find(cycle => cycle.libelleEn === selectedCycleLibelle);

        }


        if (selectedCycle) {
            setCycle(selectedCycle);
            filterNiveauByCycle(selectedCycle._id);
            setErrorCycle("");
        }
    };
    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        var selectedNiveau = null;

        if (lang === 'fr') {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleFr === selectedNiveauLibelle);

        }
        else {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleEn === selectedNiveauLibelle);

        }


        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };
    

    const handleCreateUpdate = async () => {
        console.log(enseignements);
        if (!periodeFr || !periodeEn || !dateDebut || !dateFin || !section || !cycle || !niveau || !semestre) {
            if (!semestre) {
                setErrorSemestre(t('error.semestre'));
            }

            if (!periodeFr) {
                setErrorPeriodeFr(t('error.periode_fr'));
            }
            if (!periodeEn) {
                setErrorPeriodeEn(t('error.periode_en'));
            }
            if (!dateDebut) {
                setErrorPeriodeEn(t('error.date_debut'));
            }
            if (!dateFin) {
                setErrorPeriodeEn(t('error.date_fin'));
            }
            if (!section) {
                setErrorSection(t('error.section'));
            }
            if (!cycle) {
                setErrorCycle(t('error.cycle'));
            }
            if (!niveau) {
                setErrorNiveau(t('error.niveau'));
            }

        
            return;
        }

        if (!periodeEnseignement) {
            if (niveau._id) {
                await apiCreatePeriodeEnseignement(
                    {
                        semestre,
                        annee,
                        periodeFr,
                        periodeEn,
                        dateDebut,
                        dateFin,
                        niveau:niveau._id,
                        enseignements:[]
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createPeriodeEnseignement({
                            
                            periode: {
                                _id: e.data._id,
                                annee: e.data.annee,
                                semestre: e.data.semestre,
                                niveau: e.data.niveau,
                                periodeFr: e.data.periodeFr,
                                periodeEn: e.data.periodeEn,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                enseignements: e.data.enseignements
                                
                            }
                            
                        }));

                        closeModal();

                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }else{
            if (niveau._id) {
                await apiUpdatePeriodeEnseignement(
                    {
                        semestre,
                        annee,
                        periodeFr,
                        periodeEn,
                        dateDebut,
                        dateFin,
                        niveau:niveau._id,
                        enseignements:periodeEnseignement.enseignements
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(
                            updatePeriodeEnseignement({
                                id: e.data._id,
                                periodeData: {
                                    _id: e.data._id,
                                    annee: e.data.annee,
                                    semestre: e.data.semestre,
                                    niveau: e.data.niveau,
                                    periodeFr: e.data.periodeFr,
                                    periodeEn: e.data.periodeEn,
                                    dateDebut: e.data.dateDebut,
                                    dateFin: e.data.dateFin,
                                    enseignements: e.data.enseignements
                                }
                            }));
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
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
            >
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(annee)}
                    readOnly  
                    onChange={(e) => {setAnnee(parseInt(e.target.value)); }}
                />
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.semestre')}</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}
                    
                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                <label>{t('label.periode_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={periodeFr}
                    onChange={(e) => { setPeriodeFr(e.target.value); setErrorPeriodeFr("") }}
                />
                {errorPeriodeFr && <p className="text-red-500">{errorPeriodeFr}</p>}
                <label>{t('label.periode_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={periodeEn}
                    onChange={(e) => { setPeriodeEn(e.target.value); setErrorPeriodeEn("") }}
                />
                {errorPeriodeEn && <p className="text-red-500">{errorPeriodeEn}</p>}
                <label>{t('label.date_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => { setDateDebut(e.target.value);setErrorDateDebut("") }}
                />
                {errorDateDebut && <p className="text-red-500">{errorDateDebut}</p>}
                <label>{t('label.date_fin')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateFin}
                    onChange={(e) => { setDateDebut(e.target.value); setErrorDateFin("") }}
                />
                {errorDateFin && <p className="text-red-500">{errorDateFin}</p>}
                

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
