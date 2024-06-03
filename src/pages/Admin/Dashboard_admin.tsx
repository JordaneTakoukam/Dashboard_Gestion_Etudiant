import Breadcrumb from "../../components/Breadcrumb";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import { CardEvenement } from "../../components/CardDashboard/CardEvenement";
import { ChartEtudiantSection, DataPair } from "../../components/Chart/ChartEtudiantParNiveau";
import { ChartAbsenceEtudiantSection } from "../../components/Chart/ChartAbscenceEtudiant";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useEffect, useState } from "react";
import { apiGetNbAbsenceEtudiantsParSection, apiGetNbEtudiantsParSection, apiGetTotalEtudiantByYear } from "../../api/other_users/api_etudiant";
import { apiGetTotalEnseignants } from "../../api/other_users/api_enseignant";
import { getFirstTenEventsOfYear } from "../../api/api_evenement";
import { getProgressionGlobalEnseignants } from "../../api/api_objectif";
import { apiGetTotalHoursOfAbsenceByStudent, apiGetTotalHoursOfAbsenceByTeacher } from "../../api/discipline/api_discipline";
import { setShowModal } from "../../_redux/features/setting";
import FormCreateUpdate from "../../components/Modals/ModalDashbord/FormCreateUpdate";

const DashBoardAmin = () => {
    const style = 'text-[13px] xl:text-[14px]';
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const sections:CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [totalAbsenceEtudiant, setTotalAbsenceEtudiant] = useState<number>(0);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [totalAbsenceEnseignant, setTotalAbsenceEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [progression, setProgression] = useState<number>(0);
    const [nbEtudiantParSection, setNbEtudiantParSection] = useState<DataPair[]>([]);
    const [nbAbsenceEtudiantParSection, setNbAbsenceEtudiantParSection] = useState<DataPair[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalEtudiantByYear = await apiGetTotalEtudiantByYear({ annee: currentYear });
                if (totalEtudiantByYear !== null) {
                    setTotalEtudiant(totalEtudiantByYear);
                }

                const totalAbsenceEtudiant = await apiGetTotalHoursOfAbsenceByStudent({annee:currentYear, semestre:currentSemester});
                if(totalAbsenceEtudiant!=null){
                    setTotalAbsenceEtudiant(totalAbsenceEtudiant);
                }

                const totalEnseignants = await apiGetTotalEnseignants();
                if (totalEnseignants !== null) {
                    setTotalEnseignant(totalEnseignants);
                }

                const totalAbsenceEnseignant = await apiGetTotalHoursOfAbsenceByTeacher({annee:currentYear, semestre:currentSemester});
                if(totalAbsenceEnseignant!=null){
                    setTotalAbsenceEnseignant(totalAbsenceEnseignant);
                }

                const progressionGlobal = await getProgressionGlobalEnseignants({annee:currentYear, semestre:currentSemester});
                if (progressionGlobal !== null) {
                    setProgression(progressionGlobal);
                }

                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                }


                const nbEtudiantSection = await apiGetNbEtudiantsParSection({ annee: currentYear });
                if (nbEtudiantSection !== null) {
                    const formattedData: DataPair[] = Object.entries(nbEtudiantSection).map(([sectionId, count]) => {
                        const sectionIndex = sections.findIndex(section => section._id === sectionId); // Trouver l'index de la section correspondant à l'ObjectId
                        const sectionLabel = sectionIndex !== -1 ? lang==='fr'?sections[sectionIndex].libelleFr:sections[sectionIndex].libelleEn : 'Unknown'; // Récupérer le libellé de la section ou 'Unknown' s'il n'est pas trouvé
                        return { name: sectionLabel, value: count };
                    });
                    // const formattedData: DataPair[] = Object.entries(nbEtudiantSection).map(([section, count]) => ({ name: section, value: count }));
                    setNbEtudiantParSection(formattedData);
                }

                const nbAbsenceEtudiantSection = await apiGetNbAbsenceEtudiantsParSection({ annee: currentYear, semestre:currentSemester });
                if (nbAbsenceEtudiantSection !== null) {
                    const formattedData: DataPair[] = Object.entries(nbAbsenceEtudiantSection).map(([sectionId, count]) => {
                        const sectionIndex = sections.findIndex(section => section._id === sectionId); // Trouver l'index de la section correspondant à l'ObjectId
                        const sectionLabel = sectionIndex !== -1 ? lang==='fr'?sections[sectionIndex].libelleFr:sections[sectionIndex].libelleEn : 'Unknown'; // Récupérer le libellé de la section ou 'Unknown' s'il n'est pas trouvé
                        return { name: sectionLabel, value: count };
                    });
                    // const formattedData: DataPair[] = Object.entries(nbEtudiantSection).map(([section, count]) => ({ name: section, value: count }));
                    setNbAbsenceEtudiantParSection(formattedData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentSemester, currentYear]);
    const dispatch = useDispatch();
    

    return (
        <>
            <Breadcrumb pageName={t('tableau_de_bord.title')} isDashboard={true} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-7.5">
                <button onClick={() => { dispatch(setShowModal()) }}>
                <CardDashboard title={t('tableau_de_bord.semestre_courant')} value={currentSemester.toString()} id={1} additionalStyle={style} />
                </button>
                
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={totalEtudiant.toString()} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={totalAbsenceEtudiant+' H'} id={1} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.total_enseignants')} value={totalEnseignant.toString()} id={3} additionalStyle={style} />
                {/* <CardDashboard title={t('tableau_de_bord.total_enseignants')} value={totalEnseignant.toString()} id={3} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_enseignants')} value={totalAbsenceEnseignant+' H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={progression}  /> */}
            </div>

            <div className="md:hidden mt-5 block">
                
                <CardDashboard title={t('tableau_de_bord.absences_enseignants')} value={totalAbsenceEnseignant+' H'} id={1} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.progression')} id={1} progressionValue={progression}  />
                <CardEvenement listEvenement={evenements} />
            </div>

            <div className="flex justify-between mt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 w-full mr-0 xl:mr-3">
                    <ChartEtudiantSection data={nbEtudiantParSection}/>
                    <ChartAbsenceEtudiantSection data={nbAbsenceEtudiantParSection} />
                </div>

                <div className="hidden md:block">
                    <CardDashboard title={t('tableau_de_bord.absences_enseignants')} value={totalAbsenceEnseignant+' H'} id={1} additionalStyle={style} />
                    <div className="mt-5">
                        <CardDashboard title={t('tableau_de_bord.progression')} id={1} progressionValue={progression}  />
                    </div>
                    <div className="mt-5">
                        <CardEvenement additionalStyle={'min-w-[350px] min-h-[471px]'} listEvenement={evenements} />
                    </div>
                </div>
            </div>
            <FormCreateUpdate />
        </>
    );
};

export default DashBoardAmin;
