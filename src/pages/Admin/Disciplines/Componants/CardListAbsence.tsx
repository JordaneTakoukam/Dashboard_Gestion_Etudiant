import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { RootState } from "../../../../_redux/store";
import { useSelector } from "react-redux";
import { MdDateRange, MdDeleteForever, MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { nbTotalAbsences } from "../../../../fonctions/fonction";

interface CardListAbsenceProps {
    listAbsence: AbsenceType[];
    onEdit: (enseignant: UserDiscipline, isHourRemove: boolean) => void;
}

const CardListAbsence: React.FC<CardListAbsenceProps> = ({ listAbsence, onEdit }) => {
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language);
    const [showAllDates, setShowAllDates] = useState<{ [monthYear: string]: boolean }>({});

    const groupAbsencesByMonthYear = () => {
        const groupedAbsences: { [monthYear: string]: { [date: string]: AbsenceType[] } } = {};

        listAbsence.forEach((absence) => {
            const monthYear = format(new Date(absence.dateAbsence), lang === "fr" ? "MMMM yyyy" : "MMMM yyyy");
            const date = format(new Date(absence.dateAbsence), lang === "fr" ? "dd MMMM yyyy" : "dd MMMM yyyy");

            if (!groupedAbsences[monthYear]) {
                groupedAbsences[monthYear] = {};
            }
            if (!groupedAbsences[monthYear][date]) {
                groupedAbsences[monthYear][date] = [];
            }
            groupedAbsences[monthYear][date].push(absence);
        });

        return groupedAbsences;
    };


    const toggleDateGroup = (monthYear: string) => {
        setShowAllDates(prevState => ({
            ...prevState,
            [monthYear]: !prevState[monthYear]
        }));
    };

    const renderAbsenceList = () => {
        const groupedAbsences = groupAbsencesByMonthYear();

        return Object.entries(groupedAbsences).map(([monthYear, absencesByDate], index) => (
            <div key={index} >
                <div className={`
                ${showAllDates[monthYear] && 'bg-primary text-white'}
                flex items-center justify-start gap-x-1 mb-2 cursor-pointer hover:bg-primary hover:text-white p-2`} onClick={() => toggleDateGroup(monthYear)}>
                    <MdDateRange />
                    <h3 className="font-semibold">{monthYear}</h3>
                    {showAllDates[monthYear] ? <MdExpandLess /> : <MdExpandMore />}
                </div>

                {showAllDates[monthYear] && Object.entries(absencesByDate).map(([date, absences], idx) => (
                    <div key={idx} className="flex">
                        <div className=" bg-primary w-0.5 rounded-full ml mr-8"></div>

                        <div className="flex flex-col w-full">
                            <div className={` 
                        ${showAllDates[date] && 'bg-form-strokedark text-white'}
                        flex px-5 items-center justify-start gap-x-1 mb-2 cursor-pointer hover:bg-form-strokedark hover:text-white p-2`} onClick={() => toggleDateGroup(date)}>
                                <h3 className="font-semibold">{date}</h3>
                                {showAllDates[date] ? <MdExpandLess /> : <MdExpandMore />}
                            </div>

                            {showAllDates[date] && absences.map((absence, i) => (
                                <div className="flex  ml-0" key={i}>
                                    <div className=" bg-form-strokedark w-0.5 rounded-full  mr-2"></div>
                                    <div className="flex justify-between items-center w-full hover:bg-[#1111] duration-300 px-4 rounded-sm py-1 mb-1">
                                        <p>{`${absence.heureDebut} - ${absence.heureFin}`}</p>
                                        <p>{nbTotalAbsences(listAbsence)} {listAbsence.length > 1 ? t('menu.heure_d_absence') : t('menu.heures_d_absences')} </p>
                                        <button
                                            className="text-meta-1 flex justify-center items-center hover:underline"
                                        // onClick={() => onEdit(absence, true)}
                                        >
                                            <MdDeleteForever className=" hover:underline grou" />
                                            {t('Retirer')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        listAbsence.length === 0 ? (
            <div className={`
            flex items-center justify-center
                my-4
                text-black bg-white
                dark:bg-boxdark dark:text-gray
                relative rounded-sm border border-stroke  py-20 px-5 shadow-default dark:border-strokedark  w-full`}
            >
                <p>{t('gestion_absence.aucune_heure_d_absence_pendant_ce_semestre')}</p>
            </div>
        ) :

            <div className={`
            my-4
            text-black bg-white
            dark:bg-boxdark dark:text-gray
            relative rounded-sm border border-stroke pb-10  py-6 px-5 shadow-default dark:border-strokedark  w-full`}
            >
                <h1 className="font-semibold text-primary mb-8">{t('gestion_absence.liste_des_heures_d_absences_de_ce_semenstre')}</h1>

                {renderAbsenceList()}
            </div>
    );
};

export default CardListAbsence;
