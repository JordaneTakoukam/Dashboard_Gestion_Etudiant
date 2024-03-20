import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { CommonSettingProps, DepartementProps } from "../../../_types/data_setting_interface";
import ErrorTable from "../common/ErrorTable";
import FilterButtons from "../../ui/BoutonFiltrer";
import FilterTableSection from "../../ui/FilterTableSection";


interface TableDepartementProps {
    data: DepartementProps[];
    onCreate: () => void;
    onEdit: (departement: DepartementProps) => void;
}

const Table = ({ data, onCreate, onEdit }: TableDepartementProps) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    const { t } = useTranslation();
    const dispatch = useDispatch();


    //
    // fournira les donnees a la page
    const [filteredDepartement, setFilteredDepartement] = useState<DepartementProps[]>([]);

    // valeur de la l'id de la region selectionner
    const [selectRegionId, setSelectIdRegion] = useState<string>('');

    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.region) ?? [];
    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en




    //
    // recuperer l'id de la region suite au click sur l'input select
    const handleRegionSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setSelectIdRegion(selected._id)
        }
    };


    //
    // Filtrer les régions en fonction de la langue
    const filterDepartementByContent = (departements: DepartementProps[]) => {
        return departements.filter(departement => {
            const libelle = lang === 'fr' ? departement.libelleFr : departement.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return departement.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };


    // filtrer les donnee a partir de l'id de la region selectionner
    const filterDepartementByRegion = (regionId: string) => {
        if (regionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: DepartementProps[] = data.filter(depart => depart.region === regionId);

            setFilteredDepartement(result)
        }
    };

    // click sur onCancelFilter
    const onCancelFilter = () => {
        setSelectIdRegion('');
        setFilteredDepartement(data);
    }

    const onApplyFilter = () => {
        filterDepartementByRegion(selectRegionId);
        setSelectIdRegion('');
    }




    // fournir initialement les donnee a la page
    useEffect(() => {
        setFilteredDepartement(data);
    }, [data]);

    // modifier les donner de la page lors de la recherche
    useEffect(() => {
        const result = filterDepartementByContent(data);
        setFilteredDepartement(result);
    }, [searchText]);



    return (
        <div>
            {/* bouton creer ajouter un nouvel eleemts ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouveau_departement')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.departement')} onSubmit={(text) => setSearchText(text)} />

            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                {/*  */}
                <FilterTableSection
                    applyFilter={selectRegionId.length !== 0}
                    text={t('filtre.departement')}
                    onCancelFilter={onCancelFilter}
                    onApplyFilter={onApplyFilter}
                />


                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 max-h-[200px] gap-x-2 ">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.region')}
                                items={regions}
                                displayProperty={(region: CommonSettingProps) => `${lang === 'fr' ? region.libelleFr : region.libelleEn}`}
                                onSelect={handleRegionSelect}
                            />
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
                                displayProperty={(region: CommonSettingProps) => `${lang === 'fr' ? region.libelleFr : region.libelleEn}`}
                                onSelect={handleRegionSelect}
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
                                <LoadingTable /> :
                                pageError ?
                                    <ErrorTable /> :
                                    filteredDepartement.length === 0 ?
                                        <NoDataTable /> :
                                        <HeaderTable />
                        }

                        {/* corp du tableau*/}
                        {
                            !pageIsLoading && <BodyTable data={filteredDepartement} onEdit={onEdit} />
                        }
                    </table>
                </div>


            </div>




        </div>
    );
};


export default Table;