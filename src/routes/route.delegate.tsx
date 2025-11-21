import AbsenceSignalerEnseignant from '../pages/Admin/Disciplines/Enseignant/AbsenceSignalerEnseignant';
import DisciplineDesEnseignants from '../pages/Admin/Disciplines/Enseignant/DisciplineEnseignant';
import AbsenceSignalerEtudiant from '../pages/Admin/Disciplines/Etudiant/AbsenceSignalerEtudiant';

const coreRoutes = [
    // etudiants
    {
        path: '/delegate/teachers',
        title: 'Discipline enseignants',
        component: DisciplineDesEnseignants,
    },
    {
        path: '/teachers/absence_reporting',
        title: '',
        component: AbsenceSignalerEnseignant,
    },

    {
        path: '/students/absence_reporting',
        title: '',
        component: AbsenceSignalerEtudiant,
    },


];

const routes = [...coreRoutes];
export default routes;
