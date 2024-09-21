import { useDispatch, useSelector } from 'react-redux';
import { setShowModalOpenScan } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Transition, Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'; // Import du scanner QR

function ModalScanQrCode({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const lang :string = useSelector((state: RootState) => state.setting.language);

    const isModalOpen:boolean = useSelector((state: RootState) => state.setting.showModal.openScan);
    const closeModal = () => {
        dispatch(setShowModalOpenScan());
    };

    const [qrData, setQrData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasFrontCamera, setHasFrontCamera] = useState<boolean>(true);

    // useEffect(() => {
    //     const checkCamera = async () => {
    //         try {
    //             const devices = await navigator.mediaDevices.enumerateDevices();
    //             const videoDevices = devices.filter(device => device.kind === 'videoinput');
                
    //             // Chercher la caméra avant par son label ou deviceId
    //             const frontCamera = videoDevices.find(device => device.label.toLowerCase().includes('front') || device.label.toLowerCase().includes('user'));
                
    //             if (frontCamera) {
    //                 // Utiliser l'ID de la caméra frontale
    //                 const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: frontCamera.deviceId } });
    //                 stream.getTracks().forEach(track => track.stop());
    //                 setHasFrontCamera(true);
    //             } else {
    //                 throw new Error('No front camera found');
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             try {
    //                 // Si la caméra avant n'est pas disponible, essayer la caméra arrière
    //                 const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    //                 stream.getTracks().forEach(track => track.stop());
    //                 setHasFrontCamera(false); // Utilise la caméra arrière
    //             } catch (error) {
    //                 console.error('Aucune caméra disponible:', error);
    //                 setError(t('message.no_camera'));
    //                 setHasFrontCamera(false);
    //                 closeModal(); // Fermer le modal si aucune caméra n'est disponible
    //             }
    //         }
    //     };
        
    //     if (isModalOpen) {
    //         checkCamera();
    //     }
    // }, [isModalOpen, t]);
    
      

    // Gestion du scan
    const handleScan = (detectedBarcodes: IDetectedBarcode[]) => {
        if (detectedBarcodes && detectedBarcodes.length > 0) {
            const data = detectedBarcodes[0].rawValue;
            setQrData(data); // Met à jour l'état avec les données scannées
        }
    };

    const handleError = (err: any) => {
        setError(t('message.erreur')); // Gère les erreurs
        console.log(err);
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
                            <div className="fixed inset-0 bg-black/25 dark:bg-white/10" />
                        </Transition.Child>

                        <div className="fixed inset-0 w-screen overflow-y-auto overflow-x-hidden ">
                            <div className="flex min-h-full w-screen items-center justify-center p-4 text-center text-[14px] lg:text-[15px]">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="my-20 w-full md:w-[500px] lg:w-[600px] transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="font-medium leading-6 text-gray-900 "
                                        >
                                            <div className='flex justify-between items-center text-black-2 dark:text-gray font-bold '>
                                                <div
                                                    onClick={closeModal}
                                                    className='h-6 w-6 cursor-pointer flex items-center justify-center hover:bg-body rounded-full hover:text-white'>
                                                    <IoMdClose />
                                                </div>
                                            </div>
                                        </Dialog.Title>

                                        {/* BODY DE LA BOITE DE DIALOGUE */}
                                        <div className="flex flex-col text-left items-start space-y-2 p-4">

                                            {/* Scanner QR Code */}
                                            {periodeCours && (
                                                <div className="mt-4">
                                                    <h4 className="font-bold">{t('label.scan_qr_code')}</h4>

                                                    {/* Scanner QR Code ici */}
                                                    <div style={{ height: 240, width:240  }}> {/* Hauteur fixe */}
                                                    <Scanner
                                                        onScan={(result) => handleScan(result)}
                                                        onError={(err) => handleError(err)}
                                                        constraints={{
                                                            
                                                                facingMode: true ? 'user' : 'environment',
                                                            
                                                        }}
                                                    />
                                                    </div>
                                                    
                                                    {error && <p className="text-red-500">{error}</p>}
                                                    {qrData ? (
                                                        <p className="mt-4 text-lg">{t('label.qrContent')} : {qrData}</p>
                                                    ) : (
                                                        <p className="mt-4 text-gray-500">{t('label.noQrScanned')}</p>
                                                    )}
                                                </div>
                                            )}
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

export default ModalScanQrCode;
