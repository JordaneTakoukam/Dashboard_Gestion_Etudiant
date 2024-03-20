import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Administrateur } from '../../../pages/Admin/ListeAdministrateurs';
import {Commune, communes } from '../../../pages/Admin/Communes';
import { Service, services } from '../../../pages/Admin/Services';
import { Fonction, fonctions } from '../../../pages/Admin/Fonctions';
import { Grade, grades } from '../../../pages/Admin/Grades';
import { Categorie, categories } from '../../../pages/Admin/Categories';
import { useTranslation } from 'react-i18next';
import { DepartementProps } from '../../../_types/data_setting_interface';


function ModalCreateUpdate({ administrateur }: { administrateur : Administrateur | null }) {
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departement) ?? [];

    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.region) ?? [];

    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [matricule, setMatricule] = useState("");
    // const [section, setSection] = useState<Section>();
    // const [cycle, setCycle] = useState<Cycle>();
    // const [niveau, setNiveau] = useState<Niveau>();
    const [grade, setGrade] = useState<Grade>();
    const [categorie, setCategorie] = useState<Categorie>();
    const [fonction, setFonction] = useState<Fonction>();
    const [service, setService] = useState<Service>();
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();
    const [dateEntreeAdmin, setDateEntreeAdmin] = useState("");

    const [errorNom, setErrorNom] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    // const [errorSection, setErrorSection] = useState("");
    // const [errorCycle, setErrorCycle] = useState("");
    // const [errorNiveau, setErrorNiveau] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (administrateur) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.administrateur'));
            setNom(administrateur.nom);
            setPrenom(administrateur.prenom?administrateur.prenom:"");setGenre(administrateur.genre);
            setDateNaiss(administrateur.dateNaiss ? administrateur.dateNaiss : "");
            setLieuNaiss(administrateur.lieuNaiss ? administrateur.lieuNaiss : "");
            setEmail(administrateur.email);
            setContact(administrateur.contact ? administrateur.contact : "");
            setMatricule(administrateur.matricule ? administrateur.matricule : "");
            // setSection(administrateur.niveau.cycle.section);
            // setCycle(administrateur.niveau.cycle);
            // setNiveau(administrateur.niveau);
            setGrade(administrateur.grade ? administrateur.grade : undefined);
            setCategorie(administrateur.categorie ? administrateur.categorie : undefined);
            setFonction(administrateur.fonction ? administrateur.fonction : undefined);
            setService(administrateur.service ? administrateur.service : undefined);
            setRegion(administrateur.region ? administrateur.region : undefined);
            setDepartement(administrateur.departement ? administrateur.departement : undefined);
            setCommune(administrateur.commune ? administrateur.commune : undefined);
            setDateEntreeAdmin(administrateur.dateEntreeAdmin ? administrateur.dateEntreeAdmin : "");
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.administrateur'));
            setNom("");
            setPrenom("");
            setGenre("");
            setDateNaiss("");
            setLieuNaiss("");
            setEmail("");
            setContact("");
            setMatricule("");
            // setSection(undefined);
            // setCycle(undefined);
            // setNiveau(undefined);
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
            // setErrorSection("");
            // setErrorCycle("");
            // setErrorNiveau("");
            setIsFirstRender(false);
        }
    }, [administrateur, isFirstRender, t]);

    const closeModal = () => { 
        setErrorNom(""); 
        setErrorGenre("");
        setErrorEmail("");
        // setErrorSection("");
        // setErrorCycle("");
        // setErrorNiveau("");
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

    // const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedSectionLibelle = e.target.value;
    //     const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
    //     if (selectedSection) {
    //         setSection(selectedSection);
    //         setErrorSection("");
    //     }
    // };
    // const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedCycleLibelle = e.target.value;
    //     const selectedCycle = cycles.find(cycle => cycle.libelle === selectedCycleLibelle);
    //     if (selectedCycle) {
    //         setCycle(selectedCycle);
    //         setErrorCycle("");
    //     }
    // };
    // const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedNiveauLibelle = e.target.value;
    //     const selectedNiveau = niveaux.find(niveau => niveau.libelle === selectedNiveauLibelle);
    //     if (selectedNiveau) {
    //         setNiveau(selectedNiveau);
    //         setErrorNiveau("");
    //     }
    // };
    const handleFonctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFonctionLibelle = e.target.value;
        const selectedFonction = fonctions.find(fonction => fonction.libelle === selectedFonctionLibelle);
        if (selectedFonction) {
            setFonction(selectedFonction);
        }
    };
    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeLibelle = e.target.value;
        const selectedGrade = grades.find(grade => grade.libelle === selectedGradeLibelle);
        if (selectedGrade) {
            setGrade(selectedGrade);
        }
    };

    const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategorieLibelle = e.target.value;
        const selectedCategorie = categories.find(categorie => categorie.libelle === selectedCategorieLibelle);
        if (selectedCategorie) {
            setCategorie(selectedCategorie);
        }
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceLibelle = e.target.value;
        const selectedService = services.find(service => service.libelle === selectedServiceLibelle);
        if (selectedService) {
            setService(selectedService);
        }
    };
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionLibelle = e.target.value;
        const selectedRegion = regions.find(region => region.libelle === selectedRegionLibelle);
        if (selectedRegion) {
            setRegion(selectedRegion);
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        const selectedDepartement = departements.find(departement => departement.libelle === selectedDepartementLibelle);
        if (selectedDepartement) {
            setDepartement(selectedDepartement);
        }
    };
    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCommuneLibelle = e.target.value;
        const selectedCommune = communes.find(commune => commune.libelle === selectedCommuneLibelle);
        if (selectedCommune) {
            setCommune(selectedCommune);
        }
    };
    
    

    const handleCreateAdministrateur = () => {
        if (!nom || !genre || !email) {
            if (!nom) {
                setErrorNom(t('error.nom'));
            }
            if (!genre) {
                setErrorGenre(t('error.genre'));
            }
    
            if (!email) {
                setErrorEmail(t('error.email'));
            }
            
            return;
        }
        if (!validateEmail()) {
            return;
        }
        
        if (administrateur) {
            console.log("student update");
        }else{
            console.log("student add");
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
                handleConfirm={handleCreateAdministrateur}
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
                    onChange={(e) => {setNom(e.target.value); setErrorNom("")}}
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
                    onChange={(e) => {setLieuNaiss(e.target.value)}}
                />
                <label>{t('label.genre')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.homme')}
                        name="genre"
                        value={t('label.homme')}
                        checked={genre === "H"}
                        onChange={() =>{ setGenre("H"); setErrorGenre("")}}
                    />
                    <label htmlFor={t('label.homme')} className='radio-intern-space'>{t('label.homme')}</label>
                    
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.femme')}
                        name="genre"
                        value={t('label.femme')}
                        checked={genre === "F"}
                        onChange={() =>{ setGenre("F"); setErrorGenre("")}}
                    />
                    <label htmlFor={t('label.femme')}>{t('label.femme')}</label>
                </div>
                {errorGenre && <p className="text-red-500">{errorGenre}</p>}
                <label>{t('label.email')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="e-mail"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setErrorEmail("");}}
                />
                {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                <label>{t('label.contact')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={contact}
                    onChange={(e) => {setContact(e.target.value)}}
                />
                
                <label>{t('label.grade')}</label>
                <select
                    value={grade ? grade.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.grade')}
                    onChange={handleGradeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.grade')}</option>
                    {grades.map(grade => (
                        <option key={grade.id} value={grade.libelle}>{grade.libelle}</option>
                    ))}
                </select>
                <label>{t('label.categorie')}</label>
                <select
                    value={categorie ? categorie.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.categorie')}
                    onChange={handleCategorieChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.categorie')}</option>
                    {categories.map(categorie => (
                        <option key={categorie.id} value={categorie.libelle}>{categorie.libelle}</option>
                    ))}
                </select>
                <label>{t('label.fonction')}</label>
                <select
                    value={fonction ? fonction.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.fonction')}
                    onChange={handleFonctionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.fonction')}</option>
                    {fonctions.map(fonction => (
                        <option key={fonction.id} value={fonction.libelle}>{fonction.libelle}</option>
                    ))}
                </select>
                <label>{t('label.service')}</label>
                <select
                    value={service ? service.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.service')}
                    onChange={handleServiceChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.service')}</option>
                    {services.map(service => (
                        <option key={service.id} value={service.libelle}>{service.libelle}</option>
                    ))}
                </select>
                <label>{t('label.region')}</label>
                <select
                    value={region ? region.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.region')}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={region.libelle}>{region.libelle}</option>
                    ))}
                </select>
                <label>{t('label.departement')}</label>
                <select
                    value={departement ? departement.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.departement')}</option>
                    {departements.map(departement => (
                        <option key={departement.id} value={departement.libelle}>{departement.libelle}</option>
                    ))}
                </select>
                <label>{t('label.commune')}</label>
                <select
                    value={commune ? commune.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.commune')}
                    onChange={handleCommuneChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.commune')}</option>
                    {communes.map(commune => (
                        <option key={commune.id} value={commune.libelle}>{commune.libelle}</option>
                    ))}
                </select>
                <label>{t('label.date_entree_admin')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateEntreeAdmin}
                    onChange={(e) => {setDateEntreeAdmin(e.target.value)}}
                />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
