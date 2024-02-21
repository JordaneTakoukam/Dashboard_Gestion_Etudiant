import { ReactNode, useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { Region } from "../../pages/Admin/Regions";
import { Departement } from "../../pages/Admin/Departements";
import { Commune } from "../../pages/Admin/Communes";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { RiMapPin2Fill } from "react-icons/ri";

import { FaBirthdayCake } from "react-icons/fa";

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
}

function LabelInput({ title }: LabelInputProps) {
    return (
        <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="fullName"
        >
            {title}
        </label>
    );
}




function ProfileInformation() {
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

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();

    // erreur
    const [errorNom, setErrorNom] = useState("");
    const [errorPrenom, setErrorPrenom] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorContact, setErrorContact] = useState("");

    const [errorLieuNaiss, setErrorLieuNaiss] = useState("");
    const [errorDateNaiss, setErrorDateNaiss] = useState("");
    const [errorDepartement, setErrorDepartement] = useState("");
    const [errorCommune, setErrorCommune] = useState("");


    const handleUpdateProfil = () => {
        // Vérification des champs obligatoires
        if (nom.trim() === '') {
            setErrorNom("Le champ Nom ne peut pas être vide.");
        } else {
            setErrorNom(""); // Effacer l'erreur s'il n'y a pas de problème
        }

        if (prenom.trim() === '') {
            setErrorPrenom("Le champ Prénom ne peut pas être vide.");
        } else {
            setErrorPrenom(""); // Effacer l'erreur s'il n'y a pas de problème
        }

        if (genre.trim() === '') {
            setErrorGenre("La sélection du genre est obligatoire.");
        } else {
            setErrorGenre(""); // Effacer l'erreur s'il n'y a pas de problème
        }

        if (contact.trim() === '') {
            setErrorContact("Le champ Contact ne peut pas être vide.");
        } else {
            setErrorContact(""); // Effacer l'erreur s'il n'y a pas de problème
        }

        if (email.trim() === '') {
            setErrorEmail("Le champ e-mail ne peut pas être vide.");
        } else {
            setErrorEmail(""); // Effacer l'erreur s'il n'y a pas de problème
        }


    }


    return (
        <div className="col-span-5 xl:col-span-3 ">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Informations personnelles
                    </h3>
                </div>
                <div className="px-7 py-7 lg:py-[30px] ">
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        {/* NOM */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={'Nom'} />

                            <div className="relative">
                                <IconeInput icone={<GoPerson />} />

                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)} // Suppression du setNom("") dans onChange
                                />
                            </div>
                            {errorNom && <p className="text-red-500 pt-2 text-sm " >{errorNom}</p>}
                        </div>



                        {/* PRENOM */}
                        <div className="w-full sm:w-1/2">
                            <LabelInput title={'Prénom'} />

                            <div className="relative">
                                <IconeInput icone={<GoPerson />} />

                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    value={prenom}
                                    onChange={(e) => setPrenom(e.target.value)} // Suppression du setNom("") dans onChange
                                />
                            </div>
                            {errorPrenom && <p className="text-red-500 pt-2 text-sm " >{errorPrenom}</p>}
                        </div>
                    </div>


                    {/* numero de telephone */}
                    <div className="w-full mb-5.5">
                        <LabelInput title={'Contact'} />

                        <div className="relative">
                            <IconeInput icone={<MdOutlinePhone />} />

                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="phone"
                                value={contact}
                                onChange={(e) => { setContact(e.target.value); }}
                            />
                        </div>
                        {errorContact && <p className="text-red-500 pt-2 text-sm " >{errorContact}</p>}
                    </div>



                    {/* numero de telephone */}
                    <div className="w-full mb-5.5">
                        <LabelInput title={'Email'} />

                        <div className="relative">
                            <IconeInput icone={<MdOutlineMail />} />

                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); }}
                            />
                        </div>
                        {errorEmail && <p className="text-red-500 pt-2 text-sm " >{errorEmail}</p>}
                    </div>


                    {/* genre */}
                    <div className="w-full mb-5.5">
                        <LabelInput title={'Genre'} />

                        <div className="relative">
                            {/* <IconeInput icone={<MdOutlineMail />} /> */}
                            <div className="">
                                <input
                                    className='radio-label-space'
                                    type="radio"
                                    id="homme"
                                    name="genre"
                                    value="Homme"
                                    checked={true}
                                    onChange={() => { }}
                                />
                                <label htmlFor="homme" className='radio-intern-space font-semibold'>Homme</label>

                                <input
                                    className='radio-label-space'
                                    type="radio"
                                    id="femme"
                                    name="genre"
                                    value="Femme"
                                    checked={genre === "F"}
                                    onChange={() => { }}
                                />
                                <label className="font-semibold" htmlFor="femme">Femme</label>
                            </div>
                        </div>
                        {errorGenre && <p className="text-red-500 pt-2 text-sm " >{errorGenre}</p>}
                    </div>

                    {/* date de naissance */}
                    <div className="w-full mb-5.5">
                        <LabelInput title={'Date de naissance'} />

                        <div className="relative">
                            <IconeInput icone={<FaBirthdayCake />} />


                            <  input
                                className=" py-3 pl-13  w-full rounded border border-stroke bg-gray pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="date"
                                value={dateNaiss}
                                onChange={(e) => setDateNaiss(e.target.value)}
                            />
                        </div>
                        {/* {errorEmail && <p className="text-red-500 pt-2 text-sm " >{errorEmail}</p>} */}
                    </div>

                    {/* lieu de naissance */}
                    <div className="w-full mb-5.5">
                        <LabelInput title={'Lieu de naissance'} />

                        <div className="relative">
                            <IconeInput icone={<RiMapPin2Fill />} />

                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                value={lieuNaiss}
                                onChange={(e) => { setLieuNaiss(e.target.value); }}
                            />
                        </div>
                        {errorLieuNaiss && <p className="text-red-500 pt-2 text-sm " >{errorLieuNaiss}</p>}
                    </div>







                    {/* bouton valider !! */}
                    <div className="flex justify-end gap-4.5 pt-0 lg:pt-[75px]">
                        <button
                            className="text-sm mt-8 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            onClick={handleUpdateProfil} >
                            Mettre à jour mes informations
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfileInformation