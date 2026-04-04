import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store.tsx';
import { useState, useEffect, useRef } from 'react';
import { getProgressionGlobalEnseignantsNiveau } from '../../api/api_objectif.tsx';
import { getFirstTenEventsOfYear } from '../../api/api_evenement.tsx';
import { getPeriodesAVenirByNiveau } from '../../api/api_periode.tsx';
import { apiGetTotalEnseignants } from '../../api/other_users/api_enseignant.tsx';
import { apiGetTotalEtudiantByYear } from '../../api/other_users/api_etudiant.tsx';
import { setSections, setCycles, setNiveaux } from '../../_redux/features/data_setting_slice.tsx';
import { apiGetAbsencesByUserAndFilter } from '../../api/discipline/api_discipline.tsx';
import { updateUserAbsences } from '../../_redux/features/user_slice.tsx';
import { nbTotalAbsences } from '../../fonctions/fonction.tsx';

const DashboardDelegate = () => {
    const { t } = useTranslation();
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    
    // Récupérer les données du store
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    
    const dispatch = useDispatch();
    
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [periodes, setPeriodes] = useState<PeriodeType[]>([]);
    const [progression, setProgression] = useState<number>(0);
    const [nbAbsence, setNbAbsence] = useState<string>("0");
    const [currentNiveauId, setCurrentNiveauId] = useState<string | undefined>(undefined);
    
    // Référence pour éviter les doublons
    const hasFilteredRef = useRef(false);

    // useEffect 1 : Chargement des données
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('📊 Début du chargement des données délégué...');

                // 1. Déterminer le niveau actuel du délégué
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

                // 4. Charger le total des étudiants
                const totalEtudiantByYear = await apiGetTotalEtudiantByYear({ annee: currentYear });
                if (totalEtudiantByYear !== null) {
                    setTotalEtudiant(totalEtudiantByYear);
                    console.log('✅ Total étudiants chargé:', totalEtudiantByYear);
                }

                // 5. Charger les événements
                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                    console.log('✅ Événements chargés:', eventsOfYear.evenements.length);
                }

                // 6. Charger les absences
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

                console.log('✅ Chargement du dashboard délégué terminé');

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
            console.log('  - Niveaux délégué:', currentUser.niveaux);

            // 1. Extraire les IDs des niveaux du délégué
            const niveauxEtuIds = currentUser.niveaux.map(inscription => inscription.niveau);
            console.log('🔑 IDs des niveaux du délégué:', niveauxEtuIds);

            // 2. Filtrer les niveaux du délégué
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-3 2xl:gap-7.5">
                <CardDashboard
                    title={t('tableau_de_bord.semestre_courant')}
                    value={currentSemester.toString()}
                    id={1}
                />
                <CardDashboard
                    title={t('tableau_de_bord.total_etudiants')}
                    value={totalEtudiant.toString()}
                    id={2}
                />
                <CardDashboard
                    title={t('tableau_de_bord.progression')}
                    id={3}
                    progressionValue={progression}
                />
            </div>

            <div className='flex flex-col md:flex-row gap-3 mt-3'>
                <div className='gap-3'>
                    <CardDashboard
                        title={t('tableau_de_bord.nombre_total_absence')}
                        value={nbAbsence + ' H'}
                        id={2}
                    />

                    <div className='mt-3'>
                        <CardAlertRecente additionalStyle={'min-h-[250px]'} />
                    </div>
                </div>

                <CardCourProgrammer listCourProgrammer={periodes} />
                <CardEvenement listEvenement={evenements} />
            </div>
        </>
    );
};

export default DashboardDelegate;