import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { GiTeacher } from 'react-icons/gi';

// Définir les types des props
interface EvaluationSidebarLinkProps {
    userPermissions: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const EvaluationSidebarLink: React.FC<EvaluationSidebarLinkProps> = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}) => {
    const { pathname } = useLocation();

    // Vérification des permissions utilisateur
    const hasEvaluationListPermission = true;
    const hasSaisieNotePermission =true;
    const hasCoefficientPermission = true;
    const hasResultatPermission = true;

    // Liste des éléments de menu avec conditions de permission
    const menuItems = [
        { permission: hasEvaluationListPermission, path: '/evaluations/liste', label: t('sub_menu.liste_evaluation') },
        { permission: hasSaisieNotePermission, path: '/evaluations/saisie-notes', label: t('sub_menu.gestion_notes') },
        { permission: hasCoefficientPermission, path: '/evaluations/coefficients', label: t('sub_menu.coefficients') },
        { permission: hasResultatPermission, path: '/evaluations/resultats', label: t('sub_menu.resultats_evaluations') }
    ];

    // Filtrer les éléments du menu en fonction des permissions
    const accessibleItems = menuItems.filter(item => item.permission);

    // Cas où l'utilisateur a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/evaluations' || pathname.includes('evaluations')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('Evaluations') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                        >
                            <div className="w-6">
                                <GiTeacher className="text-[22px]" />
                            </div>
                            {t('menu.evaluations')}
                            <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                        </NavLink>
                        <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                            <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                {accessibleItems.map((item, index) => (
                                    <li key={index}>
                                        <NavLink to={item.path} className={({ isActive }) => 
                                            `group relative flex items-center pb-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ${isActive ? 'text-secondary' : ''}`}
                                        >
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

    // Cas où l'utilisateur a une seule permission
    if (accessibleItems.length === 1) {
        const singleItem = accessibleItems[0];
        return (
            <li>
                <NavLink
                    to={singleItem.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === singleItem.path ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                >
                    <div className="w-6">
                        <GiTeacher className="text-[18px]" />
                    </div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    // Cas où l'utilisateur a plusieurs permissions, mais pas toutes
    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/evaluations' || pathname.includes('evaluations')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('Evaluations') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                        >
                            <div className="w-6">
                                <GiTeacher className="text-[22px]" />
                            </div>
                            {t('menu.evaluations')}
                            <IoIosArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open ? 'rotate-180' : ''}`} />
                        </NavLink>
                        <div className={`transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                            <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                {accessibleItems.map((item, index) => (
                                    <li key={index}>
                                        <NavLink to={item.path} className={({ isActive }) => 
                                            `group relative flex items-center pb-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ${isActive ? 'text-secondary' : ''}`}
                                        >
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

export default EvaluationSidebarLink;
