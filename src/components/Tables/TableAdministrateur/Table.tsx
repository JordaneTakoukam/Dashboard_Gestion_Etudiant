import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { useQuery } from "react-query";
import Pagination from "../../Pagination/Pagination";

interface TableAdministrateurProps {
    data: AdminType[];
    onCreate: () => void;
    onEdit: (administrateur: AdminType) => void;
}



const Table = ({ data, onCreate, onEdit }: TableAdministrateurProps) => {
    const adminState = useSelector((state: RootState) => state.admin.data);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [formatToDownload, setFormatToDownload] = useState("");


    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };


    const [searchText, setSearchText] = useState<string>('');
    const [listFilterAdmin, setListFilterAdmin] = useState<AdminType[]>([]);

    const filtrerSearchAdmin = (administrateurs: AdminType[]) => {
        return administrateurs.filter(admin => {
            const libelle = admin.nom.toLowerCase() + ' ' + (admin.prenom || '').toLowerCase() + ' ' + (admin.matricule || '').toLowerCase();
            // Vérifie si le nom ou le prénom contient le texte de recherche
            return libelle.includes(searchText.toLowerCase());
        });
    };

    // Modifier les données de la page lors de la recherche
    useEffect(() => {
        const result = filtrerSearchAdmin(data);
        setListFilterAdmin(result);
    }, [searchText]);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // gestion de la pagination
    // const [currentPage, setCurrentPage] = useState<number>(1);
    // const indexOfLastItem = currentPage * adminState.pageSize;
    // const indexOfFirstItem = Math.max(0, indexOfLastItem - adminState.pageSize);
    // const startItem = currentPage === Math.ceil(adminState.totalItems / adminState.pageSize) ? adminState.totalItems - adminState.pageSize + 1 : indexOfFirstItem + 1;
    // const endItem = Math.min(adminState.totalItems, indexOfLastItem);
    // const hasNext = currentPage < Math.ceil(adminState.totalItems / adminState.pageSize);
    // const hasPrevious = currentPage > 1;

    // // Render page numbers
    // const pageNumbers = [];
    // for (let i = 1; i <= Math.ceil(adminState.totalItems / adminState.pageSize); i++) {
    //     pageNumbers.push(i);
    // }

    // const handlePageClick = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    //     console.log(pageNumber);

    // };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvel_admin')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch
                    hintText={t('recherche.rechercher') + t('recherche.administrateur')}
                    onSubmit={(text) => setSearchText(text)}
                />
            </div>

            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />

                        {/* body */}
                        <BodyTable data={listFilterAdmin} onEdit={onEdit} />


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