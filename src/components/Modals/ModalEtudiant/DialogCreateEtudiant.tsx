import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalCreate, setShowModalUpdate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Categorie, Commune, Departement, Etudiant, Fonction, Grade, Region, Service, categories, communes, departements, fonctions, grades, regions, services } from '../../../pages/Admin/ListeEtudiants';
import { Niveau, listNiveau } from '../../../pages/Admin/Niveaux';
import { Section, sections } from '../../../pages/Admin/Sections';
import { Cycle, listCycle } from '../../../pages/Admin/Cycles';


function ModalCreateEtudiant({ etudiant }: { etudiant : Etudiant | null }) {

    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [matricule, setMatricule] = useState("");
    const [section, setSection] = useState<Section>();
    const [cycle, setCycle] = useState<Cycle>();
    const [niveau, setNiveau] = useState<Niveau>();
    const [grade, setGrade] = useState<Grade>();
    const [categorie, setCategorie] = useState<Categorie>();
    const [fonction, setFonction] = useState<Fonction>();
    const [service, setService] = useState<Service>();
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();
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
            setModalTitle("Mettre à jour les informations de l'étudiant");
            setNom(etudiant.nom);
            setPrenom(etudiant.prenom?etudiant.prenom:"");setGenre(etudiant.genre);
            setDateNaiss(etudiant.dateNaiss ? etudiant.dateNaiss : "");
            setLieuNaiss(etudiant.lieuNaiss ? etudiant.lieuNaiss : "");
            setEmail(etudiant.email);
            setContact(etudiant.contact ? etudiant.contact : "");
            setMatricule(etudiant.matricule ? etudiant.matricule : "");
            setSection(etudiant.niveau.cycle.section);
            setCycle(etudiant.niveau.cycle);
            setNiveau(etudiant.niveau);
            setGrade(etudiant.grade ? etudiant.grade : undefined);
            setCategorie(etudiant.categorie ? etudiant.categorie : undefined);
            setFonction(etudiant.fonction ? etudiant.fonction : undefined);
            setService(etudiant.service ? etudiant.service : undefined);
            setRegion(etudiant.region ? etudiant.region : undefined);
            setDepartement(etudiant.departement ? etudiant.departement : undefined);
            setCommune(etudiant.commune ? etudiant.commune : undefined);
            setDateEntreeAdmin(etudiant.dateEntreeAdmin ? etudiant.dateEntreeAdmin : "");
        } else {
            setModalTitle("Enregistrer un nouvel étudiant");
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
    }, [etudiant, isFirstRender]);

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
            setErrorEmail("Veuillez saisir une adresse e-mail valide.");
            return false;
        }
        setErrorEmail("");
        return true;
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
        if (selectedSection) {
            setSection(selectedSection);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        const selectedCycle = listCycle.find(cycle => cycle.libelle === selectedCycleLibelle);
        if (selectedCycle) {
            setCycle(selectedCycle);
            setErrorCycle("");
        }
    };
    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        const selectedNiveau = listNiveau.find(niveau => niveau.libelle === selectedNiveauLibelle);
        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };
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
    
    

    const handleCreateEtudiant = () => {
        if (!nom || !genre || !email || !section || !cycle || !niveau) {
            if (!nom) {
                setErrorNom("Le champ Nom est obligatoire.");
            }
            if (!genre) {
                setErrorGenre("La sélection du genre est obligatoire.");
            }
    
            if (!email) {
                setErrorEmail("Le champ e-mail est obligatoire.");
            }
            
            if (!section) {
                setErrorSection("Le champ section est obligatoire.");
            }
            if (!cycle) {
                setErrorCycle("Le champ cycle est obligatoire.");
            }
            if (!niveau) {
                setErrorNiveau("Le champ niveau est obligatoire.");
            }
            return;
        }
        if (!validateEmail()) {
            return;
        }
        
        if (etudiant) {
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
                handleConfirm={handleCreateEtudiant}
            >
                <label>Matricule</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                />
                <label>Nom</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nom}
                    onChange={(e) => {setNom(e.target.value); setErrorNom("")}}
                />
                {errorNom && <p className="text-red-500" >{errorNom}</p>}
                <label>Prénom</label><input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                />
                <label>Date de naissance</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateNaiss}
                    onChange={(e) => setDateNaiss(e.target.value)}
                />
                <label>Lieu de naissance</label><input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={lieuNaiss}
                    onChange={(e) => {setLieuNaiss(e.target.value)}}
                />
                <label>Genre</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id="homme"
                        name="genre"
                        value="Homme"
                        checked={genre === "H"}
                        onChange={() =>{ setGenre("H"); setErrorGenre("")}}
                    />
                    <label htmlFor="homme" className='radio-intern-space'>Homme</label>
                    
                    <input
                        className='radio-label-space'
                        type="radio"
                        id="femme"
                        name="genre"
                        value="Femme"
                        checked={genre === "F"}
                        onChange={() =>{ setGenre("F"); setErrorGenre("")}}
                    />
                    <label htmlFor="femme">Femme</label>
                </div>
                {errorGenre && <p className="text-red-500">{errorGenre}</p>}
                <label>E-mail</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="e-mail"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setErrorEmail("");}}
                />
                {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                <label>Contact</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={contact}
                    onChange={(e) => {setContact(e.target.value)}}
                />
                <label>Section</label><label className="text-red-500"> *</label>
                <select
                    value={section ? section.libelle : 'Sélectionnez une section'}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une section</option>
                    {sections.map(section => (
                        <option key={section.id} value={section.libelle}>{section.libelle}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>Cycle</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? cycle.libelle : 'Sélectionnez un cycle'}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un cycle</option>
                    {listCycle.map(cycle => (
                        <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>Niveau</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? niveau.libelle : 'Sélectionnez un niveau'}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un niveau</option>
                    {listNiveau.map(niveau => (
                        <option key={niveau.id} value={niveau.libelle}>{niveau.libelle}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
                <label>Grade</label>
                <select
                    value={grade ? grade.libelle : 'Sélectionnez un grade'}
                    onChange={handleGradeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un grade</option>
                    {grades.map(grade => (
                        <option key={grade.id} value={grade.libelle}>{grade.libelle}</option>
                    ))}
                </select>
                <label>Catégorie</label>
                <select
                    value={categorie ? categorie.libelle : 'Sélectionnez une catégorie'}
                    onChange={handleCategorieChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(categorie => (
                        <option key={categorie.id} value={categorie.libelle}>{categorie.libelle}</option>
                    ))}
                </select>
                <label>Fonction</label>
                <select
                    value={fonction ? fonction.libelle : 'Sélectionnez une fonction'}
                    onChange={handleFonctionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une fonction</option>
                    {fonctions.map(fonction => (
                        <option key={fonction.id} value={fonction.libelle}>{fonction.libelle}</option>
                    ))}
                </select>
                <label>Service</label>
                <select
                    value={service ? service.libelle : 'Sélectionnez un service'}
                    onChange={handleServiceChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un service</option>
                    {services.map(service => (
                        <option key={service.id} value={service.libelle}>{service.libelle}</option>
                    ))}
                </select>
                <label>Région</label>
                <select
                    value={region ? region.libelle : 'Sélectionnez une région'}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une région</option>
                    {regions.map(region => (
                        <option key={region.id} value={region.libelle}>{region.libelle}</option>
                    ))}
                </select>
                <label>Département</label>
                <select
                    value={departement ? departement.libelle : 'Sélectionnez un département'}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un département</option>
                    {departements.map(departement => (
                        <option key={departement.id} value={departement.libelle}>{departement.libelle}</option>
                    ))}
                </select>
                <label>Commune</label>
                <select
                    value={commune ? commune.libelle : 'Sélectionnez une commune'}
                    onChange={handleCommuneChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une commune</option>
                    {communes.map(commune => (
                        <option key={commune.id} value={commune.libelle}>{commune.libelle}</option>
                    ))}
                </select>
                <label>Date d'entrée dans l'administration</label>
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

export default ModalCreateEtudiant;
