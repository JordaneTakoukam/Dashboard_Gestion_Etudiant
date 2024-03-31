import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal, setShowModalCreate } from "../../../_redux/features/setting";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import Pagination from "../../Pagination/Pagination";
import { setEvenementLoading, setEvenements, setErrorPageEvenement } from "../../../_redux/features/evenement_slice";
import { getEvenementsByYear } from "../../../api/api_evenement";
import createToast from "../../../hooks/toastify";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";


interface TableEvenementProps {
    data: EvenementType[];
    onCreate: () => void;
    onEdit: (evenement: EvenementType) => void;
}

const Table = ({ data, onCreate, onEdit }: TableEvenementProps) => {
    const { t } = useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.evenementSlice.pageIsLoading);
    const dispatch = useDispatch();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024; 

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [selectedYear, setSelectedYear] = useState<number>(currentYear); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [formatToDownload, setFormatToDownload] = useState("");

    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
        }
        
        console.log(selectedYear)
    };
    const [searchText, setSearchText] = useState<string>('');
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    // Filtrer les évènement en fonction de la langue
    const filterEventByContent = (evenements: EvenementType[]) => {
        if (searchText === '') {
            const result: EvenementType[] = evenements;
            return result;
        }
        return evenements.filter(evenement => {
            const libelle = lang === 'fr' ? evenement.libelleFr : evenement.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return evenement.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };


    // variable pour la pagination
    //
    
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

     // variable pour la pagination
     const itemsPerPage = useSelector((state: RootState) => state.evenementSlice.data.pageSize);; // nombre delements maximum par page
     const [currentPage, setCurrentPage] = useState<number>(1);
 
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
     const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // remplacer les donnes de body du tableau par ceci !
     const count =useSelector((state: RootState) => state.evenementSlice.data.totalItems);
     const handlePageClick = (pageNumber: number) => {
         setCurrentPage(pageNumber);
     };
     // Render page numbers
     const pageNumbers = [];
     for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
         pageNumbers.push(i);
     }
 
     const hasPrevious = currentPage > 1;
     const hasNext = currentPage < Math.ceil(count / itemsPerPage);
 
     const startItem = currentPage === Math.ceil(count / itemsPerPage) ? count - itemsPerPage + 1 : indexOfFirstItem + 1;
     const endItem = Math.min(count, indexOfLastItem);

     // Fonction pour récupérer les événements en fonction de l'année et de la page actuelle
    const fetchEvenements = async (annee: number, page: number) => {
        dispatch(setEvenementLoading(true)); // Définissez le loading à true avant le chargement
        try {
            const fetchedEvenements = await getEvenementsByYear({ annee: annee, page: page });
            // Mettez à jour l'état Redux avec les données récupérées
            dispatch(setEvenements(fetchedEvenements));
            // console.log(fetchedEvenements.evenements[0].etat);

            dispatch(setErrorPageEvenement(null)); // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEvenement(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEvenementLoading(false)); // Définissez le loading à false après le chargement
        }
    };

    // Effet pour récupérer les événements initiaux lorsque le composant est monté ou lorsque la page change
    useEffect(() => {
        const annee = selectedYear; // Remplacez par l'année souhaitée
        fetchEvenements(annee, currentPage);
    }, [currentPage, selectedYear]); // Déclencher l'effet lorsque currentPage change

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<EvenementType[]>(data);

    useEffect(() => {
        const result = filterEventByContent(data);
        setFilteredData(result);
    }, [searchText, data]);

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {roles.admin === userRole || roles.superAdmin === userRole && (<ButtonCreate
                    title={t('boutton.nouvel_evenement')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.evenement')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.evenement')}</h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
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
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />
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
                            : filteredData.length === 0 ?
                                <NoDataTable /> :
                                <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} /> 
                        }




                    </table>
                </div>

                {/* Pagination */}

                <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}

                />

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;