import DisciplineEtudiants from '../pages/Admin/Disciplines/Etudiant/DisciplineEtudiant';
import GererAbsencesEtudiant from '../pages/Admin/Disciplines/Etudiant/GererAbsencesEtudiant';
import ListeDesMatieres from '../pages/Admin/ListeMatieres';
import ProgressionMatiere from '../pages/Admin/ProgressionMatiere';
import Abscences from '../pages/CommonPage/Abscences';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
//import Matieres from '../pages/CommonPage/Matieres';
// import Parametres from '../pages/Admin/Administration';
import MonProfil from '../pages/CommonPage/Profil';



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
    path: '/subjects/progressions',
    title: 'Progréssion',
    component: ProgressionMatiere,
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

  // profil
  {
    path: '/parametres/profile',
    title: 'Mon profil',
    component: MonProfil,
  },

  // parametres
  // {
  //   path: '/settings',
  //   title: 'Paramètres',
  //   component: Parametres,
  // },
];

const routes = [...coreRoutes];
export default routes;
