import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaFilter, FaSort } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setErrorPagePresencePaie, setPresencePaie, setPresencePaiesLoading } from "../../../_redux/features/presence_paie_slice";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { formatYear, extractYear, generateYearRange, createPDF } from "../../../fonctions/fonction";
import createToast from "../../../hooks/toastify";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import Pagination from "../../Pagination/Pagination";
import CustomButtonDownload from "../common/CustomButtomDownload";
import Download from "../common/Download";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import BodyTable from "./BodyTable";
import HeaderTable from "./HeaderTable";
import { semestres } from "../../../pages/CommonPage/EmploiDeTemp";
import { apiGetPresencesWithTotalHoraire, apiSearchPresenceEnseignant, generateListPresenceByNiveau } from "../../../api/api_presence_paie";
import { apiUpdateTauxHoraire } from "../../../api/settings/api_data_setting";
import { setTauxHoraire } from "../../../_redux/features/data_setting_slice";


interface TableProps {
    data: PresencePaieType[];
    
}

const Table = ({ data}: TableProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const tauxHoraire:number=useSelector((state: RootState) => state.dataSetting.dataSetting.tauxHoraire) ?? 0; 
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentYear:number=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const firstYear:number=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023; 
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const departements = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique) ?? [];
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [selectSemestre, setSelectSemestre] = useState(currentSemestre);
    const pageIsLoading = useSelector((state: RootState) => state.presencePaieSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    
    // CORRECTION : Initialisation correcte du state section
    const [section, setSection] = useState<SectionProps | undefined>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [semestre, setSemestre] = useState<number | undefined>(currentSemestre);
    
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState(false);

    const [taux, setTaux] = useState(tauxHoraire);

    const handleUpdateTauxHoraire = async () => {
        
        if(taux!=tauxHoraire){
            await apiUpdateTauxHoraire(
                {tauxHoraire:taux}
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(setTauxHoraire(parseInt(e.data)));
    
                } 
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        }

    }

    // CORRECTION : Amélioration de la fonction filterCycleBySection
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            const result: CycleProps[] = cycles.filter(cycle => cycle.section === sectionId);
            setFilteredCycle(result);
            
            if (result.length > 0) {
                const firstCycle = result[0];
                setSelectIdCycle(firstCycle._id);
                setCycle(firstCycle);
                filterNiveauxByCycle(firstCycle._id);
            } else {
                setSelectIdCycle(undefined);
                setCycle(undefined);
                setFilteredNiveaux([]);
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
            }
        } else {
            setFilteredCycle([]);
            setSelectIdCycle(undefined);
            setCycle(undefined);
            setFilteredNiveaux([]);
            setSelectIdNiveau(undefined);
            setNiveau(undefined);
        }
    };

    // CORRECTION : Amélioration de la fonction filterNiveauxByCycle
    const filterNiveauxByCycle = (cycleId: string | undefined) => {
        if (cycleId && cycleId !== '') {
            const result: NiveauProps[] = niveaux.filter(niveau => niveau.cycle === cycleId);
            setFilteredNiveaux(result);
            
            if (result.length > 0) {
                const firstNiveau = result[0];
                setSelectIdNiveau(firstNiveau._id);
                setNiveau(firstNiveau);
            } else {
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
            }
        } else {
            setFilteredNiveaux([]);
            setSelectIdNiveau(undefined);
            setNiveau(undefined);
        }
    };

    
    const handleDownloadSelect = async (selected: string) => {
        
        try{
            setIsDownload(true);
            let title = "presence_paie_"+formatYear(selectedYear);
            if(lang !== 'fr'){
                title = "attendance_pay_"+formatYear(selectedYear);
            }
            const departement=section && departements.find(dep=>dep._id && dep._id.toString()===section.departement.toString());
            if(selected === 'PDF'){
                if(section && cycle && niveau && departement && niveau._id){
                    await generateListPresenceByNiveau({ niveauId:niveau._id, annee: selectedYear, semestre: selectSemestre, departement: departement, section: section, cycle: cycle, niveau: niveau, langue: lang, fileType:'pdf' }).then((blob) => {
                        if (blob) {
                            createPDF(blob, title);
                        }
                    })
                }
            }else{
                if(section && cycle && niveau && departement && niveau._id){
                    await generateListPresenceByNiveau({ niveauId:niveau._id, annee: selectedYear, semestre: selectSemestre, departement: departement, section: section, cycle: cycle, niveau: niveau, langue: lang, fileType:'xlsx' }).then((blob) => {
                        if (blob) {
                            createPDF(blob, title, 'xlsx');
                        }
                    })
                }
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
    };

    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
            setCurrentPage(1); // Réinitialiser à la première page
        }
    };
    
    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            setSection(selected);
            filterCycleBySection(selected._id);
            setSearchText('');
            setIsSearch(false);
            setCurrentPage(1);
        }
    };

    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            setCycle(selected);
            filterNiveauxByCycle(selected._id);
            setSearchText('');
            setIsSearch(false);
            setCurrentPage(1);
        }
    };

    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (selected && selected?._id) {
            setSelectIdNiveau(selected._id);
            setNiveau(selected);
            setSearchText('');
            setIsSearch(false);
            setCurrentPage(1);
        }
    };

    const handleSemestreSelect = (selected: number | undefined) => {
        if (selected) {
            setSelectSemestre(selected);
            setSemestre(selected);
            setCurrentPage(1);
        }
    };

    // variable pour la pagination
    const itemsPerPage = useSelector((state: RootState) => state.presencePaieSlice.data.pageSize);
    const count = useSelector((state: RootState) => state.presencePaieSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    
    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers :number[]= [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    
    // CORRECTION : Initialisation des filtres au chargement
    useEffect(() => {
        if (sections && sections.length > 0 && !section) {
            const firstSection = sections[0];
            setSection(firstSection);
            setSelectIdSection(firstSection._id);
            filterCycleBySection(firstSection._id);
        }
    }, [sections]);

    // CORRECTION : Gestion du filtrage des cycles
    useEffect(() => {
        if (selectSectionId) {
            filterCycleBySection(selectSectionId);
        }
    }, [cycles, selectSectionId]);

    // CORRECTION : Gestion du filtrage des niveaux
    useEffect(() => {
        if (selectCycleId) {
            filterNiveauxByCycle(selectCycleId);
        }
    }, [niveaux, selectCycleId]);

    // CORRECTION : Un seul useEffect pour récupérer les présences (suppression du doublon)
    useEffect(() => {
        const fetchPresencePaie = async () => {
            // Ne pas faire d'appel API si on est en mode recherche
            if (isSearch && searchText) {
                return;
            }

            dispatch(setPresencePaiesLoading(true));
            try {
                const emptyPresencePaie: PresencePaieListGetType = {
                    presencePaies: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };
    
                if (selectNiveauId && selectSemestre && selectedYear) {
                    const fetchedPresencePaies = await apiGetPresencesWithTotalHoraire({
                        page: currentPage,
                        annee: selectedYear,
                        semestre: selectSemestre,
                        niveauId: selectNiveauId
                    });
    
                    if (fetchedPresencePaies && fetchedPresencePaies.presencePaies.length > 0) {
                        dispatch(setPresencePaie(fetchedPresencePaies));
                    } else {
                        dispatch(setPresencePaie(emptyPresencePaie));
                    }
                } else {
                    dispatch(setPresencePaie(emptyPresencePaie));
                }
            } catch (error) {
                console.error("Error occurred during fetch:", error);
                dispatch(setErrorPagePresencePaie(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setPresencePaiesLoading(false));
            }
        };
    
        fetchPresencePaie();
    }, [dispatch, selectNiveauId, selectedYear, selectSemestre, currentPage, isSearch, searchText, t]);
    
    // CORRECTION : Gestion de la recherche
    const [filteredData, setFilteredData] = useState<PresencePaieType[]>(data);
    const latestQueryPresence = useRef('');
    
    useEffect(() => {
        const filterPresenceByContent = async () => {
            if (searchText === '') {
                setIsSearch(false);
                setFilteredData(data);
                return;
            }

            dispatch(setPresencePaiesLoading(true));
            latestQueryPresence.current = searchText;
            
            try {
                const result = await apiSearchPresenceEnseignant({ 
                    searchString: searchText, 
                    limit: 10 
                });
                
                if (latestQueryPresence.current === searchText && result) {
                    setFilteredData(result.presencePaies);
                    setIsSearch(true);
                }
            } catch (e) {
                console.error("Error during search:", e);
                dispatch(setErrorPagePresencePaie(t('message.erreur')));
            } finally {
                if (latestQueryPresence.current === searchText) {
                    dispatch(setPresencePaiesLoading(false));
                }
            }
        };

        const timeoutId = setTimeout(() => {
            filterPresenceByContent();
        }, 300); // Debounce de 300ms

        return () => clearTimeout(timeoutId);
    }, [searchText, dispatch, t]);

    // CORRECTION : Mise à jour de filteredData quand data change (et pas en mode recherche)
    useEffect(() => {
        if (!isSearch) {
            setFilteredData(data);
        }
    }, [data, isSearch]);
   
   
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <InputSearch 
                    hintText={t('recherche.rechercher')+t('recherche.enseignant')} 
                    value={searchText} 
                    onSubmit={(text) => setSearchText(text)} 
                />
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2">
                    <div className="hidden lg:block"><FaFilter /></div>
                    {t('filtre.enseignant')}
                </h1>
                
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> 
                        <FaFilter />
                        <p className="text-[12px]"> {t('filtre.filtrer')}</p>
                        <FaSort /> 
                    </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)}
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
                                defaultValue={section}
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle}
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={niveau}
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={semestre}
                                items={semestres}
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
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)}
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
                                defaultValue={section}
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle}
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={niveau}
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={semestre}
                                items={semestres}
                                defaultValue={semestre}
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-5">
                    <label className="text-sm lg:text-base font-medium">{t('label.taux_horaire')}</label>   
                </div>

                <div className="flex flex-col md:flex-row justify-start items-center gap-y-4 md:gap-x-4 mt-2">
                    <div className="flex flex-col gap-y-1 w-full md:w-auto">
                        <input
                            type="number"
                            value={taux}
                            onChange={(e) => setTaux(parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm lg:text-base border border-stroke rounded-md focus:ring focus:ring-blue-500 dark:bg-boxdark dark:text-white"
                            placeholder={t('label.modifierTauxHoraire')}
                        />
                    </div>

                    <div className="flex flex-col gap-y-1 w-full md:w-auto">
                        <button
                            onClick={handleUpdateTauxHoraire}
                            className="w-full md:w-auto px-4 py-2 bg-primary text-white text-sm lg:text-base rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {t('boutton.appliquer')}
                        </button>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : filteredData && filteredData.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {
                            !pageIsLoading && <BodyTable data={filteredData} />
                        }
                    </table>
                </div>

                {filteredData && filteredData.length>0 && !isSearch && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}
                />}

            </div>

            <div className="mt-7 mb-10">
                {isDownload ? <Download /> : <CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div>

        </div>
    );
};


export default Table;