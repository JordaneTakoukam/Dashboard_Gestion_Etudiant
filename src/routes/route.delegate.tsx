import DisciplineDesEnseignants from '../pages/Admin/Disciplines/Enseignant/DisciplineEnseignant';

const coreRoutes = [
    // etudiants
    {
        path: '/delegate/teachers',
        title: 'Discipline enseignants',
        component: DisciplineDesEnseignants,
    }

];

const routes = [...coreRoutes];
export default routes;
