import { useDispatch } from "react-redux";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { Enseignant } from "../../../pages/Admin/ListeEnseignants";
import { Matiere, listMatieres } from "../../../pages/Admin/ListeMatieres";




const Table = ({ data }: { data: Matiere }) => {
    const pageIsLoading = false;
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    //Calcul de la progression de chaque leçon
    const calculateProgress = (matiere : Matiere) => {
        let totalObjectifs = 0;
        let objectifsAvecEtat1 = 0;
    
        matiere.chapitres.forEach((chapitre) => {
            totalObjectifs += chapitre.objectifs.length;
            chapitre.objectifs.forEach((objectif) => {
                if (objectif.etat === 1) {
                    objectifsAvecEtat1++;
                }
            });
        });
    
        const progress = totalObjectifs === 0 ? 0 : (objectifsAvecEtat1 / totalObjectifs) * 100;
    
        return progress.toFixed(2);
    };

    // let matiere:Matiere=listMatieres[0];

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreSection, setFiltreSection] = useState("");
    const [filtreCycle, setFiltreCycle] = useState("");
    const [filtreNiveau, setFiltreNiveau] = useState("");
    const [filtreSemestre, setFiltreSemestre] = useState("");
    const [filtreMatiere, setFiltreMatiere] = useState(listMatieres[0]);
    const [formatToDownload, setFormatToDownload] = useState("");
    const [progress, setProgress] = useState(calculateProgress(listMatieres[0]));

    // Fonction pour calculer la progression en pourcentage



    const handleAnneeSelect = (selected: string) => {
        setFiltreAnnee(selected);
        console.log(selected)
    };
    const handleSectionSelect = (selected: string) => {
        setFiltreSection(selected);
        console.log(selected);
    };

    const handleCycleSelect = (selected: string) => {
        setFiltreCycle(selected);
        console.log(selected);
    };

    const handleNiveauSelect = (selected: string) => {
        setFiltreNiveau(selected);
        console.log(selected);
    };

    const handleSemestreSelect = (selected: string) => {
        setFiltreSemestre(selected);
        console.log(selected);
    };

    const handleMatiereSelect = (selected: Matiere) => {
        setFiltreMatiere(selected);
        setProgress(calculateProgress(selected));
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
    // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            {/* <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch hintText="Rechercher un enseignant" onSubmit={() => { }} />
            </div> */}
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>Afficher la progression dans la matière suivant : </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> Filtrer</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Section" items={['Douane', 'Impôt']} defaultValue="Douane" onSelect={handleSectionSelect} />
                            <CustomDropDown title="Cycle" items={['Cycle A', 'Cycle B']} defaultValue="Cycle A" onSelect={handleCycleSelect} />
                            <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} />
                            <CustomDropDown title="Matiere" items={listMatieres} defaultValue={listMatieres[0]} displayProperty={(matiere: Matiere) => `${matiere.code} : ${matiere.libelle}`} onSelect={handleMatiereSelect} />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Section" items={['Douane', 'Impôt']} defaultValue="Douane" onSelect={handleSectionSelect} />
                            <CustomDropDown title="Cycle" items={['Cycle A', 'Cycle B']} defaultValue="Cycle A" onSelect={handleCycleSelect} />
                            <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} />
                            <CustomDropDown title="Matière" items={listMatieres} defaultValue={listMatieres[0]} displayProperty={(matiere: Matiere) => `${matiere.code} : ${matiere.libelle}`} onSelect={handleMatiereSelect} />
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <h1>Progress Bar ici : {progress}</h1>
                </div>


                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            // pageIsLoading ?
                            //     <LoadingTable />
                            //     : data.length === 0 ?
                            //         <NoDataTable /> :
                                    <HeaderTable matiere={filtreMatiere} />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filtreMatiere} />
                        }




                    </table>
                </div>

                {/* Pagination */}

                <h1>Pagination ici</h1>

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;