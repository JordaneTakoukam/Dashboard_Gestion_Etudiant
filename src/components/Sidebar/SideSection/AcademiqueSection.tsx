import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GiLevelEndFlag } from 'react-icons/gi';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { getNavLinkClass } from '../../../fonctions/fonction';

interface AcademicLevelSidebarLinkProps {
    userPermissions: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const AcademicLevelSidebarLink: React.FC<AcademicLevelSidebarLinkProps> = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}) => {
    const { pathname } = useLocation();

    // Vérification des permissions utilisateur
    const hasDepartementsPermission = userPermissions.includes('gerer_departements');
    const hasSectionsPermission = userPermissions.includes('gerer_sections');
    const hasCyclesPermission = userPermissions.includes('gerer_cycles');
    const hasNiveauxPermission = userPermissions.includes('gerer_niveaux');
    const hasPromotionsPermission = userPermissions.includes('gerer_promotions');

    const menuItems = [
        { permission: hasDepartementsPermission, path: '/academic-levels/departements', label: t('sub_menu.departementsAcademique') },
        { permission: hasSectionsPermission, path: '/academic-levels/sections', label: t('sub_menu.sections') },
        { permission: hasCyclesPermission, path: '/academic-levels/grades', label: t('sub_menu.cycles') },
        { permission: hasNiveauxPermission, path: '/academic-levels/levels', label: t('sub_menu.niveaux') },
        { permission: hasPromotionsPermission, path: '/academic-levels/promotions', label: t('sub_menu.promotions') }
    ];

    const accessibleItems = menuItems.filter(item => item.permission);

    // Cas où l'utilisateur a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/academic-levels' || pathname.includes('academic-levels')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === '/academic-levels' || pathname.includes('academic-levels')) && 'bg-graydark dark:bg-meta-4 text-secondary'
                            }`}
                        >
                            <div className="w-6 text-[22px]">
                                <GiLevelEndFlag />
                            </div>
                            {t('menu.niveaux')}
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
                    <div className="w-6 text-[22px]">
                        <GiLevelEndFlag />
                    </div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    // Cas où l'utilisateur a plusieurs permissions, mais pas toutes
    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/academic-levels' || pathname.includes('academic-levels')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === '/academic-levels' || pathname.includes('academic-levels')) && 'bg-graydark dark:bg-meta-4 text-secondary'
                            }`}
                        >
                            <div className="w-6 text-[22px]">
                                <GiLevelEndFlag />
                            </div>
                            {t('menu.niveaux')}
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

export default AcademicLevelSidebarLink;
