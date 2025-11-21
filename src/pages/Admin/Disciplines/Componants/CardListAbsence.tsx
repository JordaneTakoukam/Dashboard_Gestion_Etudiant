import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { RootState } from "../../../../_redux/store";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdDateRange, MdDeleteForever, MdDone, MdExpandLess, MdExpandMore } from "react-icons/md";
import { calculAbsence, nbTotalAbsences, nbTotalAbsencesJustifier, nbTotalAbsencesNonJustifier } from "../../../../fonctions/fonction";


interface CardListAbsenceProps {
    user: UserDiscipline;
    onEdit: (absence: AbsenceType, isHourRemove: boolean, isJustify:boolean) => void;
}

const CardListAbsence: React.FC<CardListAbsenceProps> = ({ user, onEdit }) => {
    const { t } = useTranslation();

    const lang = useSelector((state: RootState) => state.setting.language);
    const [showAllDates, setShowAllDates] = useState<{ [monthYear: string]: boolean }>({});


    const groupAbsencesByMonthYear = () => {
        const groupedAbsences: { [monthYear: string]: { [date: string]: AbsenceType[] } } = {};

        user.absences.forEach((absence) => {
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

    const handleDeleteClick = (absence: AbsenceType, isHourRemove: boolean) => {
        onEdit(absence, isHourRemove, false);
    };

    const handleJustifierClick = (absence: AbsenceType, isJustify:boolean) => {
        onEdit(absence, false, isJustify);
    };

    const [absenceStates, setAbsenceStates] = useState<{ [absenceId: string]: boolean }>({});

    // Fonction pour déterminer l'état de chaque absence
    const determineAbsenceStates = () => {
        const states: { [absenceId: string]: boolean } = {};
        user.absences.forEach((absence) => {
            // Utilisez la valeur de la propriété 'etat' pour déterminer l'état de l'absence
            states[absence._id] = absence.etat === 1;
        });
        return states;
    };

    // Mettre à jour l'état initial des absences
    useEffect(() => {
        setAbsenceStates(determineAbsenceStates());
    }, [user.absences]);

    // Fonction pour changer l'état d'une absence
    const toggleAbsenceState = (absenceId: string) => {
        setAbsenceStates(prevStates => ({
            ...prevStates,
            [absenceId]: !prevStates[absenceId]
        }));
    };

    const renderAbsenceList = () => {
        const groupedAbsences = groupAbsencesByMonthYear();

        return Object.entries(groupedAbsences)
            .map(([monthYear, absencesByDate], index) => (
                <div key={index} >
                    <div className={`
                ${showAllDates[monthYear] && 'bg-primary text-white'}
                flex  items-center justify-start gap-x-1 mb-2 cursor-pointer  hover:bg-primary hover:text-white duration-300 p-2`} onClick={() => toggleDateGroup(monthYear)}>
                        <MdDateRange />
                        <h3 className="font-semibold">{monthYear}</h3>
                        {showAllDates[monthYear] ? <MdExpandLess /> : <MdExpandMore />}
                        <p className="pl-5">{nbTotalAbsences(Object.values(absencesByDate).flat())} H (Total) </p>
                        <p className="pl-5">{nbTotalAbsencesJustifier(Object.values(absencesByDate).flat())} H ({t('label.justifier')})  </p>
                        <p className="pl-5">{nbTotalAbsencesNonJustifier(Object.values(absencesByDate).flat())} H ({t('label.non_justifier')}) </p>
                    </div>

                    {showAllDates[monthYear] && Object.entries(absencesByDate).map(([date, absences], idx) => (
                        <div key={idx} className="flex">
                            <div className=" bg-primary w-0.5 rounded-full ml mr-8"></div>

                            <div className="flex flex-col w-full">
                                <div className={` 
                        ${showAllDates[date] && 'bg-form-strokedark text-white'}
                        flex px-5 items-center justify-start gap-x-1 mb-2 cursor-pointer hover:bg-form-strokedark hover:text-white  duration-300 p-2`} onClick={() => toggleDateGroup(date)}>
                                    <h3 className="font-semibold">{date}</h3>
                                    {showAllDates[date] ? <MdExpandLess /> : <MdExpandMore />}
                                    <p className="pl-5">{nbTotalAbsences(absences)} H (Total) </p>
                                    <p className="pl-5">{nbTotalAbsencesJustifier(absences)} H ({t('label.justifier')})</p>
                                    <p className="pl-5">{nbTotalAbsencesNonJustifier(absences)} H ({t('label.non_justifier')})</p>

                                </div>

                                {showAllDates[date] && absences.map((absence, i) => (
                                    <div className="flex  ml-0" key={i}>
                                        <div className=" bg-form-strokedark w-0.5 rounded-full  mr-2"></div>
                                        <div className="flex flex-col  lg:flex-row justify-start lg:justify-between items-start lg:items-center w-full hover:bg-[#1111] duration-300 px-4 rounded-sm py-3 lg:py-1 mb-1">
                                            <p>{`${absence.heureDebut} - ${absence.heureFin}`}</p>

                                            {/* <p >{nbTotalAbsences([absence])} {[absence].length > 1 ? t('menu.heure_d_absence') : t('menu.heures_d_absences')} </p> */}
                                            <p >{calculAbsence(absence)+" H"}</p>
                                            
                                            {absence?.dateCreation && (
                                                <p className="text-sm">
                                                    ({t('gestion_absence.ajouter_le')} : {lang === "fr" ?
                                                        new Date(absence?.dateCreation).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
                                                        : new Date(absence?.dateCreation).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} {t('gestion_absence.a')} {lang === "fr" ? `${new Date(absence?.dateCreation).getHours()}h${new Date(absence?.dateCreation).getMinutes()}` : new Date(absence?.dateCreation).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })})
                                                </p>
                                            )}

                                            {/* <button onClick={() => toggleAbsenceState(absence._id)}>
                                                {absenceStates[absence._id] ? "Justifiée" : "Non justifiée"}
                                            </button> */}
                                            
                                            <div className="flex">
                                            <button
                                                className={`mr-4 flex justify-center items-center hover:underline ${absence.etat == 0 ? 'text-red-500' : 'text-meta-3'}`}
                                                onClick={() => handleJustifierClick(absence, true)}
                                            >
                                                {absence.etat === 0 ? <MdClose className="hover:underline grou" /> : <MdDone className="hover:underline grou"/>}
                                                {absence.etat === 0 ? t('label.non_justifier') : t('label.justifier')}
                                            </button>
                                                <button
                                                    className="text-meta-1 flex justify-center items-center hover:underline"
                                                    onClick={() => handleDeleteClick(absence, true)}
                                                >
                                                    <MdDeleteForever className=" hover:underline grou" />
                                                    {t('Retirer')}
                                                </button>
                                                
                                            </div>
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
        <>
            {user.absences.length === 0 ? (
                <div className={`
            flex items-center justify-center
                my-4
                text-black bg-white
                dark:bg-boxdark dark:text-gray
                relative rounded-sm border border-stroke  py-24 px-5 shadow-default dark:border-strokedark  w-full`}
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
            }

        </>


    );
};

export default CardListAbsence;
