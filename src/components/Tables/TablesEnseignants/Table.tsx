import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTableEnseignant from "./HeaderTable";
import BodyTableEnseignant from "./BodyTable";
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { setErrorPageEnseignant, setEnseignant, setEnseignantsLoading, setEnseignantsLoadingOnTable, setSelectedEnseignant, resetSelectedEnseignant } from "../../../_redux/features/enseignant_slice";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import * as XLSX from 'xlsx';
import { apiGetEnseignants, apiGetEnseignantsWithPagination } from "../../../api/other_users/api_enseignant";
import Bouton from "../../ui/Bouton";
import LoadingOnTable from "../common/LoadingOnTable";

interface TableEnseignantProps {
    data: EnseignantType[];
    onCreate: () => void;
    onEdit: (enseignant: EnseignantType) => void;
}

const Table = ({ data, onCreate, onEdit }: TableEnseignantProps) => {



    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    const grades = useSelector((state: RootState) => state.dataSetting.dataSetting.grades) ?? [];
    const categories = useSelector((state: RootState) => state.dataSetting.dataSetting.categories) ?? [];
    const services = useSelector((state: RootState) => state.dataSetting.dataSetting.services) ?? [];
    const fonctions = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions) ?? [];

    // state save
    const selectSave = useSelector((state: RootState) => state.enseignantSlice.selected);
    const [grade, setGrade] = useState<CommonSettingProps | undefined>(selectSave.grade);
    const [categorie, setCatgeorie] = useState<CommonSettingProps | undefined>(selectSave.categorie);
    const [service, setService] = useState<CommonSettingProps | undefined>(selectSave.service);
    const [fonction, setFonction] = useState<CommonSettingProps | undefined>(selectSave.fonction);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [searchText, setSearchText] = useState<string>('');



    const [formatToDownload, setFormatToDownload] = useState("");

    const fetchAllEnseignants = async () => {
        try {
            let gradeId = undefined;
            let categorieId = undefined;
            let serviceId = undefined;
            let fonctionId = undefined;
            if (grade) {
                gradeId = grade._id;
            }
            if (categorie) {
                categorieId = categorie._id;
            }
            if (service) {
                serviceId = service._id;
            }
            if (fonction) {
                fonctionId = fonction._id;
            }

            const fetchedEnseignants = await apiGetEnseignants({ grade: gradeId, categorie: categorieId, service: serviceId, fonction: fonctionId });
            return fetchedEnseignants.enseignants;

            // Réinitialisez les erreurs s'il y en a
        } catch (error) {
            dispatch(setErrorPageEnseignant(t('message.erreur')));
            createToast(t('message.erreur'), "", 2)
        } finally {
            dispatch(setEnseignantsLoading(false)); // Définissez le loading à false après le chargement
        }
    }
    const handleDownloadSelect = async (selected: string) => {
        setFormatToDownload(selected);
        await fetchAllEnseignants().then((enseignants) => {
            let title = "liste_des_enseignants_"
            if (lang !== 'fr') {
                title = "subjects_list_"
            }
            if (selected === 'PDF') {

            } else if (selected === 'CSV') {

            } else {
                exportToExcel(title + ".xlsx", enseignants)
            }
        })

    };

    const exportToExcel = (filename: string, enseignants: EnseignantType[] | undefined) => {
        if (enseignants) {
            const wb = XLSX.utils.book_new();

            // Créer une feuille de calcul
            const ws = XLSX.utils.aoa_to_sheet([
                [t('label.matricule'), t('label.nom'), t('label.prenom'), t('label.genre'), t('label.email'), t('label.date_naiss'), t('label.lieu_naiss'), t('label.grade'), t('label.categorie'), t('label.service'), t('label.fonction')],
                ...enseignants.flatMap(enseignant => {
                    const rows = [];
                    const gradeLib = lang === 'fr' ? grades.find(grade => grade._id === enseignant.grade)?.libelleFr || "" : grades.find(grade => grade._id === enseignant.grade)?.libelleEn || "";
                    const categorieLib = lang === 'fr' ? categories.find(categorie => categorie._id === enseignant.categorie)?.libelleFr || "" : categories.find(categorie => categorie._id === enseignant.categorie)?.libelleEn || "";
                    const serviceLib = lang === 'fr' ? services.find(service => service._id === enseignant.service)?.libelleFr || "" : services.find(service => service._id === enseignant.service)?.libelleEn || "";
                    const fonctionLib = lang === 'fr' ? fonctions.find(fonction => fonction._id === enseignant.fonction)?.libelleFr || "" : fonctions.find(fonction => fonction._id === enseignant.fonction)?.libelleEn || "";
                    rows.push([enseignant.matricule, enseignant.nom, enseignant.prenom, enseignant.genre, enseignant.email, enseignant.date_naiss ? enseignant.date_naiss?.split("T")[0] : "", enseignant.lieu_naiss, gradeLib, categorieLib, serviceLib, fonctionLib]);
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
        } else {

        }
    }


    // recuperer l'id de la grade suite au click sur l'input select
    const handleGradeSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(selected);
            dispatch(setSelectedEnseignant({ key: "grade", value: selected }))
            setCatgeorie(undefined);
            setService(undefined);
            setFonction(undefined);
        }
    };

    const handleCatgorieSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(undefined);
            setCatgeorie(selected);
            dispatch(setSelectedEnseignant({ key: "categorie", value: selected }))
            setService(undefined);
            setFonction(undefined);
        }
    };

    const handleServiceSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(undefined);
            setCatgeorie(undefined);
            setService(selected);
            dispatch(setSelectedEnseignant({ key: "service", value: selected }))

            setFonction(undefined);
        }
    };

    const handleFonctionSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(undefined);
            setCatgeorie(undefined);
            setService(undefined);
            setFonction(selected);
            dispatch(setSelectedEnseignant({ key: "fonction", value: selected }))

        }
    };

    // Filtrer les matières en fonction de la langue
    const filterEnseignantByContent = (enseignants: EnseignantType[]) => {
        if (searchText === '') {
            const result: EnseignantType[] = enseignants;
            return result;
        }
        return enseignants.filter(enseignant => {
            const prenom = enseignant?.prenom || "";
            // Vérifie si le code ou le libellé contient le texte de recherche
            return enseignant.nom.toLowerCase().includes(searchText.toLowerCase()) || prenom.toLowerCase().includes(searchText.toLowerCase());
        });
    };



    // variable pour la pagination
    const itemsPerPage = useSelector((state: RootState) => state.enseignantSlice.data.pageSize); // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);
    const count = useSelector((state: RootState) => state.enseignantSlice.data.totalItems);
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

    // ceci c'est pour ne pas relancer un nouveau fetch de enseignants pourtant celui si a deja etait fait initialement sur la page plus haut
    const [isInitialMount, setIsInitialMount] = useState(true);

    const pageIsLoadingOnTable = useSelector((state: RootState) => state.enseignantSlice.pageIsLoadingOnTable);
    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        const fetchEnseignants = async () => {
            dispatch(setEnseignantsLoadingOnTable(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyEnseignants: EnseignantListGetType = {
                    enseignants: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                let gradeId = undefined;
                let categorieId = undefined;
                let serviceId = undefined;
                let fonctionId = undefined;
                if (grade) {
                    gradeId = grade._id;
                }
                if (categorie) {
                    categorieId = categorie._id;
                }
                if (service) {
                    serviceId = service._id;
                }
                if (fonction) {
                    fonctionId = fonction._id;
                }

                const fetchedEnseignants = await apiGetEnseignantsWithPagination({ page: currentPage, grade: gradeId, categorie: categorieId, service: serviceId, fonction: fonctionId });
                if (fetchedEnseignants) { // Vérifiez si fetchedEnseignants n'est pas faux, vide ou indéfini
                    dispatch(setEnseignant(fetchedEnseignants));
                } else {
                    dispatch(setEnseignant(emptyEnseignants));
                }

                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageEnseignant(t('message.erreur')));
            } finally {
                dispatch(setEnseignantsLoadingOnTable(false));
            }
        }

        fetchEnseignants();

    }, [dispatch, grade, categorie, service, fonction, currentPage, t]); // Déclencher l'effet lorsque currentPage change

    // modifier les données de la page lors de la recherche ou de la sélection de la grade
    const [filteredData, setFilteredData] = useState<EnseignantType[]>(data);

    useEffect(() => {
        const result = filterEnseignantByContent(data);
        setFilteredData(result);
    }, [searchText, data]);
    const handleRefreshFilters = () => {
        setGrade(undefined);
        setCatgeorie(undefined);
        setService(undefined);
        setFonction(undefined);
        dispatch(resetSelectedEnseignant(["grade", "categorie", "fonction", "service"]))
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {roles.admin === userRole || roles.superAdmin === userRole && (
                <ButtonCreate
                    title={t('boutton.nouvelle_enseignant')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />)}
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.enseignant')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.enseignant')} <Bouton
                    iconeSmall={true}
                    circle={true}
                    typeRefresh={true}
                    // titreBouton={t('boutton.actualiser')}
                    onClick={handleRefreshFilters}
                /></h1>

                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.grade')}
                                selectedItem={grade}
                                items={grades}
                                defaultValue={grade} // ou spécifie une valeur par défaut
                                displayProperty={(grade: CommonSettingProps) => `${lang === 'fr' ? grade.libelleFr : grade.libelleEn}`}
                                onSelect={handleGradeSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.categorie')}
                                selectedItem={categorie}
                                items={categories}
                                defaultValue={categorie} // ou spécifie une valeur par défaut
                                displayProperty={(categorie: CommonSettingProps) => `${lang === 'fr' ? categorie.libelleFr : categorie.libelleEn}`}
                                onSelect={handleCatgorieSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.service')}
                                selectedItem={service}
                                items={services}
                                defaultValue={service} // ou spécifie une valeur par défaut
                                displayProperty={(service: CommonSettingProps) => `${lang === 'fr' ? service.libelleFr : service.libelleEn}`}
                                onSelect={handleServiceSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.fonction')}
                                selectedItem={fonction}
                                items={fonctions}
                                defaultValue={fonction} // ou spécifie une valeur par défaut
                                displayProperty={(fonction: CommonSettingProps) => `${lang === 'fr' ? fonction.libelleFr : fonction.libelleEn}`}
                                onSelect={handleFonctionSelect}
                            />

                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.grade')}
                                selectedItem={grade}
                                items={grades}
                                defaultValue={grade} // ou spécifie une valeur par défaut
                                displayProperty={(grade: CommonSettingProps) => `${lang === 'fr' ? grade.libelleFr : grade.libelleEn}`}
                                onSelect={handleGradeSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.categorie')}
                                selectedItem={categorie}
                                items={categories}
                                defaultValue={categorie} // ou spécifie une valeur par défaut
                                displayProperty={(categorie: CommonSettingProps) => `${lang === 'fr' ? categorie.libelleFr : categorie.libelleEn}`}
                                onSelect={handleCatgorieSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.service')}
                                selectedItem={service}
                                items={services}
                                defaultValue={service} // ou spécifie une valeur par défaut
                                displayProperty={(service: CommonSettingProps) => `${lang === 'fr' ? service.libelleFr : service.libelleEn}`}
                                onSelect={handleServiceSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.fonction')}
                                selectedItem={fonction}
                                items={fonctions}
                                defaultValue={fonction} // ou spécifie une valeur par défaut
                                displayProperty={(fonction: CommonSettingProps) => `${lang === 'fr' ? fonction.libelleFr : fonction.libelleEn}`}
                                onSelect={handleFonctionSelect}
                            />

                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 relative min-h-[250px]">
                    <table className="w-full table-auto ">
                        {/* en tete du tableau */}

                        {
                            <HeaderTableEnseignant />
                        }

                        {/* corp du tableau*/}
                        {
                            pageIsLoadingOnTable ?
                                <LoadingOnTable /> :
                                <BodyTableEnseignant
                                    data={filteredData}
                                    onEdit={onEdit} />
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
