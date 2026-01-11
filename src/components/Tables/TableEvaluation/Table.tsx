//src/components/Tables/TableEvaluation/Table.tsx

import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import {
    setErrorPageEvaluation,
    setEvaluationLoading,
    setEvaluations
} from "../../../_redux/features/evaluation_slice";
import { getEvaluationsByNiveau } from "../../../api/api_evaluation";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import { formatYear, generateYearRange } from "../../../fonctions/fonction";
import Bouton from "../../ui/Bouton";
import { getSemestresByNiveau } from "../../../api/api_evaluation";

interface TableEvaluationProps {
    data: EvaluationType[];
    onCreate: () => void;
    onEdit: (evaluation: EvaluationType) => void;
}

const Table = ({ data, onCreate, onEdit }: TableEvaluationProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language);
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const pageIsLoading = useSelector((state: RootState) => state.evaluationSlice.pageIsLoading);
    
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [semestresAutorises, setSemestresAutorises] = useState<number[]>([1, 2]);
    
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageEvaluationPermission = userPermissions.includes('gerer_evaluations');

    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemestre);
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>();
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>();
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>();

    const [filteredSection, setFilteredSection] = useState<SectionProps[]>([]);
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    // Filtrer les cycles par section
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            const result: CycleProps[] = cycles.filter(cycle => cycle.section === sectionId);
            if (result.length > 0) {
                setSelectIdCycle(result[0]._id);
                setCycle(cycles.find(cycle => cycle._id === result[0]._id));
                filterNiveauxByCycle(result[0]._id);
            } else {
                setSelectIdCycle(undefined);
                setCycle(undefined);
                setFilteredNiveaux([]);
            }
            setFilteredCycle(result);
        } else {
            setFilteredCycle([]);
            setSelectIdCycle(undefined);
            setCycle(undefined);
        }
    };

    // Filtrer les niveaux par cycle
    const filterNiveauxByCycle = (cycleId: string | undefined) => {
        if (cycleId && cycleId !== '') {
            const result: NiveauProps[] = niveaux.filter(niveau => niveau.cycle === cycleId);
            if (result.length > 0) {
                setSelectIdNiveau(result[0]._id);
                setNiveau(niveaux.find(niveau => niveau._id === result[0]._id));
                setFilteredNiveaux(result);
                // Récupérer les semestres autorisés pour ce niveau
                fetchSemestresAutorises(result[0]._id);
            } else {
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
                setFilteredNiveaux([]);
            }
        } else {
            setFilteredNiveaux([]);
            setSelectIdNiveau(undefined);
            setNiveau(undefined);
        }
    };

    // Récupérer les semestres autorisés pour un niveau
    const fetchSemestresAutorises = async (niveauId: string | undefined) => {
        if (niveauId) {
            try {
                const info = await getSemestresByNiveau(niveauId);
                setSemestresAutorises(info.semestresAutorises);
            } catch (error) {
                console.error('Erreur récupération semestres:', error);
                setSemestresAutorises([1, 2]); // Par défaut
            }
        }
    };

    const handleAnneeSelect = (selected: String | undefined) => {
        if (selected) {
            const year = parseInt(selected.toString().split('/')[0]);
            setSelectedYear(year);
        }
    };

    const handleSemestreSelect = (selected: number | undefined) => {
        if (selected) {
            setSelectedSemestre(selected);
        }
    };

    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
            setSearchText('');
        }
    };

    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            filterNiveauxByCycle(selected._id);
            setCycle(selected);
        }
    };

    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (selected && selected?._id) {
            setSelectIdNiveau(selected._id);
            setNiveau(selected);
            fetchSemestresAutorises(selected._id);
        }
    };

    // Pagination
    const itemsPerPage = useSelector((state: RootState) => state.evaluationSlice.data.pageSize);
    const count = useSelector((state: RootState) => state.evaluationSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers: number[] = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(count, currentPage * itemsPerPage);

    // Initialisation
    useEffect(() => {
        setFilteredSection(sections);
        if (sections && sections.length > 0) {
            setSection(sections[0]);
            setSelectIdSection(sections[0]._id);
            filterCycleBySection(sections[0]._id);
        }
    }, [sections]);

    useEffect(() => {
        if (filteredCycle && filteredCycle.length > 0) {
            if (!selectCycleId) {
                filterNiveauxByCycle(filteredCycle[0]?._id);
            } else {
                filterNiveauxByCycle(selectCycleId);
            }
        }
    }, [filteredCycle]);

    // Fetch evaluations
    useEffect(() => {
        const fetchEvaluations = async () => {
            dispatch(setEvaluationLoading(true));
            try {
                const emptyEvaluations: EvaluationReturnGetType = {
                    evaluations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };

                if (selectNiveauId) {
                    const fetchedEvaluations = await getEvaluationsByNiveau({
                        niveauId: selectNiveauId,
                        annee: selectedYear,
                        semestre: selectedSemestre,
                        page: currentPage
                    });

                    if (fetchedEvaluations) {
                        dispatch(setEvaluations(fetchedEvaluations));
                    } else {
                        dispatch(setEvaluations(emptyEvaluations));
                    }
                } else {
                    dispatch(setEvaluations(emptyEvaluations));
                }
            } catch (error) {
                dispatch(setErrorPageEvaluation(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setEvaluationLoading(false));
            }
        };

        fetchEvaluations();
    }, [dispatch, currentPage, selectedYear, selectedSemestre, selectNiveauId, t]);

    const [filteredData, setFilteredData] = useState<EvaluationType[]>(data);

    useEffect(() => {
        if (searchText === '') {
            setFilteredData(data);
        } else {
            const result = data.filter(item =>
                (lang === 'fr' ? item.libelleFr : item.libelleEn)
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
            setFilteredData(result);
        }
    }, [searchText, data, lang]);

    const handleRefreshFilters = () => {
        setSelectedYear(currentYear);
        setSelectedSemestre(currentSemestre);
        if (sections.length > 0) {
            setSection(sections[0]);
            setSelectIdSection(sections[0]._id);
            filterCycleBySection(sections[0]._id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {hasManageEvaluationPermission && (
                    <ButtonCreate
                        onClick={() => {
                            onCreate();
                            dispatch(setShowModal());
                        }}
                        title={""}
                    />
                )}
                <InputSearch
                    hintText={t('recherche.rechercher') + t('recherche.evaluation')}
                    value={searchText}
                    onSubmit={(text) => setSearchText(text)}
                />
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2">
                    <div className="hidden lg:block"><FaFilter /></div>
                    {t('filtre.evaluation')}
                    {hasManageEvaluationPermission && (
                        <Bouton
                            iconeSmall={true}
                            circle={true}
                            typeRefresh={true}
                            onClick={handleRefreshFilters}
                        />
                    )}
                </h1>

                {/* Filtres */}
                <div className="hidden lg:block">
                    <div className="flex justify-start items-center flex-col lg:flex-row mb-5 mt-1 gap-x-4">
                        <div className="flex flex-wrap w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)}
                                onSelect={handleAnneeSelect}
                            />

                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={filteredSection}
                                defaultValue={section}
                                displayProperty={(section: SectionProps) =>
                                    `${lang === 'fr' ? section.libelleFr : section.libelleEn}`
                                }
                                onSelect={handleSectionSelect}
                            />

                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle}
                                displayProperty={(cycle: CycleProps) =>
                                    `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`
                                }
                                onSelect={handleCycleSelect}
                            />

                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={niveau}
                                displayProperty={(niveau: NiveauProps) =>
                                    `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`
                                }
                                onSelect={handleNiveauSelect}
                            />

                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={semestresAutorises}
                                defaultValue={selectedSemestre}
                                onSelect={handleSemestreSelect}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {pageIsLoading ? (
                            <LoadingTable />
                        ) : filteredData.length === 0 ? (
                            <NoDataTable />
                        ) : (
                            <HeaderTable />
                        )}

                        {!pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} />}
                    </table>
                </div>

                {/* Pagination */}
                {searchText === '' && hasManageEvaluationPermission && filteredData && filteredData.length > 0 && (
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
                )}
            </div>
        </div>
    );
};

export default Table;