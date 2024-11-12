import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoSchoolOutline } from 'react-icons/io5';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { getNavLinkClass } from '../../../fonctions/fonction';
import { IoIosArrowDown } from 'react-icons/io';

interface PedagogieSidebarLinkProps {
    userPermissions: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const PedagogieSidebarLink = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}: PedagogieSidebarLinkProps) => {
    const { pathname } = useLocation();

    const hasFormateurSupportPermission = userPermissions.includes('gerer_supports_cours_formateurs') || userPermissions.includes('consulter_supports_cours_formateurs');
    const hasApprenantSupportPermission = userPermissions.includes('gerer_supports_cours_etudiants') || userPermissions.includes('consulter_supports_cours_etudiants');
    const hasExerciseBookPermission = userPermissions.includes('gerer_cahiers_exercices') || userPermissions.includes('consulter_cahiers_exercices');
    const hasPedagogicalGuidePermission = userPermissions.includes('gerer_guide_pedagogiqe') || userPermissions.includes('consulter_guide_pedagogiqe');

    const menuItems = [
        { permission: hasFormateurSupportPermission, path: '/pedagogie/support-formateur', label: t('sub_menu.support_formateur') },
        { permission: hasApprenantSupportPermission, path: '/pedagogie/support-apprenant', label: t('sub_menu.support_apprenant') },
        { permission: hasExerciseBookPermission, path: '/pedagogie/cahiers-exercices', label: t('sub_menu.cahiers_exercices') },
        { permission: hasPedagogicalGuidePermission, path: '/pedagogie/guide-pedagogique', label: t('sub_menu.guide_pedagogique') }
    ];

    const accessibleItems = menuItems.filter(item => item.permission);

    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/pedagogie' || pathname.includes('pedagogie')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                        >
                            <div className="w-6 text-[22px]"><IoSchoolOutline /></div>
                            {t('menu.pedagogie')}
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
                    <div className="w-6 text-[22px]"><IoSchoolOutline /></div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/pedagogie' || pathname.includes('pedagogie')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                        >
                            <div className="w-6 text-[22px]"><IoSchoolOutline /></div>
                            {t('menu.pedagogie')}
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

    return null;
};

export default PedagogieSidebarLink;
