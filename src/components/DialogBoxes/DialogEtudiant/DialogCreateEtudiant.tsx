
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setShowModalCreate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';



function ModalCreateEtudiant() {
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.create);
    const closeModal = () => { dispatch(setShowModalCreate()); };


    const handleCreateEtudiant = () => {

    }

    return (
        <div>
            <Transition show={isModalOpen} as={Fragment}>
                <Dialog open={isModalOpen} as="div" className="relative z-999999" onClose={() => { }}   >
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
                        <div className="flex min-h-full w-screen   items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="mt-[90px] w-[600px] transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 "
                                    >
                                        <div className='flex justify-between items-center text-md md:text-lg text-black-2 dark:text-gray font-bold'>
                                            Enregistrer un nouvelle étuidant
                                            <div
                                                onClick={() => closeModal()}
                                                className='h-6 w-6 cursor-pointer flex items-center justify-center hover:bg-body rounded-full hover:text-white'>
                                                <IoMdClose />
                                            </div>

                                        </div>
                                    </Dialog.Title>

                                    {/* CORD DE LA BOITE DE DIALOGUE */}
                                    <div className='mt-5 md:mt-10'>
                                        <h1>Contenu</h1>

                                    </div>

                                    <div className="flex justify-end gap-4.5 mt-8">
                                        <button
                                            className="flex justify-center rounded border border-stroke py-2 px-8 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                            type="submit"
                                            onClick={() => closeModal()}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            className="flex justify-center rounded bg-primary py-2 px-8 font-medium text-gray hover:bg-opacity-70"
                                            onClick={handleCreateEtudiant}
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ModalCreateEtudiant



