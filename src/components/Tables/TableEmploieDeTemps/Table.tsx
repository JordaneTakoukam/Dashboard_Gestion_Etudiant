import { useDispatch, useSelector } from "react-redux";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import { PeriodeCours, jours } from "../../../pages/CommonPage/EmploiDeTemp";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { setShowModal } from "../../../_redux/features/setting";
import ButtonCreate from "../common/ButtonCreate";
import { Cycle, cycles } from "../../../pages/Admin/Cycles";
import { Niveau, niveaux } from "../../../pages/Admin/Niveaux";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";


interface TablePeriodeProps {
    data: PeriodeCours[];
    onCreate:()=>void;
    onEdit: (periode : PeriodeCours) => void;
}

const Table = ({ data, onCreate, onEdit }: TablePeriodeProps) => {
    const {t}=useTranslation();
    const ouvrirFormulairePeriode = (periode?: PeriodeCours) => {
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
            const groupedPeriodes: { [key: string]: PeriodeCours[] } = {};
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
                    const coursJour = periodes.find((cours) => cours.jour.ordre === jours.indexOf(jour) + 1);
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
                        jourCell.textContent = `${coursJour.matiere.code} (${coursJour.typeUE.code}) - ${coursJour.matiere.enseignant.nom} ${coursJour.matiere.enseignant.prenom}/${coursJour.matiere.enseignantSup?coursJour.matiere.enseignantSup.nom:"--"} - ${coursJour.salle.code}`;
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

    const pageIsLoading = false;
    const dispatch = useDispatch();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreSection, setFiltreSection] = useState("");
    const [filtreCycle, setFiltreCycle] = useState("");
    const [filtreNiveau, setFiltreNiveau] = useState("");
    const [filtreSemestre, setFiltreSemestre] = useState("");
    const [formatToDownload, setFormatToDownload] = useState("");

    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        console.log(selected)
    };

    // const handleSectionSelect = (selected: Section | undefined) => {
    //     // setFiltreSection(selected);
    //     console.log(selected);
    // };

    const handleCycleSelect = (selected: Cycle | undefined) => {
        // setFiltreCycle(selected);
        console.log(selected);
    };
    
    const handleNiveauSelect = (selectedNiveau: Niveau | undefined) => {
        // Logique à exécuter lorsque le niveau est sélectionné
        // console.log("Niveau sélectionné :", selectedNiveau);
    };
    const handleSemestreSelect = (selected: String | undefined) => {
        // setFiltreSemestre(selected);
        console.log(selected);
    };

    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };


    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    

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
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            />
                            {/* <CustomDropDown2<Section>
                                title={t('label.section')}
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: Section) => `${section.libelle}`}
                                onSelect={handleSectionSelect}
                            /> */}
                            <CustomDropDown2<Cycle>
                                title={t('label.cycle')}
                                items={cycles}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: Cycle) => `${cycle.libelle}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<Niveau>
                                title={t('label.niveau')}
                                items={niveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: Niveau) => `${niveau.libelle}`}
                                onSelect={handleNiveauSelect}
                            />
                            <CustomDropDown2<String>
                                title={t('label.semestre')}
                                items={["1", "2"]}
                                defaultValue={"1"} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Section" items={['Douane', 'Impôt']} defaultValue="Douane" onSelect={handleSectionSelect} />
                            <CustomDropDown title="Cycle" items={['Cycle A', 'Cycle B']} defaultValue="Cycle A" onSelect={handleCycleSelect} />
                            <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} /> */}
                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                        <CustomDropDown2<String>
                                title={t('label.annee')}
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            />
                            {/* <CustomDropDown2<Section>
                                title={t('label.section')}
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: Section) => `${section.libelle}`}
                                onSelect={handleSectionSelect}
                            /> */}
                            <CustomDropDown2<Cycle>
                                title={t('label.cycle')}
                                items={cycles}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: Cycle) => `${cycle.libelle}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<Niveau>
                                title={t('label.niveau')}
                                items={niveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: Niveau) => `${niveau.libelle}`}
                                onSelect={handleNiveauSelect}
                            />
                            <CustomDropDown2<String>
                                title={t('label.semestre')}
                                items={["1", "2"]}
                                defaultValue={"1"} // ou spécifie une valeur par défaut
                                onSelect={handleSemestreSelect}
                            />
                            {/* <CustomDropDown title="Année" items={['2023-2024', '2022-2023', '2021-2022']} defaultValue="2023-2024" onSelect={handleAnneeSelect} />
                            <CustomDropDown title="Section" items={['Douane', 'Impôt']} defaultValue="Douane" onSelect={handleSectionSelect} />
                            <CustomDropDown title="Cycle" items={['Cycle A', 'Cycle B']} defaultValue="Cycle A" onSelect={handleCycleSelect} />
                            <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauSelect} />
                            <CustomDropDown title="Semestre" items={['1', '2']} defaultValue="1" onSelect={handleSemestreSelect} /> */}
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
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;