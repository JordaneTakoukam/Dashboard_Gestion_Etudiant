import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiCreateEtudiant, apiUpdateEtudiant } from '../../../api/other_users/api_etudiant';
import { createEtudiant, updateEtudiant } from '../../../_redux/features/etudiant_slice';
import createToast from '../../../hooks/toastify';


function ModalCreateEtudiant({ etudiant }: { etudiant: EtudiantType | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const regions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.regions) ?? [];
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departements) ?? [];
    const communes: CommuneProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.communes) ?? [];
    const grades: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.grades) ?? [];
    const fonctions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions) ?? [];
    const categories: CategorieProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.categories) ?? [];
    const services: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.services) ?? [];
    

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [matricule, setMatricule] = useState("");
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [grade, setGrade] = useState<CommonSettingProps>();
    const [categorie, setCategorie] = useState<CommonSettingProps>();
    const [fonction, setFonction] = useState<CommonSettingProps>();
    const [service, setService] = useState<CommonSettingProps>();
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<DepartementProps>();
    const [commune, setCommune] = useState<CommuneProps>();
    const [dateEntreeAdmin, setDateEntreeAdmin] = useState("");

    const [errorNom, setErrorNom] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (etudiant) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.etudiant'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + etudiant.niveaux[0].niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
            const currentCommune = communes.find(commune => commune._id === "" + etudiant.commune);
            const currentDepartement = currentCommune && departements.find(departement => departement._id === "" + currentCommune.departement);
            const currentRegion = currentDepartement && regions.find(region => region._id === "" + currentDepartement.region);
            currentRegion && filterDepartementByRegion(currentRegion._id);
            currentDepartement && filterCommuneByDepartement(currentDepartement._id)

            const currentCategorie = categories.find(categorie => categorie._id === "" + etudiant.categorie);
            
            const currentGrade = currentCategorie && grades.find(grade => grade._id === "" + currentCategorie.grade);
            currentGrade && filterCategorieByGrade(currentGrade._id);
            setNom(etudiant.nom);
            setPrenom(etudiant.prenom ? etudiant.prenom : ""); 
            setGenre(etudiant.genre);
            setDateNaiss(etudiant.date_naiss ? etudiant.date_naiss.split("T")[0] : "");
            setLieuNaiss(etudiant.lieu_naiss ? etudiant.lieu_naiss : "");
            setEmail(etudiant.email);
            setContact(etudiant.contact ? etudiant.contact : "");
            setMatricule(etudiant.matricule ? etudiant.matricule : "");
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);
            setGrade(currentGrade);
            // setCategorie(etudiant.categorie ? categories.find(categorie=>categorie._id===etudiant.categorie) : undefined);
            setCategorie(currentCategorie);
            setFonction(etudiant.fonction ? fonctions.find(fonction=>fonction._id===etudiant.fonction) : undefined);
            setService(etudiant.service ? services.find(service=>service._id===etudiant.service) : undefined);
            setRegion(currentRegion);
            setDepartement(currentDepartement);
            setCommune(currentCommune);
            setDateEntreeAdmin(etudiant.date_entree ? etudiant.date_entree : "");
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.etudiant'));
            setNom("");
            setPrenom("");
            setGenre("");
            setDateNaiss("");
            setLieuNaiss("");
            setEmail("");
            setContact("");
            setMatricule("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
            setGrade(undefined);
            setCategorie(undefined);
            setFonction(undefined);
            setService(undefined);
            setRegion(undefined);
            setDepartement(undefined);
            setCommune(undefined);
            setDateEntreeAdmin("");
        }


        if (isFirstRender) {
            setErrorNom("");
            setErrorGenre("");
            setErrorEmail("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setIsFirstRender(false);
        }
    }, [etudiant, isFirstRender, t]);

    const closeModal = () => {
        setErrorNom("");
        setErrorGenre("");
        setErrorEmail("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorEmail(t('error.incorrect_email'));
            return false;
        }
        setErrorEmail("");
        return true;
    };

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);
    const [filteredDepartement, setFilteredDepartement] = useState<DepartementProps[] | undefined>([]);
    const [filteredCommune, setFilteredCommune] = useState<CommuneProps[] | undefined>([]);
    const [filteredCategorie, setFilteredCategorie] = useState<CategorieProps[] | undefined>([]);

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

    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCategorieByGrade = (gradeId: string | undefined) => {
        if (gradeId && gradeId !== '') {
            // Filtrer les cycles en fonction de l'ID de la section
            const result: CategorieProps[] = categories.filter(categorie => "" + categorie.grade === gradeId);

            setFilteredCategorie(result);

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

    const handleFonctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFonctionLibelle = e.target.value;
        var selectedFonction = null;

        if (lang === 'fr') {
            selectedFonction = fonctions.find(fonction => fonction.libelleFr === selectedFonctionLibelle);

        }
        else {
            selectedFonction = fonctions.find(fonction => fonction.libelleEn === selectedFonctionLibelle);

        }


        if (selectedFonction) {
            setFonction(selectedFonction);
        }
    };
    
    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeLibelle = e.target.value;
        var selectedGrade = null;

        if (lang === 'fr') {
            selectedGrade = grades.find(grade => grade.libelleFr === selectedGradeLibelle);

        }
        else {
            selectedGrade = grades.find(grade => grade.libelleEn === selectedGradeLibelle);

        }


        if (selectedGrade) {
            setGrade(selectedGrade);
            filterCategorieByGrade(selectedGrade._id);
        }

        
    };

    const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategorieLibelle = e.target.value;
        var selectedCategorie = null;

        if (lang === 'fr') {
            selectedCategorie = categories.find(categorie => categorie.libelleFr === selectedCategorieLibelle);

        }
        else {
            selectedCategorie = categories.find(categorie => categorie.libelleEn === selectedCategorieLibelle);

        }


        if (selectedCategorie) {
            setCategorie(selectedCategorie);
        }
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceLibelle = e.target.value;
        var selectedService = null;

        if (lang === 'fr') {
            selectedService = services.find(service => service.libelleFr === selectedServiceLibelle);

        }
        else {
            selectedService = services.find(service => service.libelleEn === selectedServiceLibelle);

        }


        if (selectedService) {
            setService(selectedService);
        }
    };
    // filtrer les donnee a partir de l'id de la region selectionner
    const filterDepartementByRegion = (regionId: string | undefined) => {
        if (regionId && regionId !== '') {
            // Filtrer les departements en fonction de l'ID de la region
            const result: DepartementProps[] = departements.filter(departement => "" + departement.region === regionId);

            setFilteredDepartement(result);

        }
    };

    // filtrer les donnee a partir de l'id du departement selectionner
    const filterCommuneByDepartement = (departementId: string | undefined) => {
        if (departementId && departementId !== '') {
            // Filtrer les departements en fonction de l'ID de la departement
            const result: CommuneProps[] = communes.filter(commune => "" + commune.departement === departementId);

            setFilteredCommune(result);
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionLibelle = e.target.value;
        var selectedRegion = null;

        if (lang === 'fr') {
            selectedRegion = regions.find(region => region.libelleFr === selectedRegionLibelle);

        }
        else {
            selectedRegion = regions.find(region => region.libelleEn === selectedRegionLibelle);

        }


        if (selectedRegion) {
            setRegion(selectedRegion);
            filterDepartementByRegion(selectedRegion._id);
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        var selectedDepartement = null;

        if (lang === 'fr') {
            selectedDepartement = departements.find(departement => departement.libelleFr === selectedDepartementLibelle);

        }
        else {
            selectedDepartement = departements.find(departement => departement.libelleEn === selectedDepartementLibelle);
        }

        if (selectedDepartement) {
            setDepartement(selectedDepartement);
            filterCommuneByDepartement(selectedDepartement._id);
        }
    };
    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCommuneLibelle = e.target.value;
        var selectedCommune = null;

        if (lang === 'fr') {
            selectedCommune = filteredCommune && filteredCommune.find(commune => commune.libelleFr === selectedCommuneLibelle);

        }
        else {
            selectedCommune = filteredCommune && filteredCommune.find(commune => commune.libelleEn === selectedCommuneLibelle);

        }


        if (selectedCommune) {
            setCommune(selectedCommune);
        }
    };



    const handleCreateEtudiant = async () => {
        if (!nom || !genre || !email || !section || !cycle || !niveau) {
            if (!nom) {
                setErrorNom(t('error.nom'));
            }
            if (!genre) {
                setErrorGenre(t('error.genre'));
            }

            if (!email) {
                setErrorEmail(t('error.email'));
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
        if (!validateEmail()) {
            return;
        }

        if (!etudiant) {
            if (niveau._id) {
                await apiCreateEtudiant(
                    {
                        nom,
                        genre,
                        email,
                        photo_profil:"",
                        contact,
                        matricule,
                        prenom,
                        date_naiss:dateNaiss,
                        lieu_naiss:lieuNaiss,
                        date_entree:dateEntreeAdmin,
                        absences:[],
                        niveaux:[{niveau:niveau._id, annee:currentYear}],
                        // grade:grade?._id||null,
                        categorie:categorie?._id||null,
                        fonction:fonction?._id||null,
                        service:service?._id||null,
                        commune:commune?._id||null
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createEtudiant({
                            
                            etudiant: {
                                _id: e.data._id,
                                nom:e.data.nom,
                                genre:e.data.genre,
                                email:e.data.email,
                                photo_profil:e.data.photo_profil,
                                contact:e.data.contact,
                                matricule:e.data.matricule,
                                prenom:e.data.matricule,
                                date_naiss:e.data.date_naiss,
                                lieu_naiss:e.data.lieu_naiss,
                                date_entree:e.data.date_entree,
                                absences:e.data.absences,
                                niveaux:e.data.niveaux,
                                // grade:e.data.grade,
                                categorie:e.data.categorie,
                                fonction:e.data.fonction,
                                service:e.data.service,
                                commune:e.data.commune
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
        } else {
            if (niveau._id) {
                await apiUpdateEtudiant(
                    {
                        _id:etudiant._id,
                        nom,
                        genre,
                        email,
                        photo_profil:etudiant.photo_profil,
                        contact,
                        matricule,
                        prenom,
                        date_naiss:dateNaiss,
                        lieu_naiss:lieuNaiss,
                        date_entree:dateEntreeAdmin,
                        niveaux:[{niveau:niveau._id, annee:currentYear}],
                        // grade:grade?._id||null,
                        categorie:categorie?._id||null,
                        fonction:fonction?._id||null,
                        service:service?._id||null,
                        commune:commune?._id||null,
                        roles:etudiant.roles
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(updateEtudiant({
                            id:e.data._id,
                            etudiantData: {
                                _id: e.data._id,
                                nom:e.data.nom,
                                genre:e.data.genre,
                                email:e.data.email,
                                photo_profil:e.data.photo_profil,
                                contact:e.data.contact,
                                matricule:e.data.matricule,
                                prenom:e.data.matricule,
                                date_naiss:e.data.date_naiss,
                                lieu_naiss:e.data.lieu_naiss,
                                date_entree:e.data.date_entree,
                                absences:e.data.absences,
                                niveaux:e.data.niveaux,
                                // grade:e.data.grade,
                                categorie:e.data.categorie,
                                fonction:e.data.fonction,
                                service:e.data.service,
                                commune:e.data.commune
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
        }
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <label>{t('label.matricule')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                />
                <label>{t('label.nom')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nom}
                    onChange={(e) => { setNom(e.target.value); setErrorNom("") }}
                />
                {errorNom && <p className="text-red-500" >{errorNom}</p>}
                <label>{t('label.prenom')}</label><input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                />
                <label>{t('label.date_naiss')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateNaiss}
                    onChange={(e) => setDateNaiss(e.target.value)}
                />
                <label>{t('label.lieu_naiss')}</label><input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={lieuNaiss}
                    onChange={(e) => { setLieuNaiss(e.target.value) }}
                />
                <label>{t('label.genre')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.homme')}
                        name="genre"
                        value={t('label.homme')}
                        checked={genre === "M"}
                        onChange={() => { setGenre("M"); setErrorGenre("") }}
                    />
                    <label htmlFor={t('label.homme')} className='radio-intern-space'>{t('label.homme')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.femme')}
                        name="genre"
                        value={t('label.femme')}
                        checked={genre === "F"}
                        onChange={() => { setGenre("F"); setErrorGenre("") }}
                    />
                    <label htmlFor={t('label.femme')}>{t('label.femme')}</label>
                </div>
                {errorGenre && <p className="text-red-500">{errorGenre}</p>}
                <label>{t('label.email')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="e-mail"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorEmail(""); }}
                />
                {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                <label>{t('label.contact')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={contact}
                    onChange={(e) => { setContact(e.target.value) }}
                />
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
                <label>{t('label.grade')}</label>
                <select
                    value={grade ? (lang==='fr'?grade.libelleFr:grade.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                    onChange={handleGradeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}</option>
                    {grades.map(grade => (
                        <option key={grade._id} value={(lang==='fr'?grade.libelleFr:grade.libelleEn)}>{(lang==='fr'?grade.libelleFr:grade.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.categorie')}</label>
                <select
                    value={categorie ? (lang==='fr'?categorie.libelleFr:categorie.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}
                    onChange={handleCategorieChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}</option>
                    {filteredCategorie && filteredCategorie.map(categorie => (
                        <option key={categorie._id} value={(lang==='fr'?categorie.libelleFr:categorie.libelleEn)}>{(lang==='fr'?categorie.libelleFr:categorie.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.fonction')}</label>
                <select
                    value={fonction ? (lang==='fr'?fonction.libelleFr:fonction.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}
                    onChange={handleFonctionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}</option>
                    {fonctions.map(fonction => (
                        <option key={fonction._id} value={(lang==='fr'?fonction.libelleFr:fonction.libelleEn)}>{(lang==='fr'?fonction.libelleFr:fonction.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.service')}</label>
                <select
                    value={service ? (lang==='fr'?service.libelleFr:service.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}
                    onChange={handleServiceChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}</option>
                    {services.map(service => (
                        <option key={service._id} value={(lang==='fr'?service.libelleFr:service.libelleEn)}>{(lang==='fr'?service.libelleFr:service.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.region')}</label>
                <select
                    value={region ? (lang==='fr'?region.libelleFr:region.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={(lang==='fr'?region.libelleFr:region.libelleEn)}>{(lang==='fr'?region.libelleFr:region.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.departement')}</label>
                <select
                    value={departement ? (lang==='fr'?departement.libelleFr:departement.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                    {filteredDepartement && filteredDepartement.map(departement => (
                        <option key={departement._id} value={(lang==='fr'?departement.libelleFr:departement.libelleEn)}>{(lang==='fr'?departement.libelleFr:departement.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.commune')}</label>
                <select
                    value={commune ? (lang==='fr'?commune.libelleFr:commune.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
                    onChange={handleCommuneChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}</option>
                    {filteredCommune && filteredCommune.map(commune => (
                        <option key={commune._id} value={(lang==='fr'?commune.libelleFr:commune.libelleEn)}>{(lang==='fr'?commune.libelleFr:commune.libelleEn)}</option>
                    ))}
                </select>
                <label>{t('label.date_entree_admin')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateEntreeAdmin}
                    onChange={(e) => { setDateEntreeAdmin(e.target.value) }}
                />
            </CustomDialogModal>

        </>
    );
}



export default ModalCreateEtudiant;
