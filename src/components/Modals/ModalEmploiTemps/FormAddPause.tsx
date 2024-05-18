import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalPause, } from '../../../_redux/features/setting';
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



function ModalCreateUpdate({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);

    const [errorJour, setErrorJour] = useState("");
    const [errorHeureDebut, setErrorHeureDebut] = useState("");
    const [errorHeureFin, setErrorHeureFin] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openPause);
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


    useEffect(() => {

        if (periodeCours) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.pause'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + periodeCours.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
            setJour(jours.find((jour) => periodeCours.jour == jour.ordre));
            setHeureDebut(periodeCours.heureDebut);
            setHeureFin(periodeCours.heureFin);
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);
           
            setSemestre(periodeCours.semestre);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.pause'));
            setJour(undefined);
            setHeureDebut("");
            setHeureFin("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
            setSemestre(currentSemester);
            setFilteredCycle(undefined);
            setFilteredNiveau(undefined);
        }



        if (isFirstRender) {
            setIsDeleting(false);
            setErrorJour("");
            setHeureDebut("");
            setErrorHeureFin("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setErrorSemestre("");
            setIsFirstRender(false);
        }
    }, [periodeCours, isFirstRender, t]);
    
   
    const closeModal = () => {
        setErrorJour("");
        setErrorHeureDebut("");
        setErrorHeureFin("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorSemestre("");
        setIsFirstRender(true);
        dispatch(setShowModalPause());
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };

    const handleJourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedJourLibelle = e.target.value;
        const selectedJour = jours.find(jour => lang === 'fr' ? jour.libelleFr === selectedJourLibelle : jour.libelleEn === selectedJourLibelle);
        if (selectedJour) {
            setJour(selectedJour);
            setErrorJour("");
        }
    };


    //verifier si l'heure de fin vient avant l'heure de début
    const verifierHeureFinApresDebut = (heureDebut: string, heureFin: string): boolean => {
        const debutMinutes = convertirHeureVersMinutes(heureDebut);
        const finMinutes = convertirHeureVersMinutes(heureFin);

        return finMinutes < debutMinutes;
    };

    // Fonction utilitaire pour convertir l'heure au format HH:MM en minutes
    const convertirHeureVersMinutes = (heure: string): number => {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    };




    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleDelete = () => {
        setIsDeleting(!isDeleting);
    };

    const handleDelete = async () => {
        if (periodeCours?._id != undefined) {
            await apiDeletePeriode(periodeCours._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (periodeCours._id) {
                        dispatch(deletePeriode({ id: periodeCours._id }));
                    }

                    closeModal();
                    setIsDeleting(false); // Réinitialiser le toggle à false après la suppression
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

            })
        }

    };

    const handleCreatePeriodeCours = async () => {
        if (!jour || !heureDebut || !heureFin || !section || !cycle || !niveau  || !semestre) {
            if (!jour) {
                setErrorJour(t('error.jour'));
            }
            if (!heureDebut) {
                setErrorHeureDebut(t('error.heure_debut'));
            }
            if (!heureFin) {
                setErrorHeureFin(t('error.heure_fin'));
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

          

            if (!semestre) {
                setErrorSemestre(t('error.semestre'));
            }

            return;
        }

        if(verifierHeureFinApresDebut(heureDebut, heureFin)){
            setErrorHeureFin(t('error.debut_sup_fin_periode'));
            return;
        }
        
        if (!periodeCours) {
            if (niveau._id && jour.ordre) {
                await apiCreatePeriode(
                    {
                        jour : jour.ordre,
                        semestre,
                        annee,
                        niveau:niveau._id,
                        heureDebut,
                        heureFin,
                        pause:true
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createPeriode({
                            
                            periode: {
                                _id: e.data._id,
                                jour: e.data.jour,
                                annee: e.data.annee,
                                semestre: e.data.semestre,
                                niveau: e.data.niveau,
                                matiere: e.data.matiere,
                                salleCours: e.data.salleCours,
                                heureDebut: e.data.heureDebut,
                                heureFin: e.data.heureFin,
                                pause:e.data.pause,
                                typeEnseignement: e.data.typeEnseignement,
                                enseignantPrincipal:e.data.enseignantPrincipal,
                                enseignantSuppleant:e.data.enseignantSuppleant,
                                
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
            if (niveau._id && jour.ordre) {
                await apiUpdatePeriode(
                    {
                        jour : jour.ordre,
                        semestre,
                        annee,
                        niveau:niveau._id,
                        heureDebut,
                        heureFin,
                        _id:periodeCours._id,
                        pause:true,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(
                            updatePeriode({
                                id: e.data._id,
                                periodeData: {
                                    _id: e.data._id,
                                    jour: e.data.jour,
                                    annee: e.data.annee,
                                    semestre: e.data.semestre,
                                    niveau: e.data.niveau,
                                    matiere: e.data.matiere,
                                    salleCours: e.data.salleCours,
                                    heureDebut: e.data.heureDebut,
                                    heureFin: e.data.heureFin,
                                    typeEnseignement: e.data.typeEnseignement,
                                    enseignantPrincipal:e.data.enseignantPrincipal,
                                    enseignantSuppleant:e.data.enseignantSuppleant,
                                    pause:e.data.pause,
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
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.semestre')}</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}

                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                <label>{t('label.jour')}</label><label className="text-red-500"> *</label>
                <select
                    value={jour ? lang === 'fr' ? jour.libelleFr : jour.libelleEn : t('select_par_defaut.selectionnez') + t('select_par_defaut.jour')}
                    onChange={handleJourChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.jour')}</option>
                    {jours.map(jour => (
                        <option key={jour.ordre} value={lang === 'fr' ? jour.libelleFr : jour.libelleEn}>{lang === 'fr' ? jour.libelleFr : jour.libelleEn}</option>
                    ))}
                </select>
                {errorJour && <p className="text-red-500" >{errorJour}</p>}
                <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heureDebut}
                    onChange={(e) => { setHeureDebut(e.target.value); setErrorHeureDebut("") }}
                />
                {errorHeureDebut && <p className="text-red-500" >{errorHeureDebut}</p>}
                <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heureFin}
                    onChange={(e) => { setHeureFin(e.target.value); setErrorHeureFin("") }}
                />
                {errorHeureFin && <p className="text-red-500" >{errorHeureFin}</p>}
                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? (lang === 'fr' ? section.libelleFr : section.libelleEn) : 'Sélectionnez une section'}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section._id} value={lang === 'fr' ? section.libelleFr : section.libelleEn}>{lang === 'fr' ? section.libelleFr : section.libelleEn}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? (lang === 'fr' ? cycle.libelleFr : cycle.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
                    {filteredCycle && filteredCycle.map(cycle => (
                        <option key={cycle._id} value={lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}>{lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? (lang === 'fr' ? niveau.libelleFr : niveau.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
                    {filteredNiveau && filteredNiveau.map(niveau => (
                        <option key={niveau._id} value={lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}>{lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
