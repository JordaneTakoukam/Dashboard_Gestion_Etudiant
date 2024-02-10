import Cycles from '../pages/Admin/Cycles';
import DisciplineDesEnseignants from '../pages/Admin/DisciplineEnseignant';
import DisciplineEtudiants from '../pages/Admin/DisciplineEtudiant';
import ListeDesEnseignant from '../pages/Admin/ListeEnseignants';
import ListeDesEtudiants from '../pages/Admin/ListeEtudiants';
import ListeDesMatieres from '../pages/Admin/ListeMatieres';
import Niveaux from '../pages/Admin/Niveaux';
import ProgressionMatiere from '../pages/Admin/ProgressionMatiere';
import SallesDeCours from '../pages/Admin/SallesDeCours';
import Sections from '../pages/Admin/Sections';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
import Administration from '../pages/Admin/Administration';
import MonProfil from '../pages/CommonPage/Profil';
import AnneeSemestre from '../pages/Admin/AnneeSemestreCourant';
import Services from '../pages/Admin/Services';
import Fonctions from '../pages/Admin/Fonctions';
import Grades from '../pages/Admin/Grades';
import Categories from '../pages/Admin/Categories';
import Regions from '../pages/Admin/Regions';
import Departements from '../pages/Admin/Departements';
import Communes from '../pages/Admin/Communes';
import Chapitres from '../pages/Admin/Chapitres';



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

  // matieres
  {
    path: '/subjects/subject-list',
    title: 'Liste des matières',
    component: ListeDesMatieres,
  },
  {
    path: '/subjects/subject-list/chapitres',
    title: 'Liste des chapitres de la matière',
    component: Chapitres,
  },
  {
    path: '/subjects/progressions',
    title: 'Progréssion',
    component: ProgressionMatiere,
  },

  // salles de cours
  {
    path: '/classrooms',
    title: 'classrooms',
    component: SallesDeCours,
  },

  // structuraction academique
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
    component: Administration,
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
