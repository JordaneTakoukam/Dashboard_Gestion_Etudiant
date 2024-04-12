import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { Cycle, cycles } from "../../../pages/Admin/Cycles";
import { Niveau, niveaux } from "../../../pages/Admin/Niveaux";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";

interface TableEnseignantProps {
    data: EnseignantType[];
    onCreate: () => void;
    onEdit: (enseignant: EnseignantType) => void;
}



const Table = ({ data, onCreate, onEdit }: TableEnseignantProps) => {
    const { t } = useTranslation();
    const pageIsLoading = false;
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];

    const [formatToDownload, setFormatToDownload] = useState("");
    // 
    // download
    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };

    //
    // recherche
    const [searchText, setSearchText] = useState<string>('');
    const [listFilterEnseignant, setListFilterEnseignant] = useState<EnseignantType[]>([]);

    const filtrerSearchEnseignant = (enseignants: EnseignantType[]) => {
        return enseignants.filter(enseignant => {
            const libelle = enseignant.nom.toLowerCase() + ' ' + (enseignant.prenom || '').toLowerCase() + ' ' + (enseignant.matricule || '').toLowerCase();
            // Vérifie si le nom ou le prénom contient le texte de recherche
            return libelle.includes(searchText.toLowerCase());
        });
    };


    // initialisation des donnees de la liste
    // Modifier les données de la page lors de la recherche
    useEffect(() => {
        const result = filtrerSearchEnseignant(data);
        setListFilterEnseignant(result);

    }, [searchText, data]);




    // 
    //  tri 
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024;
    const services = useSelector((state: RootState) => state.dataSetting.dataSetting.services) ?? [];
    const fonctions = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions) ?? [];
    const lang = useSelector((state: RootState) => state.setting.language);

    const [selectedYear, setSelectedYear] = useState<number>(currentYear); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filterFonction, setFilterFonction] = useState<CommonSettingProps[]>([]);
    const [filterService, setFilterService] = useState<CommonSettingProps[]>([]);

    const handleAnneeSelect = (selected: String | undefined) => {
        if (selected) { setSelectedYear(extractYear(selected.toString())); }
    };
    const handleFonctionSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            // setSelectIdCycle(selected._id);
            // filterNiveauxByCycle(selected._id);
        }
    };
    const handleServiceSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            // setSelectIdCycle(selected._id);
            // filterNiveauxByCycle(selected._id);
        }
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvel_enseignant')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch
                    hintText={t('recherche.rechercher') + t('recherche.enseignant')}
                    onSubmit={(text) => setSearchText(text)}
                />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.enseignant')}</h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)}
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
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)}
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.fonction')}
                                items={filterFonction}
                                defaultValue={fonctions[0]}
                                onSelect={handleFonctionSelect}
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}

                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.service')}
                                items={filterService}
                                defaultValue={services[0]}
                                onSelect={handleServiceSelect}
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}

                            />
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 mb-4">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />
                        {/* body */}
                        <BodyTable data={listFilterEnseignant} onEdit={onEdit} />
                    </table>
                </div>



                {/* Pagination */}
                {/* <Pagination
                    count={adminState.totalItems}
                    itemsPerPage={adminState.pageSize}
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