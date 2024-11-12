import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { AiOutlineSchedule } from 'react-icons/ai';
import { TbSchool } from 'react-icons/tb';
import { FaCalendarAlt, FaFile } from 'react-icons/fa';

interface SidebarLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    permissionsRequired?: string[];  // Optionnel, si une permission est nécessaire
    userPermissions: string[];
    t: (key: string) => string;
}

const SidebarLink = ({
    to,
    icon,
    label,
    permissionsRequired = [],
    userPermissions,
    t
}: SidebarLinkProps) => {
    const { pathname } = useLocation();

    // Vérifie si l'utilisateur a au moins une des permissions nécessaires
    const hasPermission = permissionsRequired.some(permission => userPermissions.includes(permission));

    // Si aucune permission n'est requise ou si l'utilisateur a la permission
    if (permissionsRequired.length === 0 || hasPermission) {
        
        return (
            <li>
                <NavLink
                    to={to}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === to || pathname.includes(to) ) ? 'bg-graydark dark:bg-meta-4 text-secondary' : ''
                    }`}
                >
                    <div className="w-6">
                        <div className="text-[22px]">{icon}</div>
                    </div>
                    {t(label)}
                </NavLink>
            </li>
        );
    }

    // Si l'utilisateur n'a pas les permissions, on ne rend rien
    return null;
};

// Composant pour le Tableau de Bord
export const DashboardLink = ({ userPermissions, t }: { userPermissions: string[], t: (key: string) => string }) => (
    <SidebarLink
        to="/"
        icon={<RxDashboard />}
        label="menu.tableau_de_bord"
        userPermissions={userPermissions}
        t={t}
    />
);

// Composant pour les salles de cours
export const SalleCourLink = ({ userPermissions, t }: { userPermissions: string[], t: (key: string) => string }) => (
    <SidebarLink
        to="/classrooms"
        icon={<TbSchool />}
        label="menu.salles"
        permissionsRequired={["gerer_salles"]}
        userPermissions={userPermissions}
        t={t}
    />
);

// Composant pour l'Emploi de Temps
export const EmploiTempsLink = ({ userPermissions, t }: { userPermissions: string[], t: (key: string) => string }) => (
    <SidebarLink
        to="/schedules"
        icon={<AiOutlineSchedule />}
        label="menu.emploi"
        permissionsRequired={["gerer_emplois_du_temps", "consulter_emplois_du_temps"]}
        userPermissions={userPermissions}
        t={t}
    />
);

// Composant pour le calendrier académique
export const CalendrierAcaLink = ({ userPermissions, t }: { userPermissions: string[], t: (key: string) => string }) => (
    <SidebarLink
        to="/academic-calendar"
        icon={<FaCalendarAlt />}
        label="menu.calendrier"
        permissionsRequired={["gerer_calendrier_academique", "consulter_calendrier_academique"]}
        userPermissions={userPermissions}
        t={t}
    />
);

// Composant pour les documents
export const DocumentLink = ({ userPermissions, t }: { userPermissions: string[], t: (key: string) => string }) => (
    <SidebarLink
        to="/documents"
        icon={<FaFile />}
        label="menu.document"
        permissionsRequired={["gerer_documents", "consulter_liste_documents"]}
        userPermissions={userPermissions}
        t={t}
    />
);