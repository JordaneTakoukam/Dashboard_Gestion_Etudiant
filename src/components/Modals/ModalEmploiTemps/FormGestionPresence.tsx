import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalDelete, setShowModalPresence, setShowModalPause, setShowModalSignalerAbsence, setShowModalOpenScan } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import { Transition, Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';


function ModalGestionPresence({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();



    const lang = useSelector((state: RootState) => state.setting.language);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openPresence);
    const closeModal = () => {
        dispatch(setShowModalPresence());
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
                                        <div className="flex flex-col text-left items-start space-y-2 p-4">
                                            {((periodeCours && periodeCours._id) && !periodeCours.pause) && (<button className="text-blue-500 hover:underline" onClick={() => { closeModal(); dispatch(setShowModalSignalerAbsence());   } }>
                                                {t('label.signaler_absence')}
                                            </button>)}
                                            {((periodeCours && periodeCours._id) && !periodeCours.pause) && (<button className="text-blue-500 hover:underline" onClick={() => {closeModal(); dispatch(setShowModalOpenScan())}}>
                                            {t('label.signaler_presence_qr')}
                                            </button>)}
                                            {((periodeCours && periodeCours._id) && !periodeCours.pause) && (<button className="text-blue-500 hover:underline" onClick={() => {closeModal(); dispatch(setShowModalDelete())}}>
                                                {t('label.signaler_presence_manuelle')}
                                            </button>)}
                                            
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

export default ModalGestionPresence;
