import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../common/SearchTable";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { extractYear, formatYear, generateYearRange, nbTotalAbsences } from "../../../fonctions/fonction";
import Pagination from "../../Pagination/Pagination";
import { setAnneeDisciplineEns, setEnseignantDiscipline, setEnseignantsDisciplineLoadingOnTable, setErrorPageEnseignantDiscipline, setSemestreDisciplineEns } from "../../../_redux/features/absence/discipline_enseignant_slice";
import { apiGetAbsencesWithEnseignantsByFilter, apiGetAllAbsencesWithEnseignantsByFilter } from "../../../api/discipline/api_discipline";
import LoadingOnTable from "../common/LoadingOnTable";
import * as XLSX from 'xlsx';
import { setErrorPageEtudiant, setEtudiantsLoading } from "../../../_redux/features/etudiant_slice";
import createToast from "../../../hooks/toastify";
import { niveau } from "../../../pages/Admin/Niveaux";

interface TableDisciplineProps {
    data: UserDiscipline[];
    onEdit: (enseignant: UserDiscipline, isHourRemove: boolean) => void;
}


const Table = ({ data, onEdit }: TableDisciplineProps) => {


    const { t } = useTranslation();
    const dispatch = useDispatch();



    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };



    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const selectedSemestre = useSelector((state: RootState) => state.enseignantDisciplineSlice.selected.semestre)
    const [selectSemestre, setSelectSemestre]=useState(currentSemestre);
    const [selectedYear, setSelectYear]=useState(currentYear);


    const listSemestre = ['1', '2']
    const listAnnee = generateYearRange(currentYear, firstYear);

    const [annee, setAnnee] = useState<string | undefined>(`${firstYear}/${firstYear + 1}`);
    const [semestre, setSemestre] = useState<string | undefined>(selectedSemestre ? selectedSemestre.toString() : currentSemestre.toString());

    const handleAnneeSelect = (selected: string | undefined) => {
        if (selected) {
            setAnnee(selected);
            setSelectYear(extractYear(selected));
            dispatch(setAnneeDisciplineEns(parseInt(selected)))
        }
        // setFonction(selected);
        // dispatch(setSelectedEnseignant({ key: "fonction", value: selected }))

    };

    const handleSemestreSelect = (selected: string | undefined) => {
        if (selected) {
            setSelectSemestre(parseInt(selected))
            setSemestre(selected);
            dispatch(setSemestreDisciplineEns(parseInt(selected)));
        }

    };



    // recherche
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UserDiscipline[]>(data);

    // Filtrer les matières en fonction de la langue
    const filterEnseignantByContent = (enseignants: UserDiscipline[]) => {
        if (searchText === '') {
            const result: UserDiscipline[] = enseignants;
            return result;
        }
        return enseignants.filter(enseignant => {
            const prenom = enseignant?.prenom || "";
            // Vérifie si le code ou le libellé contient le texte de recherche
            return enseignant.nom.toLowerCase().includes(searchText.toLowerCase()) || prenom.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    useEffect(() => {
        const result = filterEnseignantByContent(data);
        setFilteredData(result);
    }, [searchText, data]);



    const [isInitialMount, setIsInitialMount] = useState(true);
    const pageIsLoadingOnTable = useSelector((state: RootState) => state.enseignantDisciplineSlice.pageIsLoadingOnTable);



    // start pagination
    const count: number = useSelector((state: RootState) => state.enseignantDisciplineSlice.data.totalItems);
    const itemsPerPage = useSelector((state: RootState) => state.enseignantDisciplineSlice.data.pageSize); // nombre delements maximum par page

    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);

    const startItem = currentPage === Math.ceil(count / itemsPerPage) ? count - itemsPerPage + 1 : indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);
    // Render page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber: number) => { setCurrentPage(pageNumber); };
    // end --------- pagination

    useEffect(() => {
        if (annee && semestre) {
            dispatch(setAnneeDisciplineEns(currentYear));
            dispatch(setSemestreDisciplineEns(parseInt(semestre)));
        }



        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }


        const fetchEnseignantWithAbsences = async () => {
            dispatch(setEnseignantsDisciplineLoadingOnTable(true));

            try {
                if (semestre) {
                    const fetchedEnseignants = await apiGetAbsencesWithEnseignantsByFilter({
                        page: currentPage, semestre: selectSemestre, annee: selectedYear
                    });
                    if (fetchedEnseignants) {
                        dispatch(setEnseignantDiscipline(fetchedEnseignants));

                        dispatch(setErrorPageEnseignantDiscipline(null));
                    } else {
                        dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
                    }
                }
            } catch (error) {
                dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
            } finally {
                dispatch(setEnseignantsDisciplineLoadingOnTable(false));
            }
        }

        fetchEnseignantWithAbsences();

    }, [data.length, annee, semestre, currentPage, t]);

    const fetchAllAbsEnseignant = async () => {
        try {
            
            
            const fetchedEnseignants = await apiGetAllAbsencesWithEnseignantsByFilter({  annee:selectedYear, semestre:selectSemestre});
            return fetchedEnseignants.enseignants;
            
                // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEtudiant(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEtudiantsLoading(false)); // Définissez le loading à false après le chargement
        }
    }

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const handleDownloadSelect = async (selected: string) => {
        // setFormatToDownload(selected);
        const mats = await fetchAllAbsEnseignant().then((absences) => {
            let title = "liste_des_absences_enseignant";
            if (lang !== 'fr') {
                title = "abscences_teacher_list";
            }
            if (selected === 'PDF') {

            } else if (selected === 'CSV') {

            } else {
                exportToExcel(title + ".xlsx", absences)
            }
        })

    };

    const exportToExcel = ( filename: string,enseignants: UserDiscipline[] | undefined) => {
        if(enseignants){
            const wb = XLSX.utils.book_new();
            
            // Créer une feuille de calcul
            const ws = XLSX.utils.aoa_to_sheet([
                [t('label.matricule'), t('label.nom'), t('label.prenom'), t('label.genre'), t('label.email'), t('label.date_naiss'), t('label.lieu_naiss'),'Absences(H)'],
                ...enseignants.flatMap(enseignant => {
                    const rows = [];
                    rows.push([enseignant.matricule, enseignant.nom, enseignant.prenom, enseignant.genre, enseignant.email, enseignant.date_naiss?enseignant.date_naiss?.split("T")[0]:"", enseignant.lieu_naiss??"" 
                    , nbTotalAbsences(enseignant.absences)]);
                    return rows;
                })
            ]);
          
            // Ajouter la feuille de calcul au classeur
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Générer un fichier Excel binaire
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            // Convertir le tableau binaire en un objet Blob
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // Créer un lien pour télécharger le fichier Excel
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            // Cliquez sur le lien pour télécharger le fichier Excel
            link.click();
        }else{
            
        }
    }

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.enseignant')} onSubmit={(text) => setSearchText(text)} />
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
                            <CustomDropDown2<string>
                                title={t('label.annee')}
                                selectedItem={annee}
                                items={listAnnee}
                                defaultValue={annee}
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<string>
                                title={t('label.semestre')}
                                selectedItem={semestre}
                                items={listSemestre}
                                defaultValue={semestre}
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">

                            <CustomDropDown2<string>
                                title={t('label.annee')}
                                selectedItem={annee}
                                items={listAnnee}
                                defaultValue={annee}
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<string>
                                title={t('label.semestre')}
                                selectedItem={semestre}
                                items={listSemestre}
                                defaultValue={semestre}
                                onSelect={handleSemestreSelect}
                            />


                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 relative min-h-[250px]">
                    <table className="w-full table-auto">
                        <HeaderTable />

                        {
                            pageIsLoadingOnTable ?
                                <LoadingOnTable /> :
                                <BodyTable data={filteredData} />

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
                <CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;