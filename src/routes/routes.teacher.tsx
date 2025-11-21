import Chapitres from '../pages/Admin/Chapitres';
import DisciplineEtudiants from '../pages/Admin/Disciplines/Etudiant/DisciplineEtudiant';
import GererAbsencesEtudiant from '../pages/Admin/Disciplines/Etudiant/GererAbsencesEtudiant';
import Enseignements from '../pages/Admin/Enseignements';
import ListeDesMatieres from '../pages/Admin/ListeMatieres';
import Objectifs from '../pages/Admin/Objectifs';
import ProgressionChapitre from '../pages/Admin/ProgressionChapitre';
import ProgressionMatiere from '../pages/Admin/ProgressionMatiere';
import ProgressionPeriode from '../pages/Admin/ProgressionPeriode';
import Abscences from '../pages/CommonPage/Abscences';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import Documents from '../pages/CommonPage/Documents';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
//import Matieres from '../pages/CommonPage/Matieres';
// import Parametres from '../pages/Admin/Administration';
import MonProfil from '../pages/CommonPage/Profil';
import UserPermissions from '../pages/CommonPage/UserPermissions';



const coreRoutes = [
  // discipline etudiant
  {
    path: '/teacher/discipline-students',
    title: 'Disciplines des étudiants',
    component: DisciplineEtudiants,
  },
  // abscence 
  {
    path: '/teacher/absences',
    title: 'Abscences enseignant',
    component: Abscences,
  },

  {
    path: '/students/disciplines/manage',
    title: 'Disciplines des étudiants',
    component: GererAbsencesEtudiant,
  },

  // // emploi de temps
  // {
  //   path: '/teacher/subjects',
  //   title: 'Matières',
  //   component: Matieres,
  // },
  //Matière
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
    path: '/subjects/progressions-chapitre',
    title: 'Progréssion',
    component: ProgressionChapitre,
  },

  {
    path: '/subjects/progressions',
    title: 'Progréssion',
    component: ProgressionMatiere,
  },

  {
    path: '/subjects/progressions-par-periode',
    title: 'Progréssion par période',
    component: ProgressionPeriode,
  },


  // emploi de temps
  {
    path: '/teacher/schedule',
    title: 'Emploi de temps',
    component: EmploiDeTemp,
  },

  {
    path: 'teacher/absences/schedule',
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

  // profil
  {
    path: '/parametres/profile',
    title: 'Mon profil',
    component: MonProfil,
  },
  {
    path: '/user/permissions',
    title: 'Permissions utilisateur',
    component: UserPermissions,
  }

  // parametres
  // {
  //   path: '/settings',
  //   title: 'Paramètres',
  //   component: Parametres,
  // },
];

const routes = [...coreRoutes];
export default routes;
