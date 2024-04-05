// import { useDispatch, useSelector } from 'react-redux';
// import { setShowModal } from '../../../_redux/features/setting';
// import { RootState } from '../../../_redux/store';
// import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Etudiant } from '../../../pages/Admin/ListeEtudiants';
// import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';
// import { Section, sections } from '../../../pages/Admin/Sections';
// import { Cycle, cycles } from '../../../pages/Admin/Cycles';
// import { Service, services } from '../../../pages/Admin/Services';
// import { Fonction, fonctions } from '../../../pages/Admin/Fonctions';
// import { Grade, grades } from '../../../pages/Admin/Grades';
// import { Categorie, categories } from '../../../pages/Admin/Categories';
// import { Commune } from '../../../pages/Admin/Communes';
// import { useTranslation } from 'react-i18next';
// import { CommonSettingProps, DepartementProps } from '../../../_types/data_setting_type';


// function ModalCreateEtudiant({ etudiant }: { etudiant: Etudiant | null }) {
//     const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departement) ?? [];
//     const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.region) ?? [];

    // const { t } = useTranslation();

    // const dispatch = useDispatch();
//     const [nom, setNom] = useState("");
//     const [prenom, setPrenom] = useState("");
//     const [genre, setGenre] = useState("");
//     const [dateNaiss, setDateNaiss] = useState("");
//     const [lieuNaiss, setLieuNaiss] = useState("");
//     const [email, setEmail] = useState("");
//     const [contact, setContact] = useState("");
//     const [matricule, setMatricule] = useState("");
//     const [section, setSection] = useState<Section>();
//     const [cycle, setCycle] = useState<Cycle>();
//     const [niveau, setNiveau] = useState<Niveau>();
//     const [grade, setGrade] = useState<Grade>();
//     const [categorie, setCategorie] = useState<Categorie>();
//     const [fonction, setFonction] = useState<Fonction>();
//     const [service, setService] = useState<Service>();
//     const [region, setRegion] = useState<CommonSettingProps>();
//     const [departement, setDepartement] = useState<DepartementProps>();
//     const [commune, setCommune] = useState<Commune>();
//     const [dateEntreeAdmin, setDateEntreeAdmin] = useState("");

//     const [errorNom, setErrorNom] = useState("");
//     const [errorGenre, setErrorGenre] = useState("");
//     const [errorEmail, setErrorEmail] = useState("");
//     const [errorSection, setErrorSection] = useState("");
//     const [errorCycle, setErrorCycle] = useState("");
//     const [errorNiveau, setErrorNiveau] = useState("");
    // const [isFirstRender, setIsFirstRender] = useState(true);

    // const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    // const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    // useEffect(() => {
    //     if (etudiant) {
            // setModalTitle(t('form_update.enregistrer') + t('form_update.etudiant'));
//             setNom(etudiant.nom);
//             setPrenom(etudiant.prenom ? etudiant.prenom : ""); setGenre(etudiant.genre);
//             setDateNaiss(etudiant.dateNaiss ? etudiant.dateNaiss : "");
//             setLieuNaiss(etudiant.lieuNaiss ? etudiant.lieuNaiss : "");
//             setEmail(etudiant.email);
//             setContact(etudiant.contact ? etudiant.contact : "");
//             setMatricule(etudiant.matricule ? etudiant.matricule : "");
//             setSection(etudiant.niveau.cycle.section);
//             setCycle(etudiant.niveau.cycle);
//             setNiveau(etudiant.niveau);
//             setGrade(etudiant.grade ? etudiant.grade : undefined);
//             setCategorie(etudiant.categorie ? etudiant.categorie : undefined);
//             setFonction(etudiant.fonction ? etudiant.fonction : undefined);
//             setService(etudiant.service ? etudiant.service : undefined);
//             setRegion(etudiant.region ? etudiant.region : undefined);
//             setDepartement(etudiant.departement ? etudiant.departement : undefined);
//             setCommune(etudiant.commune ? etudiant.commune : undefined);
//             setDateEntreeAdmin(etudiant.dateEntreeAdmin ? etudiant.dateEntreeAdmin : "");
//         } else {
            // setModalTitle(t('form_save.enregistrer') + t('form_save.etudiant'));
//             setNom("");
//             setPrenom("");
//             setGenre("");
//             setDateNaiss("");
//             setLieuNaiss("");
//             setEmail("");
//             setContact("");
//             setMatricule("");
//             setSection(undefined);
//             setCycle(undefined);
//             setNiveau(undefined);
//             setGrade(undefined);
//             setCategorie(undefined);
//             setFonction(undefined);
//             setService(undefined);
//             setRegion(undefined);
//             setDepartement(undefined);
//             setCommune(undefined);
//             setDateEntreeAdmin("");
//         }


        // if (isFirstRender) {
        //     setErrorNom("");
        //     setErrorGenre("");
        //     setErrorEmail("");
        //     setErrorSection("");
        //     setErrorCycle("");
        //     setErrorNiveau("");
        //     setIsFirstRender(false);
        // }
