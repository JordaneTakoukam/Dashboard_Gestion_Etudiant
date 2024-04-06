import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { setShowModal } from "../../../_redux/features/setting";
import { RootState } from "../../../_redux/store";
import ErrorTable from "../common/ErrorTable";

interface TableCategorieProps {
    data: CommonSettingProps[];
    onCreate: () => void;
    onEdit: (categorie: CommonSettingProps) => void;
}

const Table = ({ data, onCreate, onEdit }: TableCategorieProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    // Filtrer les régions en fonction de la langue
    const filterCategories = (categories: CommonSettingProps[]) => {
        return categories.filter(categorie => {
            const libelle = lang === 'fr' ? categorie.libelleFr : categorie.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return categorie.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    // Régions filtrées en fonction du texte de recherche
    const filteredCategories = filterCategories(data);

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvelle_categorie')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />

                <InputSearch hintText={t('recherche.rechercher') + t('recherche.categorie')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}

            {/* Afficher le tableau */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />

                        {/* corp du tableau*/}
                        <BodyTable data={filteredCategories} onEdit={onEdit} />

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
