import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal, setShowModalCreate } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import Pagination from "../../Pagination/Pagination";
import { setEvenementLoading, setEvenements, setErrorPageEvenement } from "../../../_redux/features/evenement_slice";
import { getAllEvenementsByYear, getEvenementsByYear } from "../../../api/api_evenement";
import createToast from "../../../hooks/toastify";
import { extractYear, formatYear, generateYearRange } from "../../../fonctions/fonction";
import { PageErreur } from "../../_Global/PageErreur";
import cheerio from 'cheerio';
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';


interface TableEvenementProps {
    data: EvenementType[];
    onCreate: () => void;
    onEdit: (evenement: EvenementType) => void;
    refresh: () => void;
}



const Table = ({ data, onCreate, onEdit, refresh }: TableEvenementProps) => {
    const { t } = useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.evenementSlice.pageIsLoading);
    const pageError = useSelector((state: RootState) => state.evenementSlice.pageError);
    const dispatch = useDispatch();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024;
    const etats = useSelector((state: RootState) => state.dataSetting.dataSetting.etatsEvenement) ?? [];
    

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [selectedYear, setSelectedYear] = useState<number>(currentYear); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [formatToDownload, setFormatToDownload] = useState("");

    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        if (selected) {
            setSelectedYear(extractYear(selected.toString()));
        }

        console.log(selectedYear)
    };
    const [searchText, setSearchText] = useState<string>('');
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    // Filtrer les évènement en fonction de la langue
    const filterEventByContent = (evenements: EvenementType[]) => {
        if (searchText === '') {
            const result: EvenementType[] = evenements;
            return result;
        }
        return evenements.filter(evenement => {
            const libelle = lang === 'fr' ? evenement.libelleFr : evenement.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return evenement.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };
    
    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        const event = await fetchAllEvenements(selectedYear).then((evenements)=>{

            if(evenements){
                if(selected === 'PDF'){
                    generatePDF();
                }else if (selected === 'CSV'){
                    exportToCsv("test.csv", evenements)
                    // downloadCSV();
                }else{
                    exportToExcel('testt.xlsx', evenements)
                }
            }
        });
        
        
        // methode pour download
    };

    const generatePDF = async () => {
        try {
            const htmlString = await fillTemplate(); // Générer le HTML
            console.log(htmlString);
            const pdf = new jsPDF({
                format: 'a4',
                unit: 'px',
                
            });

            pdf.html(htmlString, {
                margin: [20, 20, 20, 20], // Marges du format A4
                callback: () => {
                    
                    pdf.save('output.pdf');
                    console.log('PDF généré avec succès');
                }
            });
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
        }
    };
    const fillTemplate = async () => {
        try {
            const templateHTML = await fetch('./calendrier.html');
            const htmlString = await templateHTML.text();
            const $ = cheerio.load(htmlString); // Charger le template HTML avec cheerio
            const userTable = $('table');
            const rowTemplate = $('.row_template');

            for (const event of filteredData) {
                const clonedRow = rowTemplate.clone();
                clonedRow.find('#libelle').text(event.libelleFr);
                clonedRow.find('#periode').text(event.periodeFr);
                clonedRow.find('#personnel').text(event.personnelFr);
                clonedRow.find('#description_observation').text(event.descriptionObservationFr);
                userTable.append(clonedRow);
            }

            return $.html(); // Récupérer le HTML mis à jour
        } catch (error) {
            console.error('Erreur lors du remplissage du template :', error);
            return '';
        }
    };

    const exportToExcel = (filename: string, evenements:EvenementType[]) => {
        try {
            // Filtrer les entêtes se terminant par "Fr" et ceux qui ne se terminent ni par "Fr" ni par "En"
            var headers = Object.keys(evenements[0]).filter(
                header => !['_id', '__v', 'date_creation', 'code'].includes(header) 
                && (header.endsWith("Fr") || (!header.endsWith("Fr") && !header.endsWith("En")))
            );
            if(lang !=='fr'){
                headers = Object.keys(evenements[0]).filter(
                    header => !['_id', '__v', 'date_creation', 'code'].includes(header) 
                    && (header.endsWith("En") || (!header.endsWith("En") && !header.endsWith("Fr")))
                );
            }
            
            // Filtrer les données pour ne récupérer que les propriétés correspondantes aux entêtes sélectionnés
            const filteredDataForExport = evenements.map(item => {
                const filteredItem: Record<string, any> = {};
                
                headers.forEach(header => {
                    if (item && Object.prototype.hasOwnProperty.call(item, header)) {
                        if (header === 'etat') {
                            // Rechercher l'état correspondant dans la liste des états
                            const etat = etats.find(etat => etat._id === item[header]);
                            // Si l'état est trouvé, utiliser son libellé, sinon utiliser l'identifiant ObjectId
                            filteredItem[header] = etat ? etat.libelleFr : item[header];
                        } else if (header === 'dateDebut' || header === 'dateFin') {
                            // Séparer la date de l'heure et ne garder que la partie date
                            const datePart = item[header].split('T')[0];
                            filteredItem[header] = datePart;
                        } else {
                            filteredItem[header] = item[header as keyof typeof item]?.toString();
                        }
                    }
                });
                
                return filteredItem;
            });
            
            // Renommer les entêtes du tableau d'objets
            const renamedDataForExport = filteredDataForExport.map(item => {
                const renamedItem: Record<string, any> = {};
                
                Object.keys(item).forEach(key => {
                    switch (key) {
                        case 'libelleFr':
                        case 'libelleEn':
                            renamedItem[t('label.libelle')] = item[key];
                            break;
                        case 'dateDebut':
                            renamedItem[t('label.date_debut')] = item[key];
                            break;
                        case 'dateFin':
                            renamedItem[t('label.date_fin')] = item[key];
                            break;
                        case 'periodeFr':
                        case 'periodeEn':
                            renamedItem[t('label.periode')] = item[key];
                            break;
                        case 'personnelFr':
                        case 'personnelEn':
                            renamedItem[t('label.personnel')] = item[key];
                            break;
                        case 'descriptionObservationFr':
                        case 'descriptionObservationEn':
                            renamedItem[t('label.description')] = item[key];
                            break;
                        case 'etat':
                            renamedItem[t('label.etat')] = item[key];
                            break;
                        case 'annee':
                            renamedItem[t('label.annee')] = item[key];
                            break;
                        default:
                            renamedItem[key] = item[key];
                            break;
                    }
                });
                
                return renamedItem;
            });
        
            // Convertir les données JSON filtrées en un tableau de feuilles de calcul
            const ws = XLSX.utils.json_to_sheet(renamedDataForExport);
            // Créer un nouveau classeur Excel
            const wb = XLSX.utils.book_new();
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
        } catch (error) {
            console.error('Erreur lors de l\'exportation vers Excel :', error);
        }
    };
    
    const convertArrayOfObjectsToCSV = (evenements: EvenementType[]) => {
        let csv = '';
        // Obtenir les entêtes CSV à partir des clés du premier objet
        const headers = Object.keys(evenements[0]).filter(header => header !== '_id' && header !== '__v');
        // Ajouter les entêtes CSV à la chaîne CSV
        csv += headers.join(';') + '\n';
        // Parcourir chaque objet dans les données et ajouter ses valeurs à la chaîne CSV
        evenements.forEach((item) => {
            headers.forEach((header, index) => {
                // Vérifier si la clé existe dans l'objet
                if (item && Object.prototype.hasOwnProperty.call(item, header)) {
                    // Échapper aux guillemets dans les valeurs
                    const escapedValue = item[header as keyof typeof item]?.toString().replace(/"/g, '""') ?? '';
                    // Encadrer les valeurs entre guillemets pour respecter le format CSV
                    csv += (index ? ';' : '') + `"${escapedValue}"`;
                }
            });
            // Aller à la ligne pour le prochain objet
            csv += '\n';
        });
    
        // Convertir la chaîne CSV en Blob avec l'encodage UTF-8
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    
        return blob;
    };
    
    
      
    const exportToCsv = (filename: string, evenements:EvenementType[]) => {
    try {
        const csv = convertArrayOfObjectsToCSV(evenements);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    } catch (error) {
        console.error('Erreur lors de la conversion en CSV :', error);
    }
    };
      
      


    // variable pour la pagination
    //

    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    // variable pour la pagination
    const itemsPerPage = useSelector((state: RootState) => state.evenementSlice.data.pageSize);; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // remplacer les donnes de body du tableau par ceci !
    const count = useSelector((state: RootState) => state.evenementSlice.data.totalItems);
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

    // Fonction pour récupérer les événements en fonction de l'année et de la page actuelle
    const fetchEvenements = async (annee: number, page: number) => {
        dispatch(setEvenementLoading(true)); // Définissez le loading à true avant le chargement
        try {
            const fetchedEvenements = await getEvenementsByYear({ annee: annee, page: page });
            // Mettez à jour l'état Redux avec les données récupérées
            dispatch(setEvenements(fetchedEvenements));
            // console.log(fetchedEvenements.evenements[0].etat);

            dispatch(setErrorPageEvenement(null)); // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEvenement(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEvenementLoading(false)); // Définissez le loading à false après le chargement
        }
    };

    const fetchAllEvenements = async (annee: number) => {
        dispatch(setEvenementLoading(true)); // Définissez le loading à true avant le chargement
        try {
            const fetchedEvenements = await getAllEvenementsByYear({ annee: annee});
            // Mettez à jour l'état Redux avec les données récupérées
           return fetchedEvenements.evenements;
            // console.log(fetchedEvenements.evenements[0].etat);

            dispatch(setErrorPageEvenement(null)); // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEvenement(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEvenementLoading(false)); // Définissez le loading à false après le chargement
        }
    };

    // Effet pour récupérer les événements initiaux lorsque le composant est monté ou lorsque la page change
    useEffect(() => {
        const annee = selectedYear; // Remplacez par l'année souhaitée
        fetchEvenements(annee, currentPage);
    }, [currentPage, selectedYear]); // Déclencher l'effet lorsque currentPage change

    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<EvenementType[]>(data);
    const [originalData, setOriginalData] = useState<EvenementType[]>(data); // Ajout d'une copie des données originales


    useEffect(() => {
        const result = filterEventByContent(data);
        setFilteredData(result);
    }, [searchText, data]);

   
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {roles.admin === userRole || roles.superAdmin === userRole && (<ButtonCreate
                    title={t('boutton.nouvel_evenement')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.evenement')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.evenement')}</h1>
                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
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
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
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
                                : pageError ?
                                    <PageErreur onRefresh={refresh} />

                                    : filteredData.length === 0 ?
                                        <NoDataTable /> :
                                        <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit} />
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
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;

