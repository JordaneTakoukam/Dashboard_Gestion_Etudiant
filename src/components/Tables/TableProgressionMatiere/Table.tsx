import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import ProgressBar from "@ramonak/react-progress-bar";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from "../../../_redux/features/progession_matiere_slice";
import { getMatieresByEnseignantNiveau, getMatieresByNiveau } from "../../../api/api_matiere";
import createToast from "../../../hooks/toastify";
import LoadingTable from "../common/LoadingTable";
import * as XLSX from 'xlsx';
import { config } from "../../../config";

const Table = ({ data, matieres }: { data: MatiereType, matieres:MatiereType[] }) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    //Calcul de la progression de chaque leçon
    const calculateProgress = (matiere : MatiereType | undefined) => {
        let totalObjectifs = 0;
        let objectifsAvecEtat1 = 0;
        if(matiere && matiere.chapitres){
            matiere.chapitres.forEach((chapitre) => {
                if(chapitre.objectifs){
                    totalObjectifs += chapitre.objectifs.length;
                    chapitre.objectifs.forEach((objectif) => {
                        if (objectif.etat === 1) {
                            objectifsAvecEtat1++;
                        }
                    });
                }
                
            });
        }
        
    
        const progress = totalObjectifs === 0 ? 0 : (objectifsAvecEtat1 / totalObjectifs) * 100;
    
        return parseFloat(progress.toFixed(2));
    };

    // let matiere:Matiere=listMatieres[0];
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const pageIsLoading = useSelector((state: RootState) => state.progressionMatiereSlice.pageIsLoading);
    const [section, setSection] = useState<CommonSettingProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [matiere, setMatiere] = useState<MatiereType>();
    const [filteredMatiere, setFilteredMatiere] = useState<MatiereType | undefined>(data);
    const [formatToDownload, setFormatToDownload] = useState("");
    const [progress, setProgress] = useState(calculateProgress(data));
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;

    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const [selectNiveauId, setSelectIdNiveau] = useState<string | undefined>('');

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

    // filtrer les donnee a partir de l'id du niveau selectionner
    const filterMatiereByNiveau = (niveauId: string | undefined) => {
        
        if (niveauId && niveauId !== '') {
            
        }
    };


    // recuperer l'id de la section suite au click sur l'input select
    const handleSectionSelect = (selected: CommonSettingProps | undefined) => {
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

    const handleMatiereSelect = (selected: MatiereType | undefined) => {
        setFilteredMatiere(selected);
        setMatiere(selected)
        setProgress(calculateProgress(selected));
        console.log(selected)
    };

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
            let title = "progression_par_matiere";
            if(lang !== 'fr'){
                title = "subjects_progression";
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
                [t('label.matieres'), t('label.progression')],
                ...matieres.flatMap(matiere => {
                    const rows = [];
                    rows.push([`${matiere.code} : ${lang==='fr'?matiere.libelleFr:matiere.libelleEn}`,calculateProgress(matiere)+" %"]);
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

    //fournir initialement les données à la page
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
        if (roles.delegue === currentUser.role || roles.etudiant === currentUser.role) {
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau => niveau.annee === currentYear)?.niveau);
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
        if (filteredNiveaux && filteredNiveaux.length > 0) {
            if(!selectNiveauId){
                filterMatiereByNiveau(filteredNiveaux[0]?._id);
            }else{
                filterMatiereByNiveau(selectNiveauId);
            }
                
        }        
    }, [filteredNiveaux]);
    useEffect(() => {
        const fetchMatieres = async () => {
            const matieres : ProgressionMatiereReturnGetType = {
                matieres: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            }
            if (sections.length > 0 && cycles.length > 0 && niveaux.length > 0) {
                dispatch(setMatiereLoading(true)); // Définir le chargement à true avant de récupérer les données
                try {
                    
                   
                    if (selectNiveauId) {
                        
                        let fetchedMatieres = null
                        if(currentUser && currentUser.role===roles.enseignant){
                            fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: selectNiveauId, enseignantId: currentUser._id });
                        }else{
                            fetchedMatieres = await getMatieresByNiveau({ niveauId: selectNiveauId });
                        }

                        if(fetchedMatieres){
                            dispatch(setMatieres(fetchedMatieres));    
                        }else{
                            dispatch(setMatieres(matieres));    
                        }
                        
                    }else{
                        dispatch(setMatieres(matieres));
                    }
                    dispatch(setErrorPageMatiere(null)); // Réinitialiser les erreurs s'il y en a
                } catch (error) {
                    dispatch(setErrorPageMatiere(t('message.erreur')));
                    createToast(t('message.erreur'), "", 2);
                } finally {
                    dispatch(setMatiereLoading(false)); // Définir le chargement à false après avoir récupéré les données
                }
            }else{
                dispatch(setMatieres(matieres));
            }
        };

        fetchMatieres();
    }, [dispatch, selectNiveauId, t]);

    useEffect(() => {
        if (matieres && matieres.length > 0) {
            console.log('if');
            // Sélectionner la première matière et mettre à jour les états nécessaires
            setFilteredMatiere(matieres[0]);
            setMatiere(matieres[0])
            setProgress(calculateProgress(matieres[0]));
        }else{
            setFilteredMatiere(undefined);
            setProgress(0);
        }
    }, [matieres]);


    return (
        <div>
            
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.progression')} </h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
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
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                selectedItem={section}
                                displayProperty={(section: CommonSettingProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                items={filteredCycle}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                selectedItem={cycle}
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                items={filteredNiveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                selectedItem={niveau}
                                displayProperty={(niveau: CommonSettingProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />                         
                            {/* <CustomDropDown2<String>
                                title={t('label.semestre')}
                                items={["1", "2"]}
                                defaultValue={"1"} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            /> */}
                            <CustomDropDown2<MatiereType>
                                title={t('label.matiere')}
                                selectedItem={matiere}
                                items={matieres}
                                defaultValue={matieres[0]} // ou spécifie une valeur par défaut
                                displayProperty={(matiere: MatiereType) => `${lang === 'fr'?matiere.libelleFr:matiere.libelleEn}`}
                                onSelect={handleMatiereSelect}
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
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                selectedItem={section}
                                displayProperty={(section: CommonSettingProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                items={filteredCycle}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                selectedItem={cycle}
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<NiveauProps>
                                title={t('label.niveau')}
                                items={filteredNiveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                selectedItem={niveau}
                                displayProperty={(niveau: CommonSettingProps) => `${lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}`}
                                onSelect={handleNiveauSelect}
                            />
                            {/* <CustomDropDown2<String>
                                title={t('label.semestre')}
                                items={["1", "2"]}
                                defaultValue={"1"} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            /> */}
                            <CustomDropDown2<MatiereType>
                                title={t('label.matiere')}
                                selectedItem={matiere}
                                items={matieres}
                                defaultValue={matieres[0]} // ou spécifie une valeur par défaut
                                displayProperty={(matiere: MatiereType) => `${lang === 'fr'?matiere.libelleFr:matiere.libelleEn}`}
                                onSelect={handleMatiereSelect}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    {
                    progress == null ?
                        <h4 className={`text-[22px] font-bold ml-1 pb-[50px] lg:pb-[40px] `}>
                            {/* {value} */}
                        </h4> :
                        <div className="w-full mt-2">
                            <ProgressBar completed={progress}  />

                        </div>}
                </div>


                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />:
                                // : !data.chapitres?
                                //     <NoDataTable/> :
                                    <HeaderTable matiere={filteredMatiere} />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredMatiere} />
                        }




                    </table>
                </div>

                {/* Pagination */}

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;