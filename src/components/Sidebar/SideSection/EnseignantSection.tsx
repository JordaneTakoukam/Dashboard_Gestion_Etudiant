import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GiTeacher } from 'react-icons/gi';
import { IoIosArrowDown } from 'react-icons/io';
import SidebarLinkGroup from '../SideGroup/SidebarLinkGroup';

// Définir les types des props
interface TeacherSidebarLinkProps {
    userPermissions: string[];
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    t: (key: string) => string;
}

const TeacherSidebarLink: React.FC<TeacherSidebarLinkProps> = ({
    userPermissions,
    sidebarExpanded,
    setSidebarExpanded,
    t
}) => {
    const { pathname } = useLocation();

    // Vérification des permissions utilisateur
    const hasTeacherListPermission = userPermissions.includes('gerer_enseignants');
    const hasDisciplinesPermission = userPermissions.includes('consulter_liste_enseignant');
    const hasPresencePaiePermission = userPermissions.includes('consulter_presence_enseignant');

    // Liste des éléments de menu avec conditions de permission
    const menuItems = [
        { permission: hasTeacherListPermission, path: '/teachers/teacher-list', label: t('sub_menu.liste_enseignant') },
        { permission: hasDisciplinesPermission, path: '/teachers/disciplines', label: t('sub_menu.discipline') },
        { permission: hasPresencePaiePermission, path: '/teachers/presence-paie', label: t('sub_menu.presence_paie') }
    ];

    // Filtrer les éléments du menu en fonction des permissions
    const accessibleItems = menuItems.filter(item => item.permission);

    // Cas où l'utilisateur a toutes les permissions
    if (accessibleItems.length === menuItems.length) {
        return (
            <SidebarLinkGroup activeCondition={pathname === '/teachers' || pathname.includes('teachers')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('teachers') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                        >
                            <div className="w-6">
                                <GiTeacher className="text-[22px]" />
                            </div>
                            {t('menu.enseignants')}
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
            <SidebarLinkGroup activeCondition={pathname === '/teachers' || pathname.includes('teachers')}>
                {(handleClick, open) => (
                    <>
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('teachers') ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''}`}
                        >
                            <div className="w-6">
                                <GiTeacher className="text-[22px]" />
                            </div>
                            {t('menu.enseignants')}
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

export default TeacherSidebarLink;
