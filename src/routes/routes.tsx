import Cycles from '../pages/Admin/Cycles';
import DisciplineDesEnseignants from '../pages/Admin/Disciplines/Enseignant/DisciplineEnseignant';
import DisciplineEtudiants from '../pages/Admin/Disciplines/Etudiant/DisciplineEtudiant';
import ListeDesEnseignant from '../pages/Admin/ListeEnseignants';
import ListeDesEtudiants from '../pages/Admin/ListeEtudiants';
import ListeDesMatieres from '../pages/Admin/ListeMatieres';
import Niveaux from '../pages/Admin/Niveaux';
import ProgressionMatiere from '../pages/Admin/ProgressionMatiere';
import SallesDeCours from '../pages/Admin/SallesDeCours';
import Sections from '../pages/Admin/Sections';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
import MonProfil from '../pages/CommonPage/Profil';
import Services from '../pages/Admin/Services';
import Fonctions from '../pages/Admin/Fonctions';
import Grades from '../pages/Admin/Grades';
import Categories from '../pages/Admin/Categories';
import Regions from '../pages/Admin/Regions';
import Communes from '../pages/Admin/Communes';
import ListeDesAdministrateur from '../pages/Admin/ListeAdministrateurs';
import { Departements } from '../pages/Admin/Departements';
import ListeDesPeriodesEnseignement from '../pages/Admin/PeriodeEnseignement';
import Chapitres from '../pages/Admin/Chapitres';
import ProgressionPeriode from '../pages/Admin/ProgressionPeriode';
import GererAbsencesEnseignant from '../pages/Admin/Disciplines/Enseignant/GererAbsencesEnseignant';
import AbsenceSignalerEnseignant from '../pages/Admin/Disciplines/Enseignant/AbsenceSignalerEnseignant';
import AbsenceSignalerEtudiant from '../pages/Admin/Disciplines/Etudiant/AbsenceSignalerEtudiant';
import GererAbsencesEtudiant from '../pages/Admin/Disciplines/Etudiant/GererAbsencesEtudiant';
import Objectifs from '../pages/Admin/Objectifs';
import Enseignements from '../pages/Admin/Enseignements';
import EnseignementsPeriode from '../pages/Admin/EnseignementsPeriode';
import DepartementsAcademique from '../pages/Admin/DepartementsAcademique';
import Promotions from '../pages/Admin/Promotions';
import Documents from '../pages/CommonPage/Documents';
import ProgressionChapitre from '../pages/Admin/ProgressionChapitre';
import QRCodeGenerator from '../pages/Admin/QRCode';
import PresencePaie from '../pages/Admin/PresencePaie';
import Permissions from '../pages/Admin/Permissions';
import UserPermissions from '../pages/CommonPage/UserPermissions';
import SupportDeCours from '../pages/CommonPage/SupportDeCours';
import Abscences from '../pages/CommonPage/Abscences';
import Devoirs from '../pages/CommonPage/Devoirs';
import Questions from '../pages/CommonPage/Questions';
import TestPage from '../pages/CommonPage/Test';



