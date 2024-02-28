import { useDispatch } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting_slice";
import { useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { Chapitre } from "../../../pages/Admin/Chapitres";
import { Matiere } from "../../../pages/Admin/ListeMatieres";
import { useTranslation } from "react-i18next";

interface TableChapitreProps {
    data?: Chapitre[];
    onCreate:()=>void;
    onEdit: (chapitre:Chapitre) => void;
    matiere?: Matiere | null;
}


const Table = ({ data, onCreate, onEdit, matiere }: TableChapitreProps) => {
    const {t}=useTranslation();
    const pageIsLoading = false;
    const dispatch = useDispatch();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);


    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouveau_chapitre')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.chapitre'))} onSubmit={() => { }} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                {matiere && (<div>
                    {matiere.code}:{matiere.libelle}
                </div>)}

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : data?.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data} onEdit={onEdit}/>
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