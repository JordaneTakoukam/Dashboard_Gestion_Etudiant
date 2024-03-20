import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal, setShowModalCreate } from "../../../_redux/features/setting";
import { useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { FaFilter, FaSort } from "react-icons/fa6";
import { Commune } from "../../../pages/Admin/Communes";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { CommonSettingProps, DepartementProps } from "../../../_types/data_setting_type";

interface TableCommuneProps {
    data: Commune[];
    onCreate: () => void;
    onEdit: (commune: Commune) => void;
}


const Table = ({ data, onCreate, onEdit }: TableCommuneProps) => {
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departement) ?? [];

    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.region) ?? [];

    const pageIsLoading = false;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreRegion, setFiltreRegion] = useState(regions[0]);
    const [filtreDepartement, setFiltreDepartement] = useState(departements[0]);
    const handleRegionSelect = (selected: CommonSettingProps | undefined) => {
        // setFiltreRegion(selected);
        console.log(selected);
    };

    const handleDepartementSelect = (selected: DepartementProps | undefined) => {
        // setFiltreDepartement(selected);
        console.log(selected);
    };
    // const [filtreCommune, setFiltreCommune] = useState("");
    // const [formatToDownload, setFormatToDownload] = useState("");

    // const handleAnneeSelect = (selected: string) => {
    //     setFiltreAnnee(selected);
    //     console.log(selected)
    // };
    // const handleRegionSelect = (selected: string) => {
    //     setFiltreRegion(selected);
    //     console.log(selected);
    // };

    // const handleDepartementSelect = (selected: string) => {
    //     setFiltreDepartement(selected);
    //     console.log(selected);
    // };

    // const handleCommuneSelect = (selected: string) => {
    //     setFiltreCommune(selected);
    //     console.log(selected);
    // };
    // const handleDownloadSelect = (selected: string) => {
    //     setFormatToDownload(selected);
    //     console.log(selected);
    //     // methode pour download
    // };


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
                <ButtonCreate
                    title={t('boutton.nouvelle_commune')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.commune')} onSubmit={() => { }} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.commune')} </h1>
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.region')}
                                items={regions}
                                defaultValue={regions[0]} // ou spécifie une valeur par défaut
                                displayProperty={(region: CommonSettingProps) => `${region.libelle}`}
                                onSelect={handleRegionSelect}
                            />
                            <CustomDropDown2<any>
                                title={t('label.departement')}
                                items={departements}
                                defaultValue={departements[0]} // ou spécifie une valeur par défaut
                                displayProperty={(departement: Departement) => `${departement.libelle}`}
                                onSelect={handleRegionSelect}
                            />
                            {/* <CustomDropDown title="Région" items={regions} defaultValue={regions[0]} displayProperty={(region: Region) => `${region.libelle}`} onSelect={handleRegionSelect} />
                            <CustomDropDown title="Département" items={departements} defaultValue={departements[0]} displayProperty={(departement: Departement) => `${departement.libelle}`} onSelect={handleDepartementSelect} /> */}
                            {/* <CustomDropDown title="Commune" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleCommuneSelect} /> */}
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.region')}
                                items={regions}
                                defaultValue={regions[0]} // ou spécifie une valeur par défaut
                                displayProperty={(region: CommonSettingProps) => `${region.libelle}`}
                                onSelect={handleRegionSelect}
                            />
                            <CustomDropDown2<any>
                                title={t('label.departement')}
                                items={departements}
                                defaultValue={departements[0]} // ou spécifie une valeur par défaut
                                displayProperty={(departement: Departement) => `${departement.libelle}`}
                                onSelect={handleRegionSelect}
                            />
                            {/* <CustomDropDown title="Région" items={regions} defaultValue={regions[0]} displayProperty={(region: Region) => `${region.libelle}`} onSelect={handleRegionSelect} />
                            <CustomDropDown title="Département" items={departements} defaultValue={departements[0]} displayProperty={(departement: Departement) => `${departement.libelle}`} onSelect={handleDepartementSelect} /> */}
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
                            !pageIsLoading && <BodyTable data={data} onEdit={onEdit} />
                        }




                    </table>
                </div>

                {/* Pagination */}

                <h1>Pagination ici</h1>

            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;