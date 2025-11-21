import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LuBookMarked } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { getNavLinkClass } from '../../../fonctions/fonction';

// Définir les types des props
interface MatiereSidebarLinkProps {
    userPermissions: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const MatiereSidebarLink = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}: MatiereSidebarLinkProps) => {
    const { pathname } = useLocation();

    // Vérification des permissions utilisateur
    const hasSubjectListPermission = userPermissions.includes('gerer_matieres') || userPermissions.includes('consulter_liste_matieres');
    const hasChapterProgressionPermission = userPermissions.includes('gerer_progression_cours_chapitre') || userPermissions.includes('consulter_progression_cours_chapitre');
    const hasSubjectProgressionPermission = userPermissions.includes('gerer_progression_cours_objectif') || userPermissions.includes('consulter_progression_cours_objectif');
    const hasTeachingPeriodsPermission = userPermissions.includes('gerer_periodes_enseignements');
    const hasPeriodProgressionPermission = userPermissions.includes('consulter_progression_periodes_enseignements');

    const menuItems = [
        { permission: hasSubjectListPermission, path: '/subjects/subject-list', label: t('sub_menu.liste_matiere') },
        { permission: hasChapterProgressionPermission, path: '/subjects/progression-par-chapitre', label: t('sub_menu.progression_chap') },
        { permission: hasSubjectProgressionPermission, path: '/subjects/progressions-par-matiere', label: t('sub_menu.progression') },
        { permission: hasTeachingPeriodsPermission, path: '/subjects/periodes_enseignement', label: t('sub_menu.periodes_enseignement') },
        { permission: hasPeriodProgressionPermission, path: '/subjects/progressions-par-periode', label: t('sub_menu.progression_periode') }
    ];

    // Filtrer les items du menu en fonction des permissions
    const accessibleItems = menuItems.filter(item => item.permission);

    // Cas où l'utilisateur a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/subjects' || pathname.includes('subjects')}>
                {(handleClick, open) => (
                <>
                    <NavLink
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('subjects') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                    >
                        <div className="w-6">
                            <div className="text-[17px]">
                                <LuBookMarked />
                            </div>
                        </div>
                        {t('menu.matieres')}
                        <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                        <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                            {accessibleItems.map((item, index) => (
                                <li key={index}>
                                    <NavLink to={item.path} className={({ isActive }) => getNavLinkClass(isActive)}>
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
                )}
            </SidebarLinkGroup>
        );
    }

    // Cas où l'utilisateur a seulement une permission
    if (accessibleItems.length === 1) {
        const singleItem = accessibleItems[0];
        return (
            <li>
                <NavLink
                    to={singleItem.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname === singleItem.path ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''
                    }`}
                >
                    <div className="w-6">
                        <div className="text-[18px]">
                            <LuBookMarked />
                        </div>
                    </div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    // Cas où l'utilisateur a plusieurs permissions, mais pas toutes
    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/subjects' || pathname.includes('subjects')}>
                {(handleClick, open) => (
                <>
                    <NavLink
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('subjects') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                    >
                        <div className="w-6">
                            <div className="text-[17px]">
                                <LuBookMarked />
                            </div>
                        </div>
                        {t('menu.matieres')}
                        <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                    </NavLink>
                    <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                        <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                            {accessibleItems.map((item, index) => (
                                <li key={index}>
                                    <NavLink to={item.path} className={({ isActive }) => getNavLinkClass(isActive)}>
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
                )}
            </SidebarLinkGroup>
        );
    }

    // Cas où l'utilisateur n'a aucune permission
    return null;
};

export default MatiereSidebarLink;
