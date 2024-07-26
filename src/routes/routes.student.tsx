import GererAbsencesEnseignant from '../pages/Admin/Disciplines/Enseignant/GererAbsencesEnseignant';
import DisciplineEtudiants from '../pages/Admin/Disciplines/Etudiant/DisciplineEtudiant';
import GererAbsencesEtudiant from '../pages/Admin/Disciplines/Etudiant/GererAbsencesEtudiant';
import ProgressionMatiere from '../pages/Admin/ProgressionMatiere';
import Abscences from '../pages/CommonPage/Abscences';
import CalendrierAcademique from '../pages/CommonPage/CalendrierAcademique';
import Documents from '../pages/CommonPage/Documents';
import EmploiDeTemp from '../pages/CommonPage/EmploiDeTemp';
// import Matieres from '../pages/CommonPage/Matieres';
// import Parametres from '../pages/Admin/Administration';
import MonProfil from '../pages/CommonPage/Profil';

const coreRoutes = [

  // discipline etudiant
  {
    path: '/student/disciplines',
    title: 'Disciplines des étudiants',
    component: DisciplineEtudiants,
  },

  // abscence 
  {
    path: '/student/absences',
    title: 'Abscences',
    component: Abscences,
  },

  {
    path: '/students/disciplines/manage',
    title: 'Disciplines des étudiants',
    component: GererAbsencesEtudiant,
  },

  {
    path: '/teachers/disciplines/manage',
    title: 'Disciplines des étudiants',
    component: GererAbsencesEnseignant,
  },

  // emploi de temps
  {
    path: '/student/subjects',
    title: 'Matières',
    component: ProgressionMatiere,
  },


  // emploi de temps
  {
    path: '/student/schedule',
    title: 'Emploi de temps',
    component: EmploiDeTemp,
  },

  {
    path: '/student/absences/schedule',
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

  // parametres
  // {
  //   path: '/settings',
  //   title: 'Paramètres',
  //   component: Parametres,
  // },
];

const routes = [...coreRoutes];
export default routes;
