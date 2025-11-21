import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import createToast from '../../../hooks/toastify';
import { apiCreateSupportDeCours, apiUpdateSupportDeCours } from '../../../api/api_support_cours';
import { createSupportDeCours, updateSupportDeCours } from '../../../_redux/features/support_cours_slice';
import { MAX_FILE_SIZE } from '../../../pages/CommonPage/Documents';


function ModalCreateSupportDeCours({ supportDeCours }: { supportDeCours: SupportDeCoursType | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentUser = useSelector((state: RootState) => state.user);
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    

    const { t } = useTranslation();
    const types =[t('label.enseignant'), t('label.etudiant')]

    const dispatch = useDispatch();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [type, setType] = useState(-1);
    const [file, setFile] = useState<File | null>(null);
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorType, setErrorType] = useState("");
    const [errorFile, setErrorFile] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (supportDeCours) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.support_de_cours'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + supportDeCours.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
           
            setTitreFr(supportDeCours.titre_fr);
            setTitreEn(supportDeCours.titre_en); 
            setDescriptionEn(supportDeCours?.description_en || "");
            setDescriptionFr(supportDeCours?.description_fr || "");
            setType(supportDeCours.type);
                       
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);
           
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.support_de_cours'));
            setTitreFr("");
            setTitreEn("");
            
            setDescriptionFr("");
            setDescriptionEn("");
            setType(-1);
            setFile(null)
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
           
        }


        if (isFirstRender) {
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorType("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setErrorFile("");
            setIsFirstRender(false);
        }
    }, [supportDeCours, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorType("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorFile("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

   
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const selectedFile = e.target.files[0];
          if (selectedFile.size > MAX_FILE_SIZE) {
            const msg = t('error.telecharger_doc');
            createToast(msg, '', 2);
            // setErrorFile(msg);
            setFile(null); // Clear the file
          } else {
            setFile(selectedFile);
            // setErrorFile('');
          }
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

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
      
        setType(0)
        if(selectedType === t('label.etudiant')){
            setType(1)
        }
           
        setErrorType("");
        
    };



    const handleCreateSupportDeCours = async () => {
        if (!titreFr || !titreEn || type ==-1 || (!supportDeCours && !file)) {
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }
            if (!titreEn) {
                setErrorTitreEn(t('error.titre_en'));
            }

            if (type == -1) {
                setErrorType(t('error.type'));
            }

            if(!supportDeCours && !file){
                setErrorFile(t('error.fichier'));
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
        
        const formData = new FormData();
        if(file){
            formData.append('file', file);
        }
        formData.append('titre_fr', titreFr);
        formData.append('titre_en', titreEn);
        formData.append('description_fr', descriptionFr);
        formData.append('description_en', descriptionEn);
        type && formData.append('type', type.toString());
        niveau && niveau._id && formData.append('niveau', niveau._id);
        formData.append('annee', currentYear.toString());
        formData.append('user', currentUser._id);
        
        
        

        if (!supportDeCours) { 
            setIsLoading(true)               
            await apiCreateSupportDeCours(
                {
                    formData
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    console.log(e.data)
                    dispatch(createSupportDeCours({
                        
                        supportDeCours: {
                            _id: e.data._id,
                            titre_fr: e.data.titre_fr,
                            titre_en: e.data.titre_en,
                            description_fr: e.data.description_fr,
                            description_en: e.data.description_en,
                            type: e.data.type,
                            annee: e.data.annee,
                            fichier: e.data.fichier,
                            utilisateur: e.data.utilisateur,
                            niveau: e.data.niveau,
                            dateAjout: e.data.dateAjout,
                            size:e.data.size
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
        } else {
            setIsLoading(true)
            supportDeCours._id && await apiUpdateSupportDeCours(
                {
                   supportId:supportDeCours._id,
                   formData
                    
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(updateSupportDeCours({
                        id:e.data._id,
                        supportDeCoursData: {
                            _id: e.data._id,
                            titre_fr: e.data.titre_fr,
                            titre_en: e.data.titre_en,
                            description_fr: e.data.description_fr,
                            description_en: e.data.description_en,
                            type: e.data.type,
                            annee: e.data.annee,
                            fichier: e.data.fichier,
                            utilisateur: e.data.utilisateur,
                            niveau: e.data.niveau,
                            dateAjout: e.data.dateAjout,
                            size:e.data.size
                        }
                        
                    }));

                    closeModal();

                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false)
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
                handleConfirm={handleCreateSupportDeCours}
                isLoading={isLoading}
            >
                
                <label>{t('label.titre_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={titreFr}
                    onChange={(e) => { setTitreFr(e.target.value); setErrorTitreFr("") }}
                />
                {errorTitreFr && <p className="text-red-500" >{errorTitreFr}</p>}
                <label>{t('label.titre_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={titreEn}
                    onChange={(e) => setTitreEn(e.target.value)}
                />
                {errorTitreEn && <p className="text-red-500" >{errorTitreEn}</p>}
                <label>{t('label.descrip_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionFr}
                    onChange={(e) => setDescriptionFr(e.target.value)}
                />
                <label>{t('label.descrip_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionEn}
                    onChange={(e) => { setDescriptionEn(e.target.value) }}
                />
                <label>{t('label.type')}</label><label className="text-red-500"> *</label>
                <select
                    value={type!=-1 ? (type==0?t('label.enseignant'):t('label.etudiant')) : t('select_par_defaut.selectionnez') + t('select_par_defaut.type')}
                    onChange={handleTypeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type')}</option>
                    {types.map((tp, index) => (
                        <option key={index} value={tp}>{tp}</option>
                    ))}
                </select>
                {errorType && <p className="text-red-500">{errorType}</p>}
                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? (lang==='fr'?section.libelleFr:section.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section._id} value={lang==='fr'?section.libelleFr:section.libelleEn}>{lang==='fr'?section.libelleFr:section.libelleEn}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? (lang==='fr'?cycle.libelleFr:cycle.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
                    {filteredCycle && filteredCycle.map(cycle => (
                        <option key={cycle._id} value={lang==='fr'?cycle.libelleFr:cycle.libelleEn}>{lang==='fr'?cycle.libelleFr:cycle.libelleEn}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? (lang==='fr'?niveau.libelleFr:niveau.libelleEn): t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
                    {filteredNiveau && filteredNiveau.map(niveau => (
                        <option key={niveau._id} value={lang==='fr'?niveau.libelleFr:niveau.libelleEn}>{lang==='fr'?niveau.libelleFr:niveau.libelleEn}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
                <label>{t('label.support_de_cours')}</label>{!supportDeCours && <label className="text-red-500"> *</label>}
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="file"
                    onChange={handleFileChange}
                />
                {!supportDeCours  && errorFile && <p className="text-red-500">{errorFile}</p>}
                
            </CustomDialogModal>

        </>
    );
}



export default ModalCreateSupportDeCours;
