import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store.tsx';
import { getProgressionGlobalEnseignantsNiveau } from '../../api/api_objectif.tsx';
import { getFirstTenEventsOfYear } from '../../api/api_evenement.tsx';
import { getPeriodesAVenirByNiveau } from '../../api/api_periode.tsx';
import { setSections, setCycles, setNiveaux } from '../../_redux/features/data_setting_slice.tsx';
import { updateUserAbsences } from '../../_redux/features/user_slice.tsx';
import { apiGetAbsencesByUserAndFilter } from '../../api/discipline/api_discipline.tsx';
import { nbTotalAbsences } from '../../fonctions/fonction.tsx';

const DashBoardStudent = () => {
    const { t } = useTranslation();
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [periodes, setPeriodes] = useState<PeriodeType[]>([]);
    const [progression, setProgression] = useState<number>(0);
    const [nbAbsence, setNbAbsence] = useState<string>("0");
    const [currentNiveauId, setCurrentNiveauId] = useState<string | undefined>(undefined);

    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    
    // Récupérer les données du store
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];

    const dispatch = useDispatch();
    
    // Référence pour éviter les doublons
    const hasFilteredRef = useRef(false);

    // useEffect 1 : Chargement des données de base
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('📊 Début du chargement des données étudiant...');

                // 1. Déterminer le niveau actuel de l'étudiant
                const inscriptionAnnee = currentUser.niveaux.find(niveau => niveau.annee === currentYear);
                if (!inscriptionAnnee) {
                    console.warn('⚠️ Aucune inscription trouvée pour l\'année', currentYear);
                    return;
                }

                const niveauActuel = niveaux.find(niveau => niveau._id === inscriptionAnnee.niveau);
                if (niveauActuel?._id) {
                    setCurrentNiveauId(niveauActuel._id);
                    console.log('✅ Niveau actuel identifié:', niveauActuel._id);

                    // 2. Charger la progression
                    const progressionGlobal = await getProgressionGlobalEnseignantsNiveau({
                        niveauId: niveauActuel._id,
                        annee: currentYear,
                        semestre: currentSemester
                    });
                    if (progressionGlobal !== null) {
                        setProgression(progressionGlobal);
                        console.log('✅ Progression chargée:', progressionGlobal);
                    }

                    // 3. Charger les périodes à venir
                    const periodeBecome = await getPeriodesAVenirByNiveau({
                        niveauId: niveauActuel._id,
                        annee: currentYear,
                        semestre: currentSemester
                    });
                    if (periodeBecome !== null && periodeBecome.periodes) {
                        setPeriodes(periodeBecome.periodes);
                        console.log('✅ Périodes chargées:', periodeBecome.periodes.length);
                    }
                }

                // 4. Charger les événements
                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                    console.log('✅ Événements chargés:', eventsOfYear.evenements.length);
                }

                // 5. Charger les absences
                const absences = await apiGetAbsencesByUserAndFilter({
                    userId: currentUser._id,
                    annee: currentYear,
                    semestre: currentSemester
                });
                if (absences) {
                    dispatch(updateUserAbsences(absences));
                    setNbAbsence(nbTotalAbsences(absences));
                    console.log('✅ Absences chargées:', nbTotalAbsences(absences));
                }

                console.log('✅ Chargement du dashboard étudiant terminé');

            } catch (error) {
                console.error("❌ Erreur lors du chargement des données:", error);
            }
        };

        fetchData();
    }, [dispatch, currentYear, currentSemester, currentUser._id, currentUser.niveaux, niveaux]);

    // useEffect 2 : Filtrage des niveaux, cycles et sections
    useEffect(() => {
        if (currentUser.niveaux &&
            currentUser.niveaux.length > 0 &&
            niveaux.length > 0 &&
            cycles.length > 0 &&
            sections.length > 0 &&
            !hasFilteredRef.current) {

            console.log('🔍 Début du filtrage des niveaux, cycles et sections...');
            console.log('📊 Données disponibles:');
            console.log('  - Niveaux dans store:', niveaux.length);
            console.log('  - Cycles dans store:', cycles.length);
            console.log('  - Sections dans store:', sections.length);
            console.log('  - Niveaux étudiant:', currentUser.niveaux);

            // 1. Extraire les IDs des niveaux de l'étudiant
            const niveauxEtuIds = currentUser.niveaux.map(inscription => inscription.niveau);
            console.log('🔑 IDs des niveaux de l\'étudiant:', niveauxEtuIds);

            // 2. Filtrer les niveaux de l'étudiant
            const niveauxEtu = niveaux.filter(niveau =>
                niveau._id && niveauxEtuIds.includes(niveau._id)
            );
            console.log('📚 Niveaux filtrés:', niveauxEtu);

            if (niveauxEtu.length === 0) {
                console.warn('⚠️ Aucun niveau trouvé après filtrage');
                console.log('Debug - Niveaux disponibles:', niveaux.map(n => ({ id: n._id, nom: n.libelleFr })));
                console.log('Debug - IDs recherchés:', niveauxEtuIds);
                return;
            }

            // 3. Filtrer les cycles correspondants
            const filteredCycles = cycles.filter(cycle =>
                niveauxEtu.some(niveau => niveau.cycle === cycle._id)
            );
            console.log('🔄 Cycles filtrés:', filteredCycles);

            // 4. Filtrer les sections correspondantes
            const filteredSections = sections.filter(section =>
                filteredCycles.some(cycle => cycle.section === section._id)
            );
            console.log('📂 Sections filtrées:', filteredSections);

            // 5. Mettre à jour le Redux store
            if (niveauxEtu.length > 0) {
                dispatch(setNiveaux(niveauxEtu));
                console.log('✅ Niveaux mis à jour dans le store');
            }
            if (filteredCycles.length > 0) {
                dispatch(setCycles(filteredCycles));
                console.log('✅ Cycles mis à jour dans le store');
            }
            if (filteredSections.length > 0) {
                dispatch(setSections(filteredSections));
                console.log('✅ Sections mises à jour dans le store');
            }

            // 6. Marquer comme effectué
            hasFilteredRef.current = true;
            console.log('✅ Filtrage terminé avec succès');
        }
    }, [currentUser.niveaux, niveaux, cycles, sections, dispatch]);

    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className='flex flex-col md:flex-row gap-3 justify-between '>
                <div className="flex flex-col gap-y-3">
                    <CardDashboard
                        title={t('tableau_de_bord.nombre_total_absence')}
                        value={nbAbsence + ' H'}
                        id={1}
                    />
                    <CardDashboard
                        title={t('tableau_de_bord.progression')}
                        id={4}
                        progressionValue={progression}
                    />
                    <CardAlertRecente />
                </div>

                <CardCourProgrammer listCourProgrammer={periodes} />
                <CardEvenement listEvenement={evenements} />
            </div>
        </>
    );
};

export default DashBoardStudent;