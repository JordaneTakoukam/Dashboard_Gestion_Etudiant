import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LogoPng from "./../../images/logo/logo.png";
import { config } from '../../config';
import SidebarLinkGroup from './SideGroup/SidebarLinkGroup';
import React from 'react';
import { RxDashboard } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { GiLevelEndFlag } from "react-icons/gi";
import { TbSchool } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineSchedule } from "react-icons/ai";
import { LuBookMarked } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegCopyright } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';



interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const SidebarAdmin = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const location = useLocation();
    const { pathname } = location;
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );


    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document.querySelector('body')?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    return (
        <nav
            ref={sidebar}
            className={`
            text-[14px]  lg:text-[15px] 

            absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark   ${sidebarOpen ? 'translate-x-0 duration-300 lg:static lg:translate-x-0' : '-translate-x-full '
                }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:pb-5  lg:pt-9 ">
                <NavLink to="/" className={`flex`}>

                    <div className="md:h-[60px] md:w-[60px] h-25 w-25 ml-2">
                        <img src={LogoPng} alt="logo" />
                    </div>
                    <h1 className='font-extrabold pt-2 ml-4 text-white text-[15px] lg:text-[20px] mt-2'>{config.nameApp}</h1>

                </NavLink>

                {/* Bouton pour fermer la sidebar */}
                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>

            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-0 py-4 px-4 lg:mt- lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <h3 className="mb-2 ml-3 text-sm font-semibold text-bodydark2">
                        {t('menu.menu')}
                    </h3>
                    <div>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            {/* TABLEAU DE BORD */}
                            <li>
                                <NavLink
                                    to="/"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/' ||
                                        pathname.includes('dashboard')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='w-6'>
                                        <div className='text-[20px]'>
                                            <RxDashboard />
                                        </div>
                                    </div>
                                    {t('menu.tableau_de_bord')}
                                </NavLink>
                            </li>
                            {/* TABLEAU DE BORD */}

                            {/* Etudiant : list group */}
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/students' || pathname.includes('students')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/students' ||
                                                    pathname.includes('students')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                <div className='w-6 '>
                                                    <div className='text-[22px]'>
                                                        <PiStudentFill />
                                                    </div>
                                                </div>

                                                {t('menu.etudiants')}
                                                <div className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/students/student-list"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.liste_etudiant')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/students/disciplines"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.discipline')}
                                                        </NavLink>
                                                    </li>

                                                    <li>
                                                        <NavLink
                                                            to="/students/absence_reporting"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.absence_reporting')}
                                                        </NavLink>
                                                    </li>
                                                </ul>


                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {/* ! Etudiant */}


                            {/* Enseignant : list group */}
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/teachers' || pathname.includes('teachers')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/teachers' ||
                                                    pathname.includes('teachers')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >

                                                <div className='w-6 '>
                                                    <div className='text-[20px]'>
                                                        <GiTeacher />
                                                    </div>
                                                </div>
                                                {t('menu.enseignants')}
                                                <div
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                        }`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/teachers/teacher-list"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.liste_enseignant')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/teachers/disciplines"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.discipline')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/teachers/absence_reporting"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.absence_reporting')}
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {/* ! Enseignant */}


                            {/* Matieres : list group */}
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/subjects' || pathname.includes('subjects')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/subjects' ||
                                                    pathname.includes('subjects')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                <div className='w-6'>
                                                    <div className='text-[17px]'>
                                                        <LuBookMarked />
                                                    </div>
                                                </div>
                                                {t('menu.matieres')}
                                                <div
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                        }`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/subjects/subject-list"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center  pb-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                            
                                                        >
                                                            {t('sub_menu.liste_matiere')}

                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/subjects/progressions-par-matiere"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5  rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }

                                                        >
                                                            {t('sub_menu.progression')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/subjects/periodes_enseignement"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5  rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                            
                                                        >
                                                            {t('sub_menu.periodes_enseignement')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/subjects/progressions-par-periode"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5  rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.progression_periode')}
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {/* ! Matieres */}


                            {/* SALLES DE COURS */}
                            <li>
                                <NavLink
                                    to="/classrooms"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/classrooms' ||
                                        pathname.includes('classrooms')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[22px]'>
                                            <TbSchool />
                                        </div>
                                    </div>
                                    {t('menu.salles')}
                                </NavLink>
                            </li>
                            {/* SALLES DE COURS */}
                            {/*Sondage*/}
                            {/* <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/sondages' || pathname.includes('sondages')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm  py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/academic-levels' ||
                                                    pathname.includes('sondages')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                <div className='w-6'>
                                                    <div className='text-[22px]'>
                                                        <IoIosStats />
                                                    </div>
                                                </div>
                                                Sondages
                                                <div
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                        }`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/sondages/rubriques"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            Rubriques
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/sondages/groupe_de_question"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            Groupes de questions
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/sondages/questions"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            Questions
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/sondages/liste_sondage"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            Liste des sondages
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            <!-- Dropdown Menu End -->
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup> */}
                            {/*SONDAGE */}

                            {/* Niveaux  academique : list group */}
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/academic-levels' || pathname.includes('academic-levels')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm  py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/academic-levels' ||
                                                    pathname.includes('academic-levels')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                <div className='w-6'>
                                                    <div className='text-[22px]'>
                                                        <GiLevelEndFlag />
                                                    </div>
                                                </div>
                                                {t('menu.niveaux')}
                                                <div
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                        }`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/academic-levels/sections"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.sections')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/academic-levels/grades"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.cycles')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/academic-levels/levels"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.niveaux')}
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {/* ! Structuration Éducative */}



                            {/* EMPLOI DE TEMPS */}
                            <li>
                                <NavLink
                                    to="/schedules"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/schedules' ||
                                        pathname.includes('schedules')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[22px]'>
                                            <AiOutlineSchedule />
                                        </div>
                                    </div>
                                    {t('menu.emploi')}
                                </NavLink>
                            </li>
                            {/* EMPLOI DE TEMPS */}



                            {/* calendrier academique */}
                            <li>
                                <NavLink
                                    to="/academic-calendar"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/academic-calendar' ||
                                        pathname.includes('academic-calendar')) &&
                                        'bg-graydark dark:bg-meta-4 text-secondary'
                                        }`}
                                >
                                    <div className='-ml-.75 w-6'>
                                        <div className='text-[18px]'>
                                            <FaCalendarAlt />
                                        </div>
                                    </div>
                                    {t('menu.calendrier')}
                                </NavLink>
                            </li>
                            {/* calen */}





                            {/* <!-- Autres --> */}

                            <h3 className="mt-8 mb-2 ml-4 text-sm font-semibold text-bodydark2">
                                {t('menu.autres')}
                            </h3>


                            {/* Parametre */}
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/parametres' || pathname.includes('parametres')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm  py-2 pl-3 pr-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/academic-levels' ||
                                                    pathname.includes('parametres')) &&
                                                    'bg-graydark dark:bg-meta-4 text-secondary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                <div className='-ml-.75 w-6'>
                                                    <div className='text-[22px]'>
                                                        <IoSettingsOutline />
                                                    </div>
                                                </div>
                                                {t('menu.parametres')}
                                                <div
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                        }`}>
                                                    <IoIosArrowDown />
                                                </div>

                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-3 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/profile"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.profil')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/admins"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && ' text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.administrateurs')}
                                                        </NavLink>
                                                    </li>
                                                    {/* <li>
                                                        <NavLink
                                                            to="/parametres/current-year-semester"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            Année et semestre courant
                                                        </NavLink>
                                                    </li> */}
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/services"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.services')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/fonctions"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.fonctions')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/grades"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.grades')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/categories"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.categories')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/regions"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.regions')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/departements"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.departements')}
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/parametres/communes"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ' +
                                                                (isActive && 'text-secondary')
                                                            }
                                                        >
                                                            {t('sub_menu.communes')}
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                        </ul>
                    </div>





                    {/* Parametre */}

                    <div className='w-full flex flex-col justify-center items-center -ml-4 mt-10 mb-5 text-body'>
                        <div className='flex items-center'>
                            <div className='text-[10px]  pr-1 '>
                                <FaRegCopyright />
                            </div>
                            <p className='text-[10px]'>{config.copyRight}</p>

                        </div>

                        <p className='text-[13px] ml-2'>Version <span className='font-semibold'>{config.version}</span></p>

                    </div>



                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </nav>
    );
};

export default SidebarAdmin;

