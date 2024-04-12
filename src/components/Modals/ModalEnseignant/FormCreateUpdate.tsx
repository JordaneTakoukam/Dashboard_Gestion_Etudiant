import { useEffect, useState } from "react";
import CustomDialogModal from "../CustomDialogModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { setShowModal } from "../../../_redux/features/setting";
import { useTranslation } from "react-i18next";
import Input from "../../ui/input";
import { ErrorInput, LabelInput } from "../../../pages/Authentication/componants/Label";
import Select from "../../ui/Select";
import { validateEmail } from "../../../fonctions/fonction";
import { apiCreateAdministrateur, apiUpdateAdministrateur } from "../../../api/other_users/api_administrateur";
import createToast from "../../../hooks/toastify";
import { createAdmin, updateAdmin } from "../../../_redux/features/admin_slice";

interface ModalCreateUpdateAdmin {
    enseignant: EnseignantType | null,
}


export function ModalCreateUpdateEnseignant({ enseignant }: ModalCreateUpdateAdmin) {

    const { t } = useTranslation();
    const dispatch = useDispatch();


    const lang = useSelector((state: RootState) => state.setting.language);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    // select value
    const grades: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.grades);
    const categories: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.categories);
    const fonctions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions);
    const services: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.services);
    const regions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.regions);
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departements);
    const communes: CommuneProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.communes);

    // VALEUR DU FORMULAIRE
    const [matricule, setMatricule] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState<string | null>("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState<string | null>("");
    const [lieuNaiss, setLieuNaiss] = useState<string | null>("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState<string | null>("");
    const [dateEntreeAdmin, setDateEntreeAdmin] = useState<string | null>("");
    //
    const [grade, setGrade] = useState<CommonSettingProps>();
    const [categorie, setCategorie] = useState<CommonSettingProps>();
    const [fonction, setFonction] = useState<CommonSettingProps>();
    const [service, setService] = useState<CommonSettingProps>();
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<DepartementProps>();
    const [commune, setCommune] = useState<CommuneProps>();


    // ERREUR DE VALIDATION
    const [errorNom, setErrorNom] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorEmail, setErrorEmail] = useState("");


    const handleFonctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFonctionLibelle = e.target.value;
        const selectedFonction = fonctions.find(fonction => fonction?.libelleFr === selectedFonctionLibelle || fonction.libelleEn === selectedFonctionLibelle);
        if (selectedFonction) {
            setFonction(selectedFonction);
        }
    };
    // handleChange
    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeLibelle = e.target.value;
        const selectedGrade = grades.find(grade => (grade.libelleFr === selectedGradeLibelle || grade.libelleEn === selectedGradeLibelle));
        if (selectedGrade) {
            setGrade(selectedGrade);
        }
    };
    const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategorieLibelle = e.target.value;
        const selectedCategorie = categories.find(categorie => (categorie.libelleFr === selectedCategorieLibelle || categorie.libelleEn === selectedCategorieLibelle));
        if (selectedCategorie) {
            setCategorie(selectedCategorie);
        }
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceLibelle = e.target.value;
        const selectedService = services.find(service => (service.libelleFr === selectedServiceLibelle || service.libelleEn === selectedServiceLibelle));
        if (selectedService) {
            setService(selectedService);
        }
    };
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionLibelle = e.target.value;
        const selectedRegion = regions.find(region => (region.libelleFr === selectedRegionLibelle || region.libelleEn === selectedRegionLibelle));
        if (selectedRegion) {
            setRegion(selectedRegion);
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        const selectedDepartement = departements.find(departement => (departement.libelleFr === selectedDepartementLibelle || departement.libelleEn === selectedDepartementLibelle));
        if (selectedDepartement) {
            setDepartement(selectedDepartement);
        }
    };
    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCommuneLibelle = e.target.value;
        const selectedCommune = communes.find(commune => (commune.libelleFr === selectedCommuneLibelle || commune.libelleEn === selectedCommuneLibelle));
        if (selectedCommune) {
            setCommune(selectedCommune);
        }
    };


    const closeModal = () => {
        setErrorNom("");
        setErrorGenre("");
        setErrorEmail("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleSubmit = async () => {

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
        if (email) {
            const notValidEmail = validateEmail(email);
            if (notValidEmail) {
                setErrorEmail(t(notValidEmail));
                return;
            }
        }

        //
        const dataForm: AdminCreateType = {
            genre,
            date_entree: dateEntreeAdmin,
            date_naiss: dateNaiss,
            nom: nom,
            prenom: prenom,
            email: email,
            matricule: matricule,
            lieu_naiss: lieuNaiss,
            contact,
            grade: grade?._id ? grade._id : null,
            categorie: categorie?._id ? categorie._id : null,
            fonction: fonction?._id ? fonction._id : null,
            service: service?._id ? service._id : null,
            region: region?._id ? region._id : null,
            departement: departement?._id ? departement._id : null,
            commune: commune?._id ? commune._id : null,
        }



        if (!enseignant) {
            //  create admin
            await apiCreateAdministrateur({
                ...dataForm
            }).then((reponse: ReponseApiPros) => {

                if (reponse.success) {
                    try {
                        dispatch(createAdmin({ ...reponse.data }));
                        createToast(reponse.message[lang as keyof typeof reponse.message], '', 0);
                    }
                    catch (e) {
                        try { createToast(reponse.message[lang as keyof typeof reponse.message], '', 2); }
                        catch (e) { throw e; }
                    }

                    closeModal();

                } else {
                    try { createToast(reponse.message[lang as keyof typeof reponse.message], '', 2); }
                    catch (e) { throw e; }

                }
            }).catch((e) => {
                try { createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2); }
                catch (e) { throw e; }
            })

        } else {

            //
            //
            //
            // update admin
            await apiUpdateAdministrateur(
                { _id: enseignant!._id.toString(), ...dataForm },
            ).then((reponse: ReponseApiPros) => {
                if (reponse.success) {
                    try {
                        dispatch(updateAdmin({ newAdmin: { ...reponse.data } }));
                        createToast(reponse.message[lang as keyof typeof reponse.message], '', 0);
                    }
                    catch (e) {


                        try { createToast(reponse.message[lang as keyof typeof reponse.message], '', 2); }
                        catch (e) { throw e; }
                    }
                    closeModal();

                } else {

                    try { createToast(reponse.message[lang as keyof typeof reponse.message], '', 2); }
                    catch (e) { throw e; }
                }
            }).catch((e) => {

                try { createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2); }
                catch (e) { throw e; }
            })
        }



    }

    useEffect(() => {
        setErrorNom('')
    }, [nom])
    useEffect(() => {
        setErrorGenre('')
    }, [genre])
    useEffect(() => {
        setErrorEmail('')
    }, [email])


    useEffect(() => {
        // UPDATE
        if (enseignant) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.administrateur'));
            setMatricule(enseignant.matricule ? enseignant.matricule.toString() : "");
            setNom(enseignant.nom);
            setPrenom(enseignant.prenom);
            setGenre(enseignant.genre);
            setDateNaiss(enseignant.date_naiss ? enseignant.date_naiss.toString() : "");
            setLieuNaiss(enseignant.lieu_naiss);
            setEmail(enseignant.email);
            setContact(enseignant.contact);

            const currentGrade = services.find(grade => (grade._id === enseignant.grade));
            setGrade(currentGrade);

            const currentCategorie = services.find(categorie => (categorie._id === enseignant.categorie));
            setCategorie(currentCategorie);

            const currentFonction = services.find(fonction => (fonction._id === enseignant.fonction));
            setFonction(currentFonction);

            const currentSerivce = services.find(service => (service._id === enseignant.service));
            setService(currentSerivce);

            const currentRegion = regions.find(region => (region._id === enseignant.region));
            setRegion(currentRegion);

            const currentDepartement = departements.find(departement => (departement._id === enseignant.departement));
            setDepartement(currentDepartement);

            const currentCommune = communes.find(commune => (commune._id === enseignant.commune));
            setCommune(currentCommune);
            setDateEntreeAdmin(enseignant.date_entree ? enseignant.date_entree.toString() : "");

        }
        // CREATE
        else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.administrateur'));
            setNom("");
            setPrenom("");
            setGenre("");
            setDateNaiss("");
            setLieuNaiss("");
            setEmail("");
            setContact("");
            setMatricule("");
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
            setIsFirstRender(false);
        }
    }, [enseignant, isFirstRender, t]);


    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleSubmit}
            >


                {/* MATRICULE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.matricule')} />
                    <Input
                        type="text"
                        placeholder={t('label.matricule')}
                        value={matricule}
                        setValue={setMatricule}
                    />
                </div>


                {/* NOM */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.nom')} required={true} />
                    <Input
                        type="text"
                        placeholder={t('label.nom')}
                        value={nom}
                        setValue={setNom}
                    />
                    {errorNom && <ErrorInput title={errorNom} />}
                </div>


                {/* PRENOM */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.prenom')} />
                    <Input
                        type="text"
                        placeholder={t('label.prenom')}
                        value={prenom}
                        setValue={setPrenom}
                    />
                </div>


                {/* GENRE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.genre')} required={true} />
                    <div>
                        <input
                            className='radio-label-space'
                            type="radio"
                            id={t('label.homme')}
                            name="genre"
                            value={t('label.homme')}
                            checked={genre === "m"}
                            onChange={() => { setGenre("m"); setErrorGenre("") }}
                        />
                        <label htmlFor={t('label.homme')} className='radio-intern-space'>{t('label.homme')}</label>

                        <input
                            className='radio-label-space'
                            type="radio"
                            id={t('label.femme')}
                            name="genre"
                            value={t('label.femme')}
                            checked={genre === "f"}
                            onChange={() => { setGenre("f"); setErrorGenre("") }}
                        />
                        <label htmlFor={t('label.femme')}>{t('label.femme')}</label>
                    </div>
                    {errorGenre && <ErrorInput title={errorGenre} />}
                </div>


                {/* EMAIL */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.email')} required={true} />
                    <Input
                        type="email"
                        placeholder={t('label.email')}
                        value={email}
                        setValue={setEmail}
                    />
                    {errorEmail && <ErrorInput title={errorEmail} />}
                </div>


                {/* CONTACT */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.contact')} />
                    <Input
                        type="text"
                        placeholder={t('label.contact')}
                        value={contact}
                        setValue={setContact}
                    />
                </div>


                {/* DATE DE NAISSANCE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.date_naiss')} />
                    <Input
                        type="date"
                        placeholder={t('label.email')}
                        value={dateNaiss}
                        setValue={setDateNaiss}
                    />
                </div>


                {/* LIEU DE NAISSANCE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.lieu_naiss')} />
                    <Input
                        type="text"
                        placeholder={t('label.lieu_naiss')}
                        value={lieuNaiss}
                        setValue={setLieuNaiss}
                    />
                </div>


                {/* FONCTION */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.fonction')} />
                    <Select
                        value={fonction ? (lang === 'fr' ? fonction.libelleFr : fonction.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}
                        list={fonctions}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}
                        handleGradeChange={handleFonctionChange}
                    />
                </div>


                {/* GRADE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.grade')} />
                    <Select
                        value={grade ? (lang === 'fr' ? grade.libelleFr : grade.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                        list={grades}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                        handleGradeChange={handleGradeChange}
                    />
                </div>


                {/* CATEGORIE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.categorie')} />
                    <Select
                        value={categorie ? (lang === 'fr' ? categorie.libelleFr : categorie.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}
                        list={categories}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}
                        handleGradeChange={handleCategorieChange}
                    />
                </div>


                {/* SERVICE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.service')} />
                    <Select
                        value={service ? (lang === 'fr' ? service.libelleFr : service.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}
                        list={services}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}
                        handleGradeChange={handleServiceChange}
                    />
                </div>


                {/* REGION */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.region')} />
                    <Select
                        value={region ? (lang === 'fr' ? region.libelleFr : region.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                        list={regions}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                        handleGradeChange={handleRegionChange}
                    />
                </div>


                {/* DEPARTEMENT */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.departement')} />
                    <Select
                        value={departement ? (lang === 'fr' ? departement.libelleFr : departement.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                        list={departements}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                        handleGradeChange={handleDepartementChange}
                    />
                </div>


                {/* COMMUNE */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.commune')} />
                    <Select
                        value={commune ? (lang === 'fr' ? commune.libelleFr : commune.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
                        list={communes}
                        optionText={t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
                        handleGradeChange={handleCommuneChange}
                    />
                </div>


                {/* DATE ENTREE DANS L'ADMINISTRATION */}
                <div className="mb-4 w-full ">
                    <LabelInput title={t('label.date_entree_admin')} />
                    <Input
                        type="date"
                        placeholder={t('label.date_entree_admin')}
                        value={dateEntreeAdmin}
                        setValue={setDateEntreeAdmin}
                    />
                </div>
            </CustomDialogModal>
        </>
    );

}