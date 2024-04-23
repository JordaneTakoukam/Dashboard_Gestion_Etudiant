import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import { setShowModal, setShowModalCreate } from "../../../_redux/features/setting";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { extractYear, formatYear, generateYearRange, nbTotalAbsences } from "../../../fonctions/fonction";
import { apiGetAbsencesByUserAndFilter } from "../../../api/discipline/api_discipline";
import { updateUserAbsences } from "../../../_redux/features/user_slice";



interface TableProps {
    data: AbsenceType[];
    onEdit: (user: UserState | null) => void;
}

const Table = ({ data, onEdit }: TableProps) => {
    const { t } = useTranslation();
    const pageIsLoading = false;
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemester);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreSection, setFiltreSemestre] = useState("");
    const [formatToDownload, setFormatToDownload] = useState("");


    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
        }
    };
    const handleSemestreSelect = (selected: number | undefined) => {
        if(selected){
            setSelectedSemestre(selected);
        }
    };
    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };
    const currentUser = useSelector((state: RootState) => state.user);
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const absences = await apiGetAbsencesByUserAndFilter({ userId: currentUser._id, annee: selectedYear, semestre: selectedSemestre });
                if(absences){
                    dispatch(updateUserAbsences(absences));
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [dispatch, selectedSemestre, selectedYear, currentUser.absences, t]);


    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data && data.slice(indexOfFirstItem, indexOfLastItem);
    

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.signaler_absence')}
                    onClick={() => { onEdit(currentUser); dispatch(setShowModal()) }}
                />
                <h5>{t('label.total_heure_absence')} : {nbTotalAbsences(data)} {t('label.heure')}(s)</h5>
                {/* <InputSearch hintText="Rechercher une matière" onSubmit={() => { }} /> */}
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.absence')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2]}
                                defaultValue={1} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} /> */}
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
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2]}
                                defaultValue={1} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} /> */}

                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    {<table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : data && data.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data} />
                        }
                    </table>}
                </div>

                {/* Pagination */}

                {/* {nbTotal(data, 1) > 0 ? <h1>Pagination ici</h1> : ""} */}

            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;