//     }, [etudiant, isFirstRender, t]);

    // const closeModal = () => {
    //     setErrorNom("");
    //     setErrorGenre("");
    //     setErrorEmail("");
    //     setErrorSection("");
    //     setErrorCycle("");
    //     setErrorNiveau("");
    //     setIsFirstRender(true);
    //     dispatch(setShowModal());
    // };

//     const validateEmail = () => {
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailPattern.test(email)) {
//             setErrorEmail(t('error.incorrect_email'));
//             return false;
//         }
//         setErrorEmail("");
//         return true;
//     };

//     const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedSectionLibelle = e.target.value;
//         const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
//         if (selectedSection) {
//             setSection(selectedSection);
//             setErrorSection("");
//         }
//     };
//     const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCycleLibelle = e.target.value;
//         const selectedCycle = cycles.find(cycle => cycle.libelle === selectedCycleLibelle);
//         if (selectedCycle) {
//             setCycle(selectedCycle);
//             setErrorCycle("");
//         }
//     };
//     const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedNiveauLibelle = e.target.value;
//         const selectedNiveau = niveaux.find(niveau => niveau.libelle === selectedNiveauLibelle);
//         if (selectedNiveau) {
//             setNiveau(selectedNiveau);
//             setErrorNiveau("");
//         }
//     };
//     const handleFonctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedFonctionLibelle = e.target.value;
//         const selectedFonction = fonctions.find(fonction => fonction.libelle === selectedFonctionLibelle);
//         if (selectedFonction) {
//             setFonction(selectedFonction);
//         }
//     };
//     const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedGradeLibelle = e.target.value;
//         const selectedGrade = grades.find(grade => grade.libelle === selectedGradeLibelle);
//         if (selectedGrade) {
//             setGrade(selectedGrade);
//         }
//     };

//     const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCategorieLibelle = e.target.value;
//         const selectedCategorie = categories.find(categorie => categorie.libelle === selectedCategorieLibelle);
//         if (selectedCategorie) {
//             setCategorie(selectedCategorie);
//         }
//     };

//     const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedServiceLibelle = e.target.value;
//         const selectedService = services.find(service => service.libelle === selectedServiceLibelle);
//         if (selectedService) {
//             setService(selectedService);
//         }
//     };
//     const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         // const selectedRegionLibelle = e.target.value;
//         // const selectedRegion = regions.find(region => region.libelle === selectedRegionLibelle);
//         // if (selectedRegion) {
//         //     setRegion(selectedRegion);
//         // }
//     };
//     const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedDepartementLibelle = e.target.value;
//         const selectedDepartement = departements.find(departement => departement.libelle === selectedDepartementLibelle);
//         if (selectedDepartement) {
//             setDepartement(selectedDepartement);
//         }
//     };
//     const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCommuneLibelle = e.target.value;
//         const selectedCommune = communes.find(commune => commune.libelle === selectedCommuneLibelle);
//         if (selectedCommune) {
//             setCommune(selectedCommune);
//         }
//     };



    // const handleCreateEtudiant = () => {
    //     if (!nom || !genre || !email || !section || !cycle || !niveau) {
    //         if (!nom) {
    //             setErrorNom(t('error.nom'));
    //         }
    //         if (!genre) {
    //             setErrorGenre(t('error.genre'));
    //         }

    //         if (!email) {
    //             setErrorEmail(t('error.email'));
    //         }

    //         if (!section) {
    //             setErrorSection(t('error.section'));
    //         }
    //         if (!cycle) {
    //             setErrorCycle(t('error.cycle'));
    //         }
    //         if (!niveau) {
    //             setErrorNiveau(t('error.niveau'));
    //         }
    //         return;
    //     }
    //     if (!validateEmail()) {
    //         return;
    //     }

    //     if (etudiant) {
    //         console.log("student update");
    //     } else {
    //         console.log("student add");
    //     }
    //     closeModal();
    // }

    // return (
    //     <>
    //         <CustomDialogModal
    //             title={modalTitle} // Utilisation du titre dynamique
    //             isModalOpen={isModalOpen}
    //             isDelete={false}
    //             closeModal={closeModal}
    //             handleConfirm={handleCreateEtudiant}
    //         >
//                 <label>{t('label.matricule')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={matricule}
//                     onChange={(e) => setMatricule(e.target.value)}
//                 />
//                 <label>{t('label.nom')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={nom}
//                     onChange={(e) => { setNom(e.target.value); setErrorNom("") }}
//                 />
//                 {errorNom && <p className="text-red-500" >{errorNom}</p>}
//                 <label>{t('label.prenom')}</label><input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={prenom}
//                     onChange={(e) => setPrenom(e.target.value)}
//                 />
//                 <label>{t('label.date_naiss')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="date"
//                     value={dateNaiss}
//                     onChange={(e) => setDateNaiss(e.target.value)}
//                 />
//                 <label>{t('label.lieu_naiss')}</label><input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={lieuNaiss}
//                     onChange={(e) => { setLieuNaiss(e.target.value) }}
//                 />
//                 <label>{t('label.genre')}</label><label className="text-red-500"> *</label>
//                 <div>
//                     <input
//                         className='radio-label-space'
//                         type="radio"
//                         id={t('label.homme')}
//                         name="genre"
//                         value={t('label.homme')}
//                         checked={genre === "H"}
//                         onChange={() => { setGenre("H"); setErrorGenre("") }}
//                     />
//                     <label htmlFor={t('label.homme')} className='radio-intern-space'>{t('label.homme')}</label>

//                     <input
//                         className='radio-label-space'
//                         type="radio"
//                         id={t('label.femme')}
//                         name="genre"
//                         value={t('label.femme')}
//                         checked={genre === "F"}
//                         onChange={() => { setGenre("F"); setErrorGenre("") }}
//                     />
//                     <label htmlFor={t('label.femme')}>{t('label.femme')}</label>
//                 </div>
//                 {errorGenre && <p className="text-red-500">{errorGenre}</p>}
//                 <label>{t('label.email')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="e-mail"
//                     value={email}
//                     onChange={(e) => { setEmail(e.target.value); setErrorEmail(""); }}
//                 />
//                 {errorEmail && <p className="text-red-500">{errorEmail}</p>}
//                 <label>{t('label.contact')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={contact}
//                     onChange={(e) => { setContact(e.target.value) }}
//                 />
//                 <label>{t('label.section')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={section ? section.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}
//                     onChange={handleSectionChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
//                     {sections.map(section => (
//                         <option key={section.id} value={section.libelle}>{section.libelle}</option>
//                     ))}
//                 </select>
//                 {errorSection && <p className="text-red-500">{errorSection}</p>}
//                 <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={cycle ? cycle.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}
//                     onChange={handleCycleChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
//                     {cycles.map(cycle => (
//                         <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
//                     ))}
//                 </select>
//                 {errorCycle && <p className="text-red-500">{errorCycle}</p>}
//                 <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={niveau ? niveau.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}
//                     onChange={handleNiveauChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
//                     {niveaux.map(niveau => (
//                         <option key={niveau.id} value={niveau.libelle}>{niveau.libelle}</option>
//                     ))}
//                 </select>
//                 {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
//                 <label>{t('label.grade')}</label>
//                 <select
//                     value={grade ? grade.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
//                     onChange={handleGradeChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}</option>
//                     {grades.map(grade => (
//                         <option key={grade.id} value={grade.libelle}>{grade.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.categorie')}</label>
//                 <select
//                     value={categorie ? categorie.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}
//                     onChange={handleCategorieChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}</option>
//                     {categories.map(categorie => (
//                         <option key={categorie.id} value={categorie.libelle}>{categorie.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.fonction')}</label>
//                 <select
//                     value={fonction ? fonction.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}
//                     onChange={handleFonctionChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}</option>
//                     {fonctions.map(fonction => (
//                         <option key={fonction.id} value={fonction.libelle}>{fonction.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.service')}</label>
//                 <select
//                     value={service ? service.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}
//                     onChange={handleServiceChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}</option>
//                     {services.map(service => (
//                         <option key={service.id} value={service.libelle}>{service.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.region')}</label>
//                 <select
//                     value={region ? region.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
//                     onChange={handleRegionChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
//                     {regions.map(region => (
//                         <option key={region._id} value={region.libelle}>{region.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.departement')}</label>
//                 <select
//                     value={departement ? departement.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
//                     onChange={handleDepartementChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
//                     {departements.map(departement => (
//                         <option key={departement.id} value={departement.libelle}>{departement.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.commune')}</label>
//                 <select
//                     value={commune ? commune.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
//                     onChange={handleCommuneChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}</option>
//                     {communes.map(commune => (
//                         <option key={commune.id} value={commune.libelle}>{commune.libelle}</option>
//                     ))}
//                 </select>
//                 <label>{t('label.date_entree_admin')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="date"
//                     value={dateEntreeAdmin}
//                     onChange={(e) => { setDateEntreeAdmin(e.target.value) }}
//                 />
            // </CustomDialogModal>

//         </>
//     );
// }

function ModalCreateEtudiant({ etudiant }: { etudiant: Etudiant | null }) {
    
}

export default ModalCreateEtudiant;
