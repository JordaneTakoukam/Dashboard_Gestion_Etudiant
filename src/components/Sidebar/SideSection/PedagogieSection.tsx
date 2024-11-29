import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PiStudentFill } from 'react-icons/pi';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';
import { IoSchoolOutline } from 'react-icons/io5';

// Définir les types des props
interface PedagogieSidebarLinkProps {
    userPermissions: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const PedagogieSidebarLink: React.FC<PedagogieSidebarLinkProps> = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}) => {
    const { pathname } = useLocation();

    const hasSupportPermission = userPermissions.includes('gerer_supports_cours_formateurs') || userPermissions.includes('consulter_supports_cours_formateurs')
    || userPermissions.includes('gerer_supports_cours_etudiants') || userPermissions.includes('consulter_supports_cours_etudiants');
    const hasExerciseBookPermission = userPermissions.includes('gerer_cahiers_exercices') || userPermissions.includes('consulter_cahiers_exercices');
    const hasPedagogicalGuidePermission = userPermissions.includes('gerer_guide_pedagogiqe') || userPermissions.includes('consulter_guide_pedagogiqe');

    const menuItems = [
        { permission: hasSupportPermission, path: '/pedagogies/course-materials', label: t('sub_menu.supports_de_cours') },
        { permission: hasExerciseBookPermission, path: '/pedagogies/cahiers-exercices', label: t('sub_menu.cahiers_exercices') },
        { permission: hasPedagogicalGuidePermission, path: '/pedagogies/guide-pedagogique', label: t('sub_menu.guide_pedagogique') }
    ];

    // Filtrer les éléments du menu en fonction des permissions
    const accessibleItems = menuItems.filter(item => item.permission);

    // Cas où l'utilisateur a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/pedagogies' || pathname.includes('pedagogies')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('pedagogies') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                        >
                            <div className="w-6">
                                <IoSchoolOutline className="text-[22px]" />
                            </div>
                            {t('menu.pedagogie')}
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
                        <PiStudentFill className="text-[18px]" />
                    </div>
                    {singleItem.label}
                </NavLink>
            </li>
        );
    }

    // Cas où l'utilisateur a plusieurs permissions, mais pas toutes
    if (accessibleItems.length > 1) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/pedagogies' || pathname.includes('pedagogies')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('pedagogies') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                        >
                            <div className="w-6">
                                <PiStudentFill className="text-[22px]" />
                            </div>
                            {t('menu.pedagogie')}
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

export default PedagogieSidebarLink;
