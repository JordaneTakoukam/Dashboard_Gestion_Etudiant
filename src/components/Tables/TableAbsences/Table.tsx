import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import { setShowModal, setShowModalCreate } from "../../../_redux/features/setting_slice";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { Enseignant } from "../../../pages/Admin/ListeEnseignants";
import { Etudiant } from "../../../pages/Admin/ListeEtudiants";

export function nbTotal(data: Etudiant | Enseignant, semestre:number) {
    // Filtrer les abscences pour le semestre spécifié
    const abscencesSemestre = data.abscences.filter(abscence => abscence.semestre === semestre);

    // Initialiser le nombre total d'heures d'abscence
    let totalHeuresAbscence = 0;

    // Parcourir les abscences du semestre
    abscencesSemestre.forEach(abscence => {
        // Extraire les heures et les minutes du début et de la fin de la période d'abscence
        const debutHeureMinute = abscence.debutPeriode.split(':');
        const finHeureMinute = abscence.finPeriode.split(':');

        // Convertir les heures et les minutes en millisecondes
        const debutEnMillisecondes = (parseInt(debutHeureMinute[0]) * 60 + parseInt(debutHeureMinute[1])) * 60 * 1000;
        const finEnMillisecondes = (parseInt(finHeureMinute[0]) * 60 + parseInt(finHeureMinute[1])) * 60 * 1000;

        // Calculer la différence en heures entre debutPeriode et finPeriode
        const differenceHeures = (finEnMillisecondes - debutEnMillisecondes) / (1000 * 60 * 60); // Millisecondes en heures

        // Ajouter la différence calculée au total des heures d'abscence
        totalHeuresAbscence += differenceHeures;
    });

    return totalHeuresAbscence;
}

interface TableProps {
    data: Etudiant | Enseignant;
    onEdit: (user: Etudiant | Enseignant | null) => void;
}

const Table = ({ data, onEdit}:TableProps) => {
    const pageIsLoading = false;
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreSection, setFiltreSemestre] = useState("");
    const [formatToDownload, setFormatToDownload] = useState("");
  

    const handleAnneeSelect = (selected: string) => {
        setFiltreAnnee(selected);
        console.log(selected)
    };
    const handleSemestreSelect = (selected: string) => {
        setFiltreSemestre(selected);
        console.log(selected);
    };
    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };


    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.abscences.slice(indexOfFirstItem, indexOfLastItem);
    

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title="Signaler mon abscence"
                    onClick={() => {onEdit(data); dispatch(setShowModal()) }}
                />
                <h5>Heure d'abscence total : {nbTotal(data, 1)} heure(s)</h5>
                {/* <InputSearch hintText="Rechercher une matière" onSubmit={() => { }} /> */}
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>Filtrer la liste des abscences suivant : </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> Filtrer</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} />
                            
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    {nbTotal(data, 1)>0? <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : data.abscences.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data.abscences} />
                        }
                    </table>:<h1>Aucune abscence enregistrée pour ce semestre</h1>}
                </div>

                {/* Pagination */}

                {nbTotal(data, 1)>0?<h1>Pagination ici</h1>:""}

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;