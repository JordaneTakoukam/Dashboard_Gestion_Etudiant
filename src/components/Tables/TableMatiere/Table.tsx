import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { setErrorPageMatiere, setMatiereLoading, setMatieres } from "../../../_redux/features/matiere_slice";
import { getMatieresByEnseignantNiveau, getMatieresByNiveau, getMatieresByNiveauWithPagination } from "../../../api/api_matiere";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import * as XLSX from 'xlsx';
import { setCycles, setSections } from "../../../_redux/features/data_setting_slice";

interface TableMatiereProps {
    data: MatiereType[];
    onCreate:()=>void;
    onEdit: (matiere : MatiereType) => void;
    onAddChap:(matiere : MatiereType)=>void;
    onAddEnseignement:(matiere:MatiereType)=>void;
}

const Table = ({ data, onCreate, onEdit, onAddChap, onAddEnseignement}: TableMatiereProps) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    // const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections:CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const pageIsLoading = useSelector((state: RootState) => state.matiereSlice.pageIsLoading);
    const [section, setSection] = useState<CommonSettingProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    // const niveauxEnseignantIds = currentUser?.niveaux.map(inscription => inscription.niveau) ?? [];

    // // Filtrer les niveaux de l'utilisateur enseignant
    // const niveauxEnseignant = niveaux.filter(niveau => niveau._id && niveauxEnseignantIds.includes(niveau._id));
    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');

    const [filteredSection, setFilteredSection] = useState<CommonSettingProps[]>([]);
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
            }else{
                setSelectIdCycle(undefined);
                setCycle(undefined);
            }
            setFilteredCycle(result);
          
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
            }else{
                setSelectIdNiveau(undefined);
                setNiveau(undefined);
            }
            setFilteredNiveaux(result);
        }
    };
    const [formatToDownload, setFormatToDownload] = useState("");

    const fetchAllMatieres = async () => {
        try {
            
            if (selectNiveauId) {
                const fetchedMatieres = await getMatieresByNiveau({ niveauId: selectNiveauId});
                return fetchedMatieres.matieres;
            }
                // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageMatiere(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
        }
    }
    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        const mats = await fetchAllMatieres().then((matieres)=>{
            let title = "liste_des_matieres";
            if(lang !== 'fr'){
                title = "subjects_list";
            }
            if(selected === 'PDF'){

            }else if (selected === 'CSV'){

            }else{
                exportToExcel(title+".xlsx", matieres)
            }
        })
        
    };

    const exportToExcel = ( filename: string,matieres: MatiereType[] | undefined) => {
        if(matieres){
            const wb = XLSX.utils.book_new();
            
            // Créer une feuille de calcul
            const ws = XLSX.utils.aoa_to_sheet([
                [t('label.matieres'), "CM", "TD", "TP"],
                ...matieres.flatMap(matiere => {
                    const rows = [];
        
                    // Vérifier si matiere.chapitres est défini
                    if (matiere.chapitres) {
                        rows.push([`${matiere.code} : ${lang==='fr'?matiere.libelleFr:matiere.libelleEn}`]);
        
                        // Parcourir les chapitres
                        matiere.chapitres.forEach(chapitre => {
                            rows.push([
                                lang==='fr'?chapitre.libelleFr:chapitre.libelleEn,
                                chapitre.typesEnseignement.length>0 && chapitre.typesEnseignement[0].volumeHoraire || "", // Volume horaire pour le premier type d'enseignement
                                chapitre.typesEnseignement.length>1 && chapitre.typesEnseignement[1].volumeHoraire || "", // Volume horaire pour le deuxième type d'enseignement
                                chapitre.typesEnseignement.length>2 && chapitre.typesEnseignement[2].volumeHoraire || ""  // Volume horaire pour le troisième type d'enseignement
                            ]);
                        });
                    }
        
                    rows.push([
                        (t('label.approche_ped'))+":"+(lang==='fr'?matiere.approchePedFr:matiere.approchePedEn), 
                    ]);
                    rows.push([
                        (t('label.prerequis'))+":"+(lang==='fr'?matiere.prerequisFr:matiere.prerequisEn),
                    ]);
                    rows.push([
                        (t('label.evaluation_acquis'))+":"+(lang==='fr'?matiere.evaluationAcquisFr:matiere.evaluationAcquisEn),
                    ]);
                    let objectifs="";
                    if(matiere.chapitres){
                        matiere.chapitres.forEach(chapitre => {
                            if(chapitre.objectifs){
                               
                                chapitre.objectifs.forEach(objectif => {
                                    if(objectifs.length>0){
                                        objectifs=objectifs+","+(lang==='fr'?objectif.libelleFr:objectif.libelleEn)
                                    }else{
                                        objectifs=(lang==='fr'?objectif.libelleFr:objectif.libelleEn)
                                    }
                                    
                                })
                            }
                        });
                    }
                    rows.push([
                        (t('label.competences_acquis'))+":"+objectifs,
                    ]);
                    rows.push(Array(4).fill("")); // Espacement entre les matières
        
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
    
     // recuperer l'id de la section suite au click sur l'input select
     const handleSectionSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
        }
    };

    // valeur de la l'id du cycle selectionner    
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            filterNiveauxByCycle(selected._id);
            setCycle(selected);
        }
    };

    // valeur de la l'id du niveau selectionner    
    const handleNiveauSelect = (selected: NiveauProps | undefined) => {
        if (selected && selected?._id) {
            setSelectIdNiveau(selected._id);
            setNiveau(selected)
        }
    };

    // Filtrer les matières en fonction de la langue
    const filterMatiereByContent = (matieres: MatiereType[]) => {
        if (searchText === '') {
            const result: MatiereType[] = matieres;
            return result;
        }
        return matieres.filter(matiere => {
            const libelle = lang === 'fr' ? matiere.libelleFr : matiere.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return matiere.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    

     // variable pour la pagination
     const itemsPerPage = useSelector((state: RootState) => state.matiereSlice.data.pageSize); // nombre delements maximum par page
     const [currentPage, setCurrentPage] = useState<number>(1);
 
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
     const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // remplacer les donnes de body du tableau par ceci !
     const count =useSelector((state: RootState) => state.matiereSlice.data.totalItems);
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
 
     const startItem = currentPage === Math.ceil(count / itemsPerPage) ? count - itemsPerPage + 1 : indexOfFirstItem + 1;
     const endItem = Math.min(count, indexOfLastItem);

    //fournir initialement les données à la page
    // Effet pour filtrer les options des CustomDropDown
    
    // const filteredCycles = cycles.filter(cycle =>
    //     niveauxEnseignant.some(niveau => niveau.cycle === cycle._id)
    // );
    // const filteredSections = sections.filter(section =>
    //     filteredCycles.some(cycle => cycle.section === section._id)
    // );
    useEffect(() => {
        setFilteredSection(sections);       
    }, []);
    useEffect(() => {
        if(!selectSectionId){
            console.log("if");
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
        
        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyMatieres : MatiereReturnGetType={
                    matieres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if (selectNiveauId) {
                    let fetchedMatieres=null;
                    if(currentUser && currentUser.role===roles.enseignant){
                        fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: selectNiveauId, enseignantId: currentUser._id });
                    }else{
                        fetchedMatieres = await getMatieresByNiveauWithPagination({ niveauId: selectNiveauId, page: currentPage });
                    }
                    
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                        console.log(fetchedMatieres)
                    } else {
                        
                        dispatch(setMatieres(emptyMatieres));
                    }
                } else{
                    dispatch(setMatieres(emptyMatieres));
                }
                    // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageMatiere(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchMatieres();
    }, [dispatch, selectNiveauId, t]); // Déclencher l'effet lorsque currentPage change

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<MatiereType[]>(data);

    useEffect(() => {
        const result = filterMatiereByContent(data);
        setFilteredData(result);
    }, [searchText, data]);

    
    

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {roles.admin === currentUser.role || roles.superAdmin === currentUser.role && (<ButtonCreate
                    title={t('boutton.nouvelle_matiere')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText={t('recherche.rechercher')+t('recherche.matiere')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.matiere')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            {/* <CustomDropDown2<String>
                                title={t('label.annee')}
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            /> */}
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={filteredSection}
                                defaultValue={filteredSection[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: CommonSettingProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={filteredCycle[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={filteredNiveaux[0]} // ou spécifie une valeur par défaut
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
                            {/* <CustomDropDown2<String>
                                title={t('label.annee')}
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            /> */}
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={filteredSection}
                                defaultValue={filteredSection[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: CommonSettingProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={filteredCycle[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CycleProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                selectedItem={niveau}
                                items={filteredNiveaux}
                                defaultValue={filteredNiveaux[0]} // ou spécifie une valeur par défaut
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
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} onAddChap={onAddChap} onAddEnseignement={onAddEnseignement}/>
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