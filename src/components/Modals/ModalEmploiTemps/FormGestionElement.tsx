import { useDispatch, useSelector } from 'react-redux';
import { setPeriodeIndex, setShowModal, setShowModalDelete, setShowModalElement, setShowModalPause } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import { Transition, Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';


function ModalGestionElement({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();



    const lang = useSelector((state: RootState) => state.setting.language);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openElement);
    const closeModal = () => {
        dispatch(setShowModalElement());
    };
    
    return (
        <>
            <div>
                <Transition show={isModalOpen} as={Fragment}>
                    <Dialog open={isModalOpen} as="div" className="relative z-999999 " onClose={() => { }}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/25  dark:bg-white/10" />
                        </Transition.Child>

                        <div className="fixed inset-0  w-screen overflow-y-auto overflow-x-hidden ">
                            <div className="flex min-h-full w-screen   items-center justify-center p-4 text-center  text-[14px] lg:text-[15px]">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className=" my-20 w-full md:w-[500px] lg:w-[600px] transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className=" font-medium leading-6 text-gray-900 "
                                        >
                                            <div className='flex justify-between items-center  text-black-2 dark:text-gray font-bold '>
                                                <div
                                                    onClick={closeModal}
                                                    className='h-6 w-6 cursor-pointer flex items-center justify-center hover:bg-body rounded-full hover:text-white'>
                                                    <IoMdClose />
                                                </div>
                                            </div>
                                        </Dialog.Title>

                                        {/* BODY DE LA BOITE DE DIALOGUE */}
                                        {/* <div className='mt-5 md:mt-10'>{children}</div> */}
                                        <div className="flex flex-col items-start space-y-2 p-4 items-left">
                                            {((periodeCours && !periodeCours.pause) || !periodeCours) && (<button className="text-blue-500 hover:underline" onClick={() => { closeModal(); dispatch(setShowModal())} }>
                                                {periodeCours && periodeCours.enseignements?t('form_save.ajouter')+t('form_save.matiere'): t('form_save.enregistrer')+t('form_save.periode')}
                                            </button>)}
                                            {(periodeCours && periodeCours.enseignements && !periodeCours.pause) && (
                                                periodeCours.enseignements.map((matiere, index) => (
                                                    <button
                                                        key={index}
                                                        className="text-blue-500 hover:underline text-left"
                                                        onClick={async () => {
                                                            dispatch(setPeriodeIndex(index)); // Assure que l'index est bien mis à jour avant d'ouvrir la modal
                                                            closeModal(); // Ferme la modal actuelle
                                                            dispatch(setShowModal()); // Ouvre la nouvelle modal pour la modification
                                                          }}
                                                    >
                                                        {periodeCours && periodeCours.enseignements && periodeCours.enseignements.length>1? t('form_update.emploi_temps_debut') + (lang === 'fr' ? matiere.matiere.libelleFr : matiere.matiere.libelleEn) + t('form_update.emploi_temps_fin'):t('form_update.enregistrer')+t('form_update.periode')}
                                                    </button>
                                                ))
                                            )}
                                            {((!periodeCours) || (periodeCours && periodeCours.pause) || (periodeCours && !periodeCours._id)) && (<button className="text-blue-500 hover:underline" onClick={() => {closeModal(); dispatch(setShowModalPause())}}>
                                            {(!periodeCours || (periodeCours && !periodeCours._id))?t('form_save.enregistrer')+t('form_save.pause'):t('form_update.enregistrer')+t('form_update.pause')}
                                            </button>)}
                                            {(periodeCours && periodeCours._id) && (periodeCours && periodeCours.enseignements && !periodeCours.pause) && (
                                                periodeCours.enseignements.map((matiere, index) => (
                                                    <button
                                                        key={index}
                                                        className="text-blue-500 hover:underline text-left"
                                                        onClick={() => {dispatch(setShowModalDelete()); closeModal(); dispatch((setPeriodeIndex(index))) }}
                                                    >
                                                        {periodeCours && periodeCours.enseignements && periodeCours.enseignements.length>1? t('form_delete.emploi_temps_debut') + (lang === 'fr' ? matiere.matiere.libelleFr : matiere.matiere.libelleEn) + t('form_delete.emploi_temps_fin'):t('form_delete.suppression')+t('form_delete.periode')}
                                                    </button>
                                                ))
                                            )}
                                                {(periodeCours && periodeCours.pause) && (
                                                    
                                                        <button
                                                            className="text-blue-500 hover:underline text-left"
                                                            onClick={() => { closeModal(); dispatch(setShowModalDelete()) }}
                                                        >
                                                            {t('form_delete.suppression')+t('form_delete.periode')}
                                                        </button>
                                                    )
                                                }
                                            
                                            
                                        </div>

                                        
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
}

export default ModalGestionElement;
