import { ReactNode, useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { Region, regions } from "../../pages/Admin/Regions";
import { Departement, departements } from "../../pages/Admin/Departements";
import { Commune, communes } from "../../pages/Admin/Communes";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { RiMapPin2Fill } from "react-icons/ri";

import { FaBirthdayCake } from "react-icons/fa";
import { Categorie, categories } from "../../pages/Admin/Categories";
import { Fonction, fonctions } from "../../pages/Admin/Fonctions";
import { Grade, grades } from "../../pages/Admin/Grades";
import { Service, services } from "../../pages/Admin/Services";
import { useTranslation } from "react-i18next";

interface Props {
    icone: ReactNode; // Type de la variable icone
}

function IconeInput({ icone }: Props) {
    return (
        <div className="absolute left-4.5 top-4 text-[22px]">
            <div className="fill-current">
                {icone}
            </div>
        </div>
    );
}


interface LabelInputProps {
    title: string;
    required?:boolean;
}

function LabelInput({ title, required }: LabelInputProps) {
    return (
        <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="fullName"
        >
            {title}{required?<label className="text-red-500"> *</label>:""}
        </label>
    );
}




function ProfileInformation() {
    const {t}=useTranslation();
    const [user, setUser] = useState({
        nom: "John",
        prenom: "Doe",
        email: "johndoe@gmail.com",
        genre: "m",
        contact: "+237611223344",
        dateNaiss: "2000-07-22",
        lieuNaiss: "Yaoundé"
    });

    useEffect(() => {
        setNom(user.nom);
        setPrenom(user.prenom);
        setContact(user.contact);
        setEmail(user.email);
        setGenre(user.genre);
        setDateNaiss(user.dateNaiss);
        setLieuNaiss(user.lieuNaiss);
    }, [user]);
    const [matricule, setMatricule] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [grade, setGrade] = useState<Grade>();
    const [service, setService] = useState<Service>();
    const [fonction, setFonction] = useState<Fonction>();
    const [categorie, setCategorie] = useState<Categorie>();
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();
    const [dateEntreeAdmin, setDateEntreeAdmin] = useState("");

    // erreur
    const [errorNom, setErrorNom] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
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

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorEmail(t('error.incorrect_email'));
            return false;
        }
        setErrorEmail("");
        return true;
    };

    const handleUpdateProfil = () => {
        // Vérification des champs obligatoires
        if (!nom || !genre || !email) {
            if (!nom) {
                setErrorNom(t('error.nom'));
            }else{
                setErrorNom("");
            }
            if (!genre) {
                setErrorGenre(t('error.genre'));
            }else{
                setErrorGenre("");
            }
    
            if (!email) {
                setErrorEmail(t('error.email'));
            }else{
                setErrorEmail("");
            }
            
            return;
        }
        if (!validateEmail()) {
            return;
        }


    }


    return (
        <div className="col-span-5 xl:col-span-3 ">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        {t('label.info_pers')}
                    </h3>
                </div>
                <div className="px-7 py-7 lg:py-[30px] ">
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        {/* matricule */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.matricule')} />

                            <div className="relative">
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    value={matricule}
                                    onChange={(e) => setMatricule(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Date entrée admin */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.date_entree_admin')} />

                            <div className="relative">
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="date"
                                    value={dateEntreeAdmin}
                                    onChange={(e) => {setDateEntreeAdmin(e.target.value)}}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        {/* NOM */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.nom')} required={true}/>

                            <div className="relative">
                                <IconeInput icone={<GoPerson />} />

                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    value={nom}
                                    onChange={(e) => {setNom(e.target.value); setErrorNom("")}} // Suppression du setNom("") dans onChange
                                />
                            </div>
                            {errorNom && <p className="text-red-500 pt-2 text-sm " >{errorNom}</p>}
                        </div>



                        {/* PRENOM */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.prenom')} />

                            <div className="relative">
                                <IconeInput icone={<GoPerson />} />

                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    value={prenom}
                                    onChange={(e) => setPrenom(e.target.value)} // Suppression du setNom("") dans onChange
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        {/* Contact */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.contact')} />
                            <div className="relative">
                                <IconeInput icone={<MdOutlinePhone />} />
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="phone"
                                    value={contact}
                                    onChange={(e) => { setContact(e.target.value); }}
                                />
                            </div>
                        </div>



                        {/* E-mail */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.email')} required={true}/>

                            <div className="relative">
                                <IconeInput icone={<MdOutlineMail />} />

                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrorEmail("")}}
                                />
                            </div>
                            {errorEmail && <p className="text-red-500 pt-2 text-sm " >{errorEmail}</p>}
                        </div>
                    </div>

                    {/* genre */}
                    <div className="w-full mb-5.5">
                        <LabelInput title={t('label.genre')} required={true}/>

                        <div className="relative">
                            {/* <IconeInput icone={<MdOutlineMail />} /> */}
                            <div className="">
                                <input
                                    className='radio-label-space'
                                    type="radio"
                                    id={t('label.homme')}
                                    name="genre"
                                    value={t('label.homme')}
                                    checked={true}
                                    onChange={() => { }}
                                />
                                <label htmlFor={t('label.homme')} className='radio-intern-space font-semibold'>{t('label.homme')}</label>

                                <input
                                    className='radio-label-space'
                                    type="radio"
                                    id={t('label.femme')}
                                    name="genre"
                                    value={t('label.femme')}
                                    checked={genre === "F"}
                                    onChange={() => { }}
                                />
                                <label className="font-semibold" htmlFor={t('label.femme')}>{t('label.femme')}</label>
                            </div>
                        </div>
                        {errorGenre && <p className="text-red-500 pt-2 text-sm " >{errorGenre}</p>}
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        {/* Date de naissance */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.date_naiss')} />

                            <div className="relative">
                                <IconeInput icone={<FaBirthdayCake />} />
                                <  input
                                    className=" py-3 pl-13  w-full rounded border border-stroke bg-gray pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="date"
                                    value={dateNaiss}
                                    onChange={(e) => setDateNaiss(e.target.value)}
                                />
                            </div>
                        </div>



                        {/* lieu de naissance */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.lieu_naiss')} />

                            <div className="relative">
                                <IconeInput icone={<RiMapPin2Fill />} />

                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    value={lieuNaiss}
                                    onChange={(e) => { setLieuNaiss(e.target.value); }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        {/* Grade */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.grade')} />

                            <div className="relative">
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
                            </div>
                        </div>
                        {/* Catégorie */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.categorie')} />

                            <div className="relative">
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
                            </div>
                        </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        {/* Fonction */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.fonction')} />

                            <div className="relative">
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
                            </div>
                        </div>
                        {/* Service */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={t('label.servie')} />

                            <div className="relative">
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
                            </div>
                        </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        {/* Région */}
                        <div className="w-full sm:w-1/3">
                            <LabelInput title={t('label.region')} />

                            <div className="relative">
                                <select
                                    value={region ? region.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.region')}
                                    onChange={handleRegionChange}
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.region')}</option>
                                    {regions.map(region => (
                                        <option key={region.id} value={region.libelle}>{region.libelle}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Département */}
                        <div className="w-full sm:w-1/3">
                            <LabelInput title={t('label.departement')} />

                            <div className="relative">
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
                            </div>
                        </div>
                        {/* Commune */}
                        <div className="w-full sm:w-1/3">
                            <LabelInput title={t('label.commune')} />

                            <div className="relative">
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
                            </div>
                        </div>
                    </div>






                    {/* bouton valider !! */}
                    <div className="flex justify-end gap-4.5 pt-0 ">
                        <button
                            className="text-sm mt-8 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            onClick={handleUpdateProfil} >
                            {t('boutton.mettre_a_jour_info')}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfileInformation