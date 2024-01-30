import { useDispatch } from "react-redux";
import { Etudiant } from "../../../pages/Admin/ListeEtudiants";
import ButtonNew from "../common/ButtonTableCreateNew";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import BodyTableEtudiant from "./BodyTableEtudiant";
import HeaderTableEtudiant from "./HeaderTableEtudiant";
import { setShowModalCreate } from "../../../_redux/features/setting_slice";
import ModelCreateDepense from "../../DialogBoxes/DialogEtudiant/DialogCreateEtudiant";
import ModalCreateEtudiant from "../../DialogBoxes/DialogEtudiant/DialogCreateEtudiant";



const TableEtudiant = ({ data }: { data: Etudiant[] }) => {
    const pageIsLoading = false;
    const dispatch = useDispatch();

    return (
        <div>
            <div className="flex justify-between items-center gap-x-2 lg:gap-x-5 mb-1">
                <ButtonNew title="Nouvel étudiant"
                    onClick={() => { dispatch(setShowModalCreate()) }}
                />
                <InputSearch hintText="Rechercher un étudiant" text="l" onSubmit={() => { }} />
            </div>

            <div className="rounded-sm border border-stroke bg-white px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="flex  justify-between items-center  flex-col lg:flex-row ">

                    {/* <h1 className="flex w-full flex-col lg:flex-row lg:mb-7">

                    <CustomDate pagination={itemsPerPage} data={filterDate}

                        handleConfirm={(newData) => {
                            setFilterDate(newData);
                            localStorage.setItem(localStorageKey.depenses.month, newData.month.toString())
                            localStorage.setItem(localStorageKey.depenses.year, newData.year.toString())

                            dispatch(setPageDepensesIsLoading(true));
                            getAllDepensesApi().then((e: any) => {
                                if (e.status) {
                                    var data = e.data;
                                    if (data !== undefined) {
                                        dispatch(setExpenses(data));
                                        dispatch(setCountDepense(e.count ?? 0))
                                    }
                                }
                                // arreter le load de la page de depenses
                                dispatch(setPageDepensesIsLoading(false));
                            });
                        }}
                    />
                    <CustomNumberItemsPerPage itemsPerPage={itemsPerPage} setItemPerPage={(perPage) => setItemsPerPage(perPage)} />
                    <CountFilter title='Total de résultats pour ce mois' count={count} />


                </h1> */}


                    <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5 mt-1 w-full lg:w-auto">
                        {/* <ButtonNew title="Nouvelle dépense" onClick={} /> */}
                    </div>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : data.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTableEtudiant />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTableEtudiant data={data} />
                        }




                    </table>
                </div>

                {/* Pagination */}

                <h1>Pagination ici</h1>

            </div>

            {/* Download */}
            <h1>Bouton download ici</h1>


        </div>
    );
};


export default TableEtudiant;