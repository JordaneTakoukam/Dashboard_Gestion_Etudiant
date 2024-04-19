import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../common/SearchTable";
import { useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import Pagination from "../../Pagination/Pagination";

interface TableDisciplineProps {
    data: UserDiscipline[];
    onEdit: (enseignant: UserDiscipline, isHourRemove: boolean) => void;
}


const Table = ({ data, onEdit }: TableDisciplineProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024;

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [formatToDownload, setFormatToDownload] = useState("");
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);


    const handleAnneeSelect = (selected: String | undefined) => {
        if (selected) {
            setSelectedYear(extractYear(selected.toString()));
        }
    };


    const handleSemestreSelect = (selected: String | undefined) => {
        // setFiltreSemestre(selected);
        console.log(selected);
    };

    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
    };


    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.enseignant')} onSubmit={() => { }} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.enseignant')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)}
                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<String>
                                title={t('label.semestre')}
                                items={["1", "2"]}
                                defaultValue={"1"}
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)}
                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<String>
                                title={t('label.semestre')}
                                items={["1", "2"]}
                                defaultValue={"1"} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        <HeaderTable />
                        <BodyTable data={data} />
                    </table>
                </div>

                {/* Pagination */}

                {/* <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}

                /> */}
            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;