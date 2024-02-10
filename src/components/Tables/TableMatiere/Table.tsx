import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal, setShowModalCreate } from "../../../_redux/features/setting_slice";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { Matiere } from "../../../pages/Admin/ListeMatieres";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { Cycle, cycles } from "../../../pages/Admin/Cycles";
import { Niveau, niveaux } from "../../../pages/Admin/Niveaux";
import { Section, sections } from "../../../pages/Admin/Sections";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";

interface TableMatiereProps {
    data: Matiere[];
    onCreate:()=>void;
    onEdit: (matiere : Matiere) => void;
    onAddChap:(matiere : Matiere)=>void;
}

const Table = ({ data, onCreate, onEdit, onAddChap }: TableMatiereProps) => {
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
    const [filtreSection, setFiltreSection] = useState("");
    const [filtreCycle, setFiltreCycle] = useState("");
    const [filtreNiveau, setFiltreNiveau] = useState("");
    const [formatToDownload, setFormatToDownload] = useState("");

    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        console.log(selected)
    };
    
    const handleSectionSelect = (selected: Section | undefined) => {
        // setFiltreSection(selected);
        console.log(selected);
    };

    const handleCycleSelect = (selected: Cycle | undefined) => {
        // setFiltreCycle(selected);
        console.log(selected);
    };
    
    const handleNiveauSelect = (selectedNiveau: Niveau | undefined) => {
        // Logique à exécuter lorsque le niveau est sélectionné
        // console.log("Niveau sélectionné :", selectedNiveau);
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
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {roles.admin === userRole && (<ButtonCreate
                    title="Nouvelle matière"
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText="Rechercher une matière" onSubmit={() => { }} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>Filtrer la liste des matières suivant : </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> Filtrer</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title="Année"
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<Section>
                                title="Section"
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: Section) => `${section.libelle}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<Cycle>
                                title="Cycle"
                                items={cycles}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: Cycle) => `${cycle.libelle}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<Niveau>
                                title="Niveau"
                                items={niveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: Niveau) => `${niveau.libelle}`}
                                onSelect={handleNiveauSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Section" items={['Douane', 'Impôt']} defaultValue="Douane" onSelect={handleSectionSelect} />
                            <CustomDropDown title="Cycle" items={['Cycle A', 'Cycle B']} defaultValue="Cycle A" onSelect={handleCycleSelect} />
                            <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauSelect} /> */}
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                        <CustomDropDown2<String>
                                title="Année"
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<Section>
                                title="Section"
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: Section) => `${section.libelle}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<Cycle>
                                title="Cycle"
                                items={cycles}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: Cycle) => `${cycle.libelle}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<Niveau>
                                title="Niveau"
                                items={niveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: Niveau) => `${niveau.libelle}`}
                                onSelect={handleNiveauSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Section" items={['Douane', 'Impôt']} defaultValue="Douane" onSelect={handleSectionSelect} />
                            <CustomDropDown title="Cycle" items={['Cycle A', 'Cycle B']} defaultValue="Cycle A" onSelect={handleCycleSelect} />
                            <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauSelect} /> */}
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : data.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data} onEdit={onEdit} onAddChap={onAddChap}/>
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