const coreRoutes = [
  // etudiants
  {
    path: '/students/student-list',
    title: 'Liste des étudiants',
    component: ListeDesEtudiants,
    permissions:["gerer_etudiants"]
  },
  {
    path: '/students/disciplines',
    title: 'Disciplines des étudiants',
    component: DisciplineEtudiants,
    permissions:["consulter_liste_etudiant"]
  },


  // enseignants
  {
    path: '/teachers/teacher-list',
    title: 'Liste des enseignants',
    component: ListeDesEnseignant,
    permissions:["gerer_enseignants"]
  },
  {
    path: '/teachers/disciplines',
    title: 'Disciplines des enseignants',
    component: DisciplineDesEnseignants,
    permissions:["consulter_liste_enseignant"]
  },
  {
    path: '/teachers/presence-paie',
    title: 'Présence et Paie',
    component: PresencePaie,
    permissions:["consulter_presence_enseignant"]
  },
 
  {
    path: '/teachers/disciplines/manage',
    title: 'Disciplines des étudiants',
    component: GererAbsencesEnseignant,
    permissions:["consulter_liste_enseignant"]
  },
  //  absence signaler
  {
    path: '/teachers/absence_reporting',
    title: '',
    component: AbsenceSignalerEnseignant,
  },

  {
    path: '/students/disciplines/manage',
    title: 'Disciplines des étudiants',
    component: GererAbsencesEtudiant,
    permissions:["consulter_liste_etudiant"]
  },

  {
    path: '/absences',
    title: 'Liste des abscences',
    component: Abscences,
    permissions:["consulter_liste_absence"]
  },

  {
    path: '/students/absence_reporting',
    title: '',
    component: AbsenceSignalerEtudiant,
  },


  // matieres
  {
    path: '/subjects/subject-list',
    title: 'Liste des matières',
    component: ListeDesMatieres,
    permissions:["gerer_matieres", "consulter_liste_matieres"]
  },

  {
    path: '/subjects/chapitres/manage',
    title: 'Liste des chapitres',
    component: Chapitres,
    permissions:["gerer_chapitres","consulter_liste_chapitres"]
  },

  {
    path: '/subjects/objectifs/manage',
    title: 'Liste des objectifs',
    component: Objectifs,
    permissions:["gerer_objectifs", "consulter_liste_objectifs"]
  },

  {
    path: '/subjects/enseignements/manage',
    title: 'Liste des enseignements',
    component: Enseignements,
    permissions:["gerer_activites_pedagogiques"]
  },

  {
    path: '/subjects/progression-par-chapitre',
    title: 'Progréssion',
    component: ProgressionChapitre,
    permissions:["gerer_progression_cours_chapitre", "consulter_progression_cours_chapitre"]
  },

  {
    path: '/subjects/progressions-par-matiere',
    title: 'Progréssion par matiere',
    component: ProgressionMatiere,
    permissions:["gerer_progression_cours_objectif", "consulter_progression_cours_objectif"]
  },
  

  {
    path: '/subjects/progressions-par-periode',
    title: 'Progréssion par période',
    component: ProgressionPeriode,
    permissions:["consulter_progression_periodes_enseignements"]
  },

  {
    path: '/subjects/periodes_enseignement',
    title: 'Periodes d\'enseignement',
    component: ListeDesPeriodesEnseignement,
    permissions:["gerer_periodes_enseignements"]
  },

  {
    path: '/subjects/periodes_enseignement/enseignements/manage',
    title: 'Liste des enseignements d\'une periode d\'enseignement',
    component: EnseignementsPeriode,
    permissions:["gerer_periodes_enseignements"]
  },
  // salles de cours
  {
    path: '/classrooms',
    title: 'classrooms',
    component: SallesDeCours,
    permissions:["gerer_salles"]
  },

  

  // structuraction academique
  {
    path: '/academic-levels/departements',
    title: 'Département académique',
    component: DepartementsAcademique,
    permissions:["gerer_departements"]
  },
  {
    path: '/academic-levels/sections',
    title: 'Sections',
    component: Sections,
    permissions:["gerer_sections"]
  },
  
  {
    path: '/academic-levels/grades',
    title: 'Cycles',
    component: Cycles,
    permissions:["gerer_cycles"]
  },
  {
    path: '/academic-levels/levels',
    title: 'Niveaux',
    component: Niveaux,
    permissions:["gerer_niveaux"]
  },
  {
    path: '/academic-levels/promotions',
    title: 'Promotions',
    component: Promotions,
    permissions:["gerer_promotions"]
  },

  // emploi de temps
  {
    path: '/schedules',
    title: 'Emploi de temps',
    component: EmploiDeTemp,
    permissions:["gerer_emplois_du_temps", "consulter_emplois_du_temps"]
  },

  // calendrier academique
  {
    path: '/academic-calendar',
    title: 'Calendrier académique',
    component: CalendrierAcademique,
    permissions:["gerer_calendrier_academique", "consulter_calendrier_academique"]
  },

  // documents
  {
    path: '/documents',
    title: 'Documents',
    component: Documents,
    permissions:["gerer_documents", "consulter_liste_documents"]
  },

  // parametres
  // profil
  {
    path: '/parametres/profile',
    title: 'Mon profil',
    component: MonProfil,
    permissions:["gerer_profil"]
  },

  {
    path: '/parametres/admins',
    title: 'Liste des administrateurs',
    // component: Administration,
    component: ListeDesAdministrateur,
    permissions:["gerer_administrateurs"]
  },
  {
    path: '/parametres/qr-code',
    title: 'QR Code',
    component: QRCodeGenerator,
    permissions:["gerer_qr_code"]
  },

  // {
  //   path: '/parametres/current-year-semester',
  //   title: 'Année et Semestre courant',
  //   component: AnneeSemestre,
  // },

  {
    path: '/parametres/services',
    title: 'Services',
    component: Services,
    permissions:["gerer_services"]
  },

  {
    path: '/parametres/fonctions',
    title: 'Fonctions',
    component: Fonctions,
    permissions:["gerer_fonctions"]
  },

  {
    path: '/parametres/grades',
    title: 'Grades',
    component: Grades,
    permissions:["gerer_grades"]
  },

  {
    path: '/parametres/categories',
    title: 'Catégories',
    component: Categories,
    permissions:["gerer_categories"]
  },

  {
    path: '/parametres/regions',
    title: 'Régions',
    component: Regions,
    permissions:["gerer_regions"]
  },
  {
    path: '/parametres/departements',
    title: 'Départements',
    component: Departements,
    permissions:["gerer_departements_region"]
  },
  {
    path: '/parametres/communes',
    title: 'Communes',
    component: Communes,
    permissions:["gerer_communes"]
  },
  {
    path: '/parametres/permissions',
    title: 'Permissions',
    component: Permissions,
    permissions:["gerer_permissions"]
  },
  
  {
    path: '/user/permissions',
    title: 'Permissions utilisateur',
    component: UserPermissions,
    permissions:["consulter_permissions"]
  },

  {
    path: '/pedagogies/course-materials',
    title: 'Supports de cours',
    component: SupportDeCours,
    permissions:["gerer_supports_cours_formateurs", "gerer_supports_cours_etudiants", "consulter_supports_cours_formateurs", "consulter_supports_cours_etudiants"]
  },

  {
    path: '/pedagogies/exercise-book',
    title: 'Cahier d\'exercice',
    component: Devoirs,
    permissions:["gerer_cahiers_exercices", "consulter_cahiers_exercices"]
  },

  {
    path: '/pedagogies/questions/manage',
    title: 'Liste des questions',
    component: Questions,
    permissions:["gerer_questions","consulter_liste_questions"]
  },

  {
    path: '/pedagogies/tests/manage',
    title: 'Tests',
    component: TestPage,
    permissions:["gerer_questions"]
  },

];

const routes = [...coreRoutes];
export default routes;
