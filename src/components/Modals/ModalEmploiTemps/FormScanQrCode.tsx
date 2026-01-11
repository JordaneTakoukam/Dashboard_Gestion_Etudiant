import { useDispatch, useSelector } from 'react-redux';
import { setPeriodeIndex, setShowModalOpenScan } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Transition, Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { apiPresence } from '../../../api/api_presence_paie';
import createToast from '../../../hooks/toastify';
import CryptoJS from 'crypto-js';
import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";

function ModalScanQrCode({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang: string = useSelector((state: RootState) => state.setting.language);
    const index = useSelector((state: RootState) => state.setting.periodeIndex);
    const isModalOpen: boolean = useSelector((state: RootState) => state.setting.showModal.openScan);
    const utilisateur: UserState = useSelector((state: RootState) => state.user);
    const [faceCaptured, setFaceCaptured] = useState<Blob | null>(null);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const closeModal = () => {
        dispatch(setShowModalOpenScan());
        dispatch(setPeriodeIndex(-1));
        setShowCamera(false);
        setError('');
    };

    const [qrData, setQrData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const secret = 'gestion_etudiant_session_2024';

    const handleScan = (detectedBarcodes: IDetectedBarcode[]) => {
        if (detectedBarcodes && detectedBarcodes.length > 0) {
            const data = detectedBarcodes[0].rawValue;
            setQrData(data);
            setShowCamera(true);
        }
    };

    const handleError = (err: any) => {
        setError(t('message.erreur'));
        console.log(err);
    };

    const captureFace = (camera: any) => {
        const imageSrc = camera.current.takePhoto();
        setImage(imageSrc);
        if (imageSrc) {
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => setFaceCaptured(blob));
        }
    };

    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            setShowCamera(false);
        }
    }, [isFirstRender, t]);

    const handleSubmitQrData = async (scannedData: string, faceBlob: Blob | null) => {
        try {
            const qrInfo = JSON.parse(scannedData);

            const rawData = JSON.stringify({
                annee: qrInfo.annee,
                semestre: qrInfo.semestre,
                section: qrInfo.section,
                cycle: qrInfo.cycle,
                niveau: qrInfo.niveau,
            });

            const calculatedSignature = CryptoJS.HmacSHA256(rawData, secret).toString(CryptoJS.enc.Hex);

            if (calculatedSignature !== qrInfo.signature) {
                setError(t('message.qr_code_invalid'));
                return;
            }

            if (!faceBlob) {
                setError("Aucune image faciale capturée.");
                return;
            }

            const jour = periodeCours?.jour || 0;
            const heureDebut = periodeCours ? periodeCours.heureDebut : '00:00';
            const heureFin = periodeCours ? periodeCours.heureFin : '00:00';
            const matiere = periodeCours && periodeCours.enseignements && index != -1 ? periodeCours.enseignements[index].matiere : undefined;

            setLoading(true);
            const formData = new FormData();
            formData.append('file', faceBlob);
            formData.append('jour', jour.toString());
            formData.append('annee', qrInfo.annee.toString());
            formData.append('semestre', qrInfo.semestre.toString());
            formData.append('niveau', qrInfo.niveau._id);
            formData.append('matiere', matiere?._id || "");
            formData.append('utilisateur', utilisateur?._id || "");
            formData.append('heureDebut', heureDebut);
            formData.append('heureFin', heureFin);
            formData.append('qrCode', "1");

            setIsLoading(true);
            await apiPresence({ formData })
                .then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                })
                .catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                });
        } catch (e) {
            console.error('Error processing QR code:', e);
            createToast(t('message.erreur'), '', 2);
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <Transition show={isModalOpen} as={Fragment}>
                    <Dialog open={isModalOpen} as="div" className="relative z-999999" onClose={() => { }}>
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

                        <div className="fixed inset-0 w-screen overflow-y-auto overflow-x-hidden">
                            <div className="flex min-h-full w-screen items-center justify-center p-2 sm:p-4 text-center text-[14px] lg:text-[15px]">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="my-4 sm:my-8 md:my-20 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[400px] lg:max-w-[500px] transform overflow-hidden rounded-2xl bg-white dark:bg-black p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title as="h3" className="font-medium leading-6 text-gray-900">
                                            <div className="flex justify-between items-center text-black-2 dark:text-gray font-bold">
                                                <div
                                                    onClick={closeModal}
                                                    className="h-6 w-6 cursor-pointer flex items-center justify-center hover:bg-body rounded-full hover:text-white"
                                                >
                                                    <IoMdClose />
                                                </div>
                                            </div>
                                        </Dialog.Title>

                                        {/* BODY DE LA BOITE DE DIALOGUE */}
                                        <div className="flex flex-col text-left items-start space-y-2 p-2 sm:p-4">
                                            {periodeCours && (
                                                <>
                                                    {!showCamera ? (
                                                        <>
                                                            <h2 className="text-base sm:text-lg font-bold">{t('label.scan_qr')}</h2>
                                                            <div className="w-full">
                                                                <Scanner onScan={handleScan} onError={handleError} />
                                                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h2 className="text-base sm:text-lg font-bold">{t('label.cap_faciale')}</h2>
                                                                <button 
                                                                    onClick={() => setShowCamera(false)}
                                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                                                >
                                                                    <IoMdClose className="text-xl" />
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="flex flex-col items-center space-y-4 w-full">
                                                                {/* Container responsive pour la caméra */}
                                                                <div className="w-full rounded-lg shadow-md overflow-hidden bg-black" style={{ maxHeight: '60vh' }}>
                                                                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                                                                        <div className="absolute inset-0">
                                                                            <Camera
                                                                                ref={camera}
                                                                                aspectRatio={4/3}
                                                                                errorMessages={{
                                                                                    noCameraAccessible: undefined,
                                                                                    permissionDenied: undefined,
                                                                                    switchCamera: undefined,
                                                                                    canvas: undefined
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {!faceCaptured ? (
                                                                    <button
                                                                        onClick={() => captureFace(camera)}
                                                                        className="w-full sm:w-auto bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold py-2 px-6 rounded transition duration-300"
                                                                    >
                                                                        {t('boutton.cap_visage')}
                                                                    </button>
                                                                ) : (
                                                                    <div className="flex flex-col space-y-3 w-full">
                                                                        <button
                                                                            onClick={() => handleSubmitQrData(qrData!, faceCaptured)}
                                                                            disabled={loading}
                                                                            className={`
                                                                                w-full py-2.5 px-4 rounded font-medium transition duration-300
                                                                                ${loading
                                                                                    ? 'bg-[#9E9E9E] cursor-not-allowed'
                                                                                    : 'bg-[#4CAF50] hover:bg-[#388E3C] text-white'
                                                                                }
                                                                            `}
                                                                        >
                                                                            {loading ? t('boutton.val_en_cours') : t('boutton.val_presence')}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setFaceCaptured(null)}
                                                                            className="w-full py-2.5 px-4 bg-[#F44336] hover:bg-[#E53935] text-white font-medium rounded transition duration-300"
                                                                        >
                                                                            {t('boutton.ree_capture')}
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {error && <p className="text-[#F44336] text-sm mt-2 text-center">{error}</p>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
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