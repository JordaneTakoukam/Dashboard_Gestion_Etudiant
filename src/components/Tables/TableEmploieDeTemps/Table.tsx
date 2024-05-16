import { useDispatch, useSelector } from "react-redux";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import { jours } from "../../../pages/CommonPage/EmploiDeTemp";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { setShowModal } from "../../../_redux/features/setting";
import ButtonCreate from "../common/ButtonCreate";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { createPDF, extractYear, formatYear, generateYearRange, premierElement } from "../../../fonctions/fonction";
import { setPeriodeLoading, setPeriodes, setErrorPagePeriode } from "../../../_redux/features/periode_slice";
import { generateEmploisDuTemps, getPeriodesByNiveau } from "../../../api/api_periode";
import createToast from "../../../hooks/toastify";
import * as XLSX from 'xlsx';
import Download from "../common/Download";


interface TablePeriodeProps {
    data: PeriodeType[];
    onCreate:()=>void;
    onEdit: (periode : PeriodeType) => void;
}

const Table = ({ data, onCreate, onEdit }: TablePeriodeProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.periodeSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    const dispatch = useDispatch();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const typesEnseignement=useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement); 
    const sallesCours=useSelector((state: RootState) => state.dataSetting.dataSetting.salleDeCours); 
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const userNiveaux = useSelector((state: RootState) => state.user.niveaux);

    const ouvrirFormulairePeriode = (periode?: PeriodeType) => {
        if(periode){
            onEdit(periode);
        }else{
            onCreate();
        }
        dispatch(setShowModal());
        console.log("Ouverture du formulaire pour la période :", periode);
    };
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    
    
    useEffect(() => {
        
        
        const table = document.getElementById('myTable') as HTMLTableElement;
        
        //Trie des évènement par date de début la plus récente
        const sortedPeriodes = [...data].sort((a, b) => {
            const heureDebutA = convertirHeureVersMinutes(a.heureDebut);
            const heureDebutB = convertirHeureVersMinutes(b.heureDebut);
            return heureDebutA - heureDebutB;
        });
        if (table) {
            table.innerHTML = '';
            const groupedPeriodes: { [key: string]: PeriodeType[] } = {};
            //Les évènements de la même période de cours sont groupés entre eux
            sortedPeriodes.forEach((periode) => {
                const horaire = `${periode.heureDebut} - ${periode.heureFin}`;
                if (!groupedPeriodes[horaire]) {
                    groupedPeriodes[horaire] = [];
                }
                groupedPeriodes[horaire].push(periode);
            });
            Object.entries(groupedPeriodes).forEach(([horaire, periodes], index) => {
                const row = table.insertRow();
                
                const classNames = index % 2 === 0 ?
                        "border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black" :
                        "border-b border-[#eee] py-0 px-0 dark:border-strokedark";
                    row.className = classNames;
                const horaireCell = row.insertCell();
                horaireCell.textContent = horaire;
                jours.forEach((jour) => {
                    const jourCell = row.insertCell();
                    const coursJour = periodes.find((cours) => cours.jour == jour.ordre); // Modifier cette ligne
                    jourCell.style.textAlign='center';
                    if (roles.admin === userRole  || roles.superAdmin === userRole) {
                        jourCell.onmouseover = () => {
                            jourCell.style.backgroundColor = '#afeeee';
                        };
                        
                        jourCell.onmouseout = () => {
                            jourCell.style.backgroundColor = '';
                        };
                    }
                    
                    if (coursJour) {
                        
                        
                        const codeTypeEns = typesEnseignement && typesEnseignement.find(type => type._id === coursJour.typeEnseignement);
                        const codeSalleCours = sallesCours && sallesCours.find(salle => salle._id === coursJour.salleCours);
                        const enseignantPrincipal = coursJour.enseignantPrincipal;
                        const enseignantSuppleant = coursJour.enseignantSuppleant;
                        jourCell.textContent = `${coursJour.matiere.code} (${codeTypeEns?codeTypeEns.code:""}) - ${enseignantPrincipal?premierElement(enseignantPrincipal.nom):"-"} ${enseignantPrincipal?enseignantPrincipal.prenom?premierElement(enseignantPrincipal.prenom):"":"-"}/${enseignantSuppleant?premierElement(enseignantSuppleant.nom):"-"} ${enseignantSuppleant?enseignantSuppleant.prenom?premierElement(enseignantSuppleant.prenom):"":"-"} - ${codeSalleCours?codeSalleCours.code:""}`;
                        if (roles.admin === userRole || roles.superAdmin === userRole) {
                            jourCell.onclick = () => ouvrirFormulairePeriode(coursJour);
                            jourCell.style.cursor = 'pointer';
                        }
                    }else{
                        if (roles.admin === userRole || roles.superAdmin === userRole) {
                            jourCell.onclick = () => ouvrirFormulairePeriode();
                            jourCell.style.cursor = 'pointer';
                        }
                    }
                });
            });
        }
    }, [data]);

    
    function convertirHeureVersMinutes(heure: string): number {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    }

    const [showAddRowButton, setShowAddRowButton] = useState(false);

    const handleCellMouseEnter = () => {
        setShowAddRowButton(true);
    };

    const handleCellMouseLeave = () => {
        setShowAddRowButton(false);
    };

    const [selectedYear, setSelectedYear] = useState<number>(currentYear); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemester);
   

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);
    const [filteredNiveaux, setFilteredNiveaux] = useState<NiveauProps[]>([]);

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

    const handleAnneeSelect = (selected: String | undefined) => {
        if(selected){
            setSelectedYear(extractYear(selected.toString()));
        }
    };

    // recuperer l'id de la section suite au click sur l'input select
    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (roles.delegue !== currentUser.role && roles.etudiant !== currentUser.role) {
            if (selected?._id) {
                setSelectIdSection(selected._id);
                filterCycleBySection(selected._id);
                setSection(selected);
            }
        }
    };

    // valeur de la l'id du cycle selectionner    
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (roles.delegue !== currentUser.role && roles.etudiant !== currentUser.role) {
            if (selected?._id) {
                setSelectIdCycle(selected._id);
                filterNiveauxByCycle(selected._id);
                setCycle(selected);
            }
        }
    };

    // valeur de la l'id du niveau selectionner    
    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (roles.delegue !== currentUser.role && roles.etudiant !== currentUser.role) {
            if (selected && selected?._id) {
                setSelectIdNiveau(selected._id);
                setNiveau(selected)
            }
        }
    };
    const handleSemestreSelect = (selected: number | undefined) => {
        if(selected){
            setSelectedSemestre(selected);
        }
    };

    
    const [formatToDownload, setFormatToDownload] = useState("");
    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        
        try{
            setIsDownload(true);
            let title = "emploie_de_temps"+formatYear(selectedYear)+"_semestre_"+selectedSemestre;
            if(lang !== 'fr'){
                title = "timetable"+formatYear(selectedYear)+"_semester_"+selectedSemestre;;
            }
            if(selected === 'PDF'){
                if(selectNiveauId){
                    await generateEmploisDuTemps({ niveauId: selectNiveauId, annee: selectedYear, semestre: selectedSemestre }).then((blob)=>{
                        // Créer un objet URL pour le blob PDF
                        if(blob){
                            createPDF(blob, title);
                        }
                    })
                }
                
            }else{
                if (selected === 'CSV'){
                    // downloadCSV();
                }else{
                    exportToExcel(title+".xlsx")
                }
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
    };

    const exportToExcel = (title:string) => {
        // Créer une nouvelle feuille de calcul
        const wb = XLSX.utils.book_new();
        // Convertir les données du tableau en un tableau 2D
        const data = [['Horaire', ...jours.map(jour => lang === 'fr'?jour.libelleFr:jour.libelleEn)], ...extractTableData()];
        // Créer une nouvelle feuille de calcul à partir des données
        const ws = XLSX.utils.aoa_to_sheet(data);
        // Ajouter la feuille de calcul au classeur
        XLSX.utils.book_append_sheet(wb, ws, 'Emploi du temps');
        // Sauvegarder le classeur au format Excel
        XLSX.writeFile(wb, title);
    };

    const extractTableData = () => {
        const tableData = [];
        const tableBody = document.getElementById('myTable');
        if (tableBody) {
            const rows = tableBody.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                const rowData = [];
                const cells = rows[i].getElementsByTagName('td');
                for (let j = 0; j < cells.length; j++) {
                    rowData.push(cells[j].textContent ?? '');
                }
                tableData.push(rowData);
            }
        }
        return tableData;
    };
    
    


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

   
    const filterNiveauxForUser = () => {
        const filteredNiveaux = niveaux.filter(niveau => {
            for (const prop in userNiveaux) {
                if (userNiveaux.hasOwnProperty(prop)) {
                    if (userNiveaux[prop].niveau === niveau._id) {
                        return true;
                    }
                }
            }
            return false;
        });
        console.log(userNiveaux);
    };
    
    
    useEffect(() => {
        filterNiveauxForUser();
        if (filteredCycle && filteredCycle.length > 0) {
            if(!selectCycleId){
                filterNiveauxByCycle(filteredCycle[0]?._id);
            }else{
                filterNiveauxByCycle(selectCycleId);
            }
                
        }   
        if (roles.delegue === currentUser.role || roles.etudiant === currentUser.role) {
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau => niveau.annee === selectedYear)?.niveau);
            const currentCycle = cycles.find(cycle => cycle._id === currentNiveau?.cycle)
            setSection(sections.find(section => section._id === currentCycle?.section));
            setCycle(currentCycle);
            setNiveau(currentNiveau);
            setSelectIdSection(section?._id);
            setSelectIdCycle(cycle?._id);
            setSelectIdNiveau(niveau?._id);
        } 
            
    }, [filteredCycle]);
    
    useEffect(() => {
        const fetchPeriodes = async () => {
            dispatch(setPeriodeLoading(true));
            try {
                
                const periodes:PeriodeReturnGetType={
                    periodes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };
                if (selectNiveauId) {
                    const fetchedPeriodes = await getPeriodesByNiveau({ niveauId: selectNiveauId, annee: selectedYear, semestre: selectedSemestre });
                    dispatch(setPeriodes(fetchedPeriodes));
                }else{
                    dispatch(setPeriodes(periodes)); 
                }
                dispatch(setErrorPagePeriode(null));
            } catch (error) {
                dispatch(setErrorPagePeriode(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setPeriodeLoading(false));
            }
        };

        fetchPeriodes();
    }, [dispatch, selectedYear, selectedSemestre, selectNiveauId, t]);
    

    return (
        <div>
            {roles.admin === userRole || roles.superAdmin === userRole && <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.periode_cours')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />
            </div>}

            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.emploie_temps')}</h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear,firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2]}
                                defaultValue={1} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                selectedItem={section}
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                items={filteredCycle}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                selectedItem={cycle}
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                items={filteredNiveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                selectedItem={niveau}
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
                            <CustomDropDown2<number>
                                title={t('label.semestre')}
                                selectedItem={selectedSemestre}
                                items={[1, 2]}
                                defaultValue={currentSemester} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                selectedItem={section}
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                items={filteredCycle}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                selectedItem={cycle}
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                items={filteredNiveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                selectedItem={niveau}
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
                                : data.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <tbody id="myTable"></tbody>
                        }




                    </table>
                </div>

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div>

        </div>
    );
};


export default Table;