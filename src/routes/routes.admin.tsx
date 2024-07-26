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
import AnneeSemestre from '../pages/Admin/AnneeSemestreCourant';
import Services from '../pages/Admin/Services';
import Fonctions from '../pages/Admin/Fonctions';
import Grades from '../pages/Admin/Grades';
import Categories from '../pages/Admin/Categories';
import Regions from '../pages/Admin/Regions';
import Communes from '../pages/Admin/Communes';
import Rubriques from '../pages/Admin/Rubriques';
import GroupeQuestions from '../pages/Admin/GroupeQuestions';
import Questions from '../pages/Admin/Questions';
import ListeDesSondages from '../pages/Admin/Sondages';
import ListeDesAdministrateur from '../pages/Admin/ListeAdministrateurs';
import { Departements } from '../pages/Admin/Departements';
import ListeDesPeriodesEnseignement from '../pages/Admin/PeriodeEnseignement';
import Chapitres from '../pages/Admin/Chapitres';
import ProgressionPeriode from '../pages/Admin/ProgressionPeriode';
import GererAbsencesEnseignant from '../pages/Admin/Disciplines/Enseignant/GererAbsencesEnseignant';
import DisciplineDesEtudiants from '../pages/Admin/Disciplines/Etudiant/DisciplineEtudiant';
import AbsenceSignalerEnseignant from '../pages/Admin/Disciplines/Enseignant/AbsenceSignalerEnseignant';
import AbsenceSignalerEtudiant from '../pages/Admin/Disciplines/Etudiant/AbsenceSignalerEtudiant';
import GererAbsencesEtudiant from '../pages/Admin/Disciplines/Etudiant/GererAbsencesEtudiant';
import Objectifs from '../pages/Admin/Objectifs';
import Enseignements from '../pages/Admin/Enseignements';
import EnseignementsPeriode from '../pages/Admin/EnseignementsPeriode';
import DepartementsAcademique from '../pages/Admin/DepartementsAcademique';
import Promotions from '../pages/Admin/Promotions';
import Documents from '../pages/CommonPage/Documents';



const coreRoutes = [
  // etudiants
  {
    path: '/students/student-list',
    title: 'Liste des étudiants',
    component: ListeDesEtudiants,
  },
  {
    path: '/students/disciplines',
    title: 'Disciplines des étudiants',
    component: DisciplineEtudiants,
  },


  // enseignants
  {
    path: '/teachers/teacher-list',
    title: 'Liste des enseignants',
    component: ListeDesEnseignant,
  },
  {
    path: '/teachers/disciplines',
    title: 'Disciplines des enseignants',
    component: DisciplineDesEnseignants,
  },
  {
    path: '/students/disciplines',
    title: 'Disciplines des etudiant',
    component: DisciplineDesEtudiants,
  },
  {
    path: '/teachers/disciplines/manage',
    title: 'Disciplines des étudiants',
    component: GererAbsencesEnseignant,
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
  },

  {
    path: '/subjects/chapitres/manage',
    title: 'Liste des chapitres',
    component: Chapitres,
  },

  {
    path: '/subjects/objectifs/manage',
    title: 'Liste des objectifs',
    component: Objectifs,
  },

  {
    path: '/subjects/enseignements/manage',
    title: 'Liste des enseignements',
    component: Enseignements,
  },

  {
    path: '/subjects/progressions-par-matiere',
    title: 'Progréssion par matiere',
    component: ProgressionMatiere,
  },

  {
    path: '/subjects/progressions-par-periode',
    title: 'Progréssion par période',
    component: ProgressionPeriode,
  },

  {
    path: '/subjects/periodes_enseignement',
    title: 'Periodes d\'enseignement',
    component: ListeDesPeriodesEnseignement,
  },

  {
    path: '/subjects/periodes_enseignement/enseignements/manage',
    title: 'Liste des enseignements d\'une periode d\'enseignement',
    component: EnseignementsPeriode,
  },
  // salles de cours
  {
    path: '/classrooms',
    title: 'classrooms',
    component: SallesDeCours,
  },

  //sondages
  {
    path: '/sondages/rubriques',
    title: 'Rubriques',
    component: Rubriques
  },
  {
    path: '/sondages/groupe_de_question',
    title: 'Groupe de questions',
    component: GroupeQuestions
  },
  {
    path: '/sondages/questions',
    title: 'Questions',
    component: Questions
  },
  {
    path: '/sondages/liste_sondage',
    title: 'Liste des sondages',
    component: ListeDesSondages
  },

  // structuraction academique
  {
    path: '/academic-levels/departements',
    title: 'Département académique',
    component: DepartementsAcademique,
  },
  {
    path: '/academic-levels/sections',
    title: 'Sections',
    component: Sections,
  },
  
  {
    path: '/academic-levels/grades',
    title: 'Cycles',
    component: Cycles,
  },
  {
    path: '/academic-levels/levels',
    title: 'Niveaux',
    component: Niveaux,
  },
  {
    path: '/academic-levels/promotions',
    title: 'Promotions',
    component: Promotions,
  },

  // emploi de temps
  {
    path: '/schedules',
    title: 'Emploi de temps',
    component: EmploiDeTemp,
  },

  // calendrier academique
  {
    path: '/academic-calendar',
    title: 'Calendrier académique',
    component: CalendrierAcademique,
  },

  // documents
  {
    path: '/documents',
    title: 'Documents',
    component: Documents,
  },

  // parametres
  // profil
  {
    path: '/parametres/profile',
    title: 'Mon profil',
    component: MonProfil,
  },

  {
    path: '/parametres/admins',
    title: 'Liste des administrateurs',
    // component: Administration,
    component: ListeDesAdministrateur,
  },

  {
    path: '/parametres/current-year-semester',
    title: 'Année et Semestre courant',
    component: AnneeSemestre,
  },

  {
    path: '/parametres/services',
    title: 'Services',
    component: Services,
  },

  {
    path: '/parametres/fonctions',
    title: 'Fonctions',
    component: Fonctions,
  },

  {
    path: '/parametres/grades',
    title: 'Grades',
    component: Grades,
  },

  {
    path: '/parametres/categories',
    title: 'Catégories',
    component: Categories,
  },

  {
    path: '/parametres/regions',
    title: 'Régions',
    component: Regions,
  },
  {
    path: '/parametres/departements',
    title: 'Départements',
    component: Departements,
  },
  {
    path: '/parametres/communes',
    title: 'Communes',
    component: Communes,
  },

];

const routes = [...coreRoutes];
export default routes;
