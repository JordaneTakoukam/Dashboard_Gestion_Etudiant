import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTableEtudiant from "./HeaderTableEtudiant";
import BodyTableEtudiant from "./BodyTableEtudiant";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { setErrorPageEtudiant, setEtudiant, setEtudiantsLoading } from "../../../_redux/features/etudiant_slice";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import * as XLSX from 'xlsx';
import { apiGetEtudiants, apiGetEtudiantsWithPagination, apiSearchEtudiant, generateListEtudiant } from "../../../api/other_users/api_etudiant";
import { createPDF, extractYear, formatYear, generateYearRange, validateEmail } from "../../../fonctions/fonction";
import Download from "../common/Download";

interface TableEtudiantProps {
    data: EtudiantType[];
    onCreate:()=>void;
    onAddRole:(etudiant : EtudiantType)=>void;
    onEdit: (etudiant : EtudiantType) => void;
}

const Table = ({ data, onCreate,onAddRole, onEdit}: TableEtudiantProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    
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
    const pageIsLoading = useSelector((state: RootState) => state.etudiantSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    
    const [section, setSection] = sections.length>0?useState<SectionProps | undefined>(sections[0]):useState<SectionProps | undefined>();;
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CycleProps[] = cycles.filter(cycle => cycle.section === sectionId);
            if (result.length > 0) {
                setSelectIdCycle(result[0]._id);
                setCycle(cycles.find(cycle=>cycle._id ===result[0]._id))
                filterNiveauxByCycle(cycle?._id)
            }else{
                setSelectIdCycle(undefined);
                setCycle(undefined);
                filterNiveauxByCycle(undefined);
                setFilteredNiveaux([]);
            }
            setFilteredCycle(result);
        }else{
            setFilteredCycle([])
            setSelectIdCycle(undefined);
            setCycle(undefined);
        }
    };

    // filtrer les donnee a partir de l'id du cycle selectionner
    const filterNiveauxByCycle = (cycleId: string | undefined) => {
        
        if (cycleId && cycleId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: NiveauProps[] = niveaux.filter(niveau => niveau.cycle === cycleId);
            if (result.length > 0) {
                setSelectIdNiveau(result[0]._id);
                setNiveau(niveaux.find(niveau=>niveau._id===result[0]._id))
                setFilteredNiveaux(result)
            }else{
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
                setFilteredNiveaux([])
            }
            
        }else{
            setFilteredNiveaux([])
            setSelectIdNiveau(undefined);
            setNiveau(undefined);
        }
    };
    const [formatToDownload, setFormatToDownload] = useState("");

    const fetchAllEtudiants = async () => {
        try {
            
            if (selectNiveauId) {
                const fetchedEtudiants = await apiGetEtudiants({ niveauId: selectNiveauId, annee:selectedYear});
                return fetchedEtudiants.etudiants;
            }
                // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEtudiant(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEtudiantsLoading(false)); // Définissez le loading à false après le chargement
        }
    }
    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        
        try{
            setIsDownload(true);
            let title = "liste_des_etudiants_"+formatYear(selectedYear);
            if(lang !== 'fr'){
                title = "students_list_"+formatYear(selectedYear);
            }
            if(selected === 'PDF'){
                
                const departement=section && departements.find(dep=>dep._id && dep._id.toString()===section.departement.toString());
                if(section && cycle && niveau && departement){
                    
                    await generateListEtudiant({annee:selectedYear, departement:departement, section:section, cycle:cycle, niveau:niveau, langue:lang}).then((blob)=>{
                        // Créer un objet URL pour le blob PDF
                        if(blob){
                            createPDF(blob, title);
                        }
                    })
                }
                
                
            }else{
                await fetchAllEtudiants().then((etudiants)=>{
                    
                if (selected === 'CSV'){
                    
                }else{
                    exportToExcel(title+".xlsx", etudiants)
                }
                    
                })
            }
        } catch (error) {
            
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
        
    };

    

    const exportToExcel = ( filename: string,etudiants: EtudiantType[] | undefined) => {
        if(etudiants){
            const wb = XLSX.utils.book_new();
            
            // Créer une feuille de calcul
            const ws = XLSX.utils.aoa_to_sheet([
                [t('label.matricule'), t('label.nom'), t('label.prenom'), t('label.genre'), t('label.email'), t('label.date_naiss'), t('label.lieu_naiss'),t('label.section'), t('label.cycle'), t('label.niveau')],
                ...etudiants.flatMap(etudiant => {
                    const rows = [];
                    rows.push([etudiant.matricule, etudiant.nom, etudiant.prenom, etudiant.genre, etudiant.email, etudiant.date_naiss?etudiant.date_naiss?.split("T")[0]:"", etudiant.lieu_naiss, section?.code || "", cycle?.code || "", niveau?.code || ""]);
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

    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
        }
    };
    
     // recuperer l'id de la section suite au click sur l'input select
    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
            setSearchText('');
        }
    };

    // valeur de la l'id du cycle selectionner    
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            filterNiveauxByCycle(selected._id);
            setCycle(selected);
            setSearchText('');
        }
    };

    // valeur de la l'id du niveau selectionner    
    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (selected && selected?._id) {
            setSelectIdNiveau(selected._id);
            setNiveau(selected);
            setSearchText('');
        }
    };

    // Filtrer les matières en fonction de la langue
    const filterEtudiantByContent = (etudiants: EtudiantType[]) => {
        if (searchText === '') {
            const result: EtudiantType[] = etudiants;
            return result;
        }
        return etudiants.filter(etudiant => {
            const prenom = etudiant?.prenom || "";
            // Vérifie si le code ou le libellé contient le texte de recherche
            return etudiant.nom.toLowerCase().includes(searchText.toLowerCase()) || prenom.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    

     // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.etudiantSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.etudiantSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    
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

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    
    //fournir initialement les données à la page
    // Effet pour filtrer les options des CustomDropDown
    useEffect(() => {
        if(!selectSectionId){
            if (sections && sections.length > 0) {
                filterCycleBySection(sections[0]._id);
            }
        }else{
            setFilteredCycle([]);
            filterCycleBySection(selectSectionId);
        }
        
        
    }, [sections, selectSectionId]);

    useEffect(() => {
        if (filteredCycle && filteredCycle.length > 0) {
            if(!selectCycleId){
                filterNiveauxByCycle(filteredCycle[0]?._id);
            }else{
                filterNiveauxByCycle(selectCycleId);
            }
                
        }        
    }, [filteredCycle]);
    useEffect(() => {
        const fetchEtudiants = async () => {
            dispatch(setEtudiantsLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyEtudiants : EtudiantListGetType={
                    etudiants: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if (selectNiveauId) {
                    const fetchedEtudiants = await apiGetEtudiantsWithPagination({ niveauId: selectNiveauId, page: currentPage, annee:selectedYear });
                    if (fetchedEtudiants) { // Vérifiez si fetchedEtudiants n'est pas faux, vide ou indéfini
                        dispatch(setEtudiant(fetchedEtudiants));
                       
                    } else {
                        
                        dispatch(setEtudiant(emptyEtudiants));
                    }
                } else{
                    dispatch(setEtudiant(emptyEtudiants));
                }
                    // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageEtudiant(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setEtudiantsLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchEtudiants();
    }, [dispatch, selectNiveauId, selectedYear, currentPage, t]); // Déclencher l'effet lorsque currentPage change

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<EtudiantType[]>(data);

    const latestQueryEtudiant = useRef('');
    useEffect(() => {
        dispatch(setEtudiantsLoading(true));
        latestQueryEtudiant.current = searchText;
        try{
            
            const filterEtudiantByContent = async () => {
                if (searchText === '') {
                    sections.length>0?setSection(sections[0]):setSection(undefined);
                    filterCycleBySection(section?._id);
                    // setCycle(filteredCycle[0]);
                    filterNiveauxByCycle(cycle?._id);
                    // setNiveau(filteredNiveaux[0]);
                    const result: EtudiantType[] = data;
                    setFilteredData(result); 
                }else{
                    setSection(undefined);
                    setCycle(undefined);
                    setNiveau(undefined);
                    setFilteredCycle([]);
                    setFilteredNiveaux([]);
                    let etudiantsResult : EtudiantType[] = [];
                    await apiSearchEtudiant({ searchString:searchText, limit:10 }).then(result=>{
                        if (latestQueryEtudiant.current === searchText) {
                            if(result){
                                etudiantsResult = result.etudiants;
                                setFilteredData(etudiantsResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            filterEtudiantByContent();
        }catch(e){
            dispatch(setErrorPageEtudiant(t('message.erreur')));
        }finally{
            if (latestQueryEtudiant.current === searchText) {
                dispatch(setEtudiantsLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole) && (<ButtonCreate
                    title={t('boutton.nouvelle_etudiant')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText={t('recherche.rechercher')+t('recherche.etudiant')} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.etudiant')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
                                defaultValue={section} // ou spécifie une valeur par défaut
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={niveau} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
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
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
                                defaultValue={section} // ou spécifie une valeur par défaut
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={cycle} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={niveau} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: NiveauProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
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
                                    <HeaderTableEtudiant />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTableEtudiant data={filteredData} onEdit={onEdit} onAddRole={onAddRole}/>
                        }




                    </table>
                </div>

                {/* Pagination */}

                {filteredData && filteredData.length>0 && <Pagination
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

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}

            </div>

        </div>
    );
};


export default Table;