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
import CryptoJS from 'crypto-js'; // Import crypto-js pour la vérification de la signature
import Webcam from "react-webcam"; // Utilisé pour capturer une image avec la caméra
import {Camera} from "react-camera-pro";

function ModalScanQrCode({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang: string = useSelector((state: RootState) => state.setting.language);
    const index = useSelector((state: RootState) => state.setting.periodeIndex); // index courant à modifier
    const isModalOpen: boolean = useSelector((state: RootState) => state.setting.showModal.openScan);
    const utilisateur : UserState = useSelector((state: RootState) => state.user); // Supposant que tu as l'utilisateur dans ton state
    const [faceCaptured, setFaceCaptured] = useState<Blob | null>(null); // Stocker la photo capturée
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const camera = useRef(null);
    const [image, setImage] = useState(null);

    const closeModal = () => {
        dispatch(setShowModalOpenScan());
        dispatch(setPeriodeIndex(-1));
        setShowCamera(false)
        setError('')
    };

    const [qrData, setQrData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const secret = 'gestion_etudiant_session_2024'; // Remplacer par ta clé secrète pour la vérification

    const handleScan = (detectedBarcodes: IDetectedBarcode[]) => {
        if (detectedBarcodes && detectedBarcodes.length > 0) {
            const data = detectedBarcodes[0].rawValue;
            setQrData(data);
            // handleSubmitQrData(data); // Appeler la fonction de soumission après le scan
            setShowCamera(true);
        }
    };

    const handleError = (err: any) => {
        setError(t('message.erreur'));
        console.log(err);
    };

    const captureFace = (camera: any) => {
        const imageSrc =camera.current.takePhoto();
        setImage(imageSrc)
        // console.log(imageSrc)
        if (imageSrc) {
            // Convertir l'image en Blob pour l'envoyer au serveur
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => setFaceCaptured(blob));
        }
    };

    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {

        if (isFirstRender) {
            setIsFirstRender(false);
            setShowCamera(false)
        }
    }, [isFirstRender, t]);

    // Vérification de la signature QR et envoi des données à l'API
    const handleSubmitQrData = async (scannedData: string, faceBlob: Blob | null) => {
        try {
            // Parsing des données JSON du QR code
            const qrInfo = JSON.parse(scannedData);

            // Générer la signature basée sur les données pour validation
            const rawData = JSON.stringify({
                annee: qrInfo.annee,
                semestre: qrInfo.semestre,
                section: qrInfo.section,
                cycle: qrInfo.cycle,
                niveau: qrInfo.niveau,
            });
            // console.log(secret)
            // Calcul de la signature côté client
            const calculatedSignature = CryptoJS.HmacSHA256(rawData, secret).toString(CryptoJS.enc.Hex);
            
            // Vérification de la signature
            if (calculatedSignature !== qrInfo.signature) {
                setError(t('message.qr_code_invalid'));
                return;
            }

            if (!faceBlob) {
                setError("Aucune image faciale capturée.");
                return;
            }

            // Préparation des données à envoyer
            const jour = periodeCours?.jour || 0; // Jour actuel
            const heureDebut = periodeCours ? periodeCours.heureDebut : '00:00'; // Exemple de l'heure de début
            const heureFin = periodeCours ? periodeCours.heureFin : '00:00'; // Exemple de l'heure de fin
            const matiere = periodeCours && periodeCours.enseignements && index != -1 ? periodeCours.enseignements[index].matiere : undefined; // Exemple de matière
            
            setLoading(true);
            const formData = new FormData();
            formData.append('file', faceBlob);
            formData.append('jour', jour.toString());
            formData.append('annee', qrInfo.annee.toString());
            formData.append('semestre', qrInfo.semestre.toString());
            formData.append('niveau', qrInfo.niveau._id);
            formData.append('matiere', matiere?._id || "");
            formData.append('utilisateur', utilisateur?._id ||"");
            formData.append('heureDebut', heureDebut);
            formData.append('heureFin', heureFin);
            

           
            await apiPresence(
               { formData}
            ).then((e: ReponseApiPros) => {
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
                                    <Dialog.Panel className="my-20 w-full md:w-[400px] lg:w-[500px] transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
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
                                        <div className="flex flex-col text-left items-start space-y-2 p-4">

                                            {/* Scanner QR Code */}
                                            {periodeCours && (
                                                <>
                                                    
                                                    
                                                    {!showCamera ? (
                                                        <>
                                                            <h2 className="text-lg font-bold">Scanner le QR Code</h2>
                                                            <div>
                                                                <Scanner onScan={handleScan} onError={handleError} />
                                                                {error && <p className="text-red-500">{error}</p>}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        // Dans la partie de capture faciale
                                                        
                                                        <div>
                                                        <div className="flex justify-between mb-4">
                                                            <h2 className="text-lg font-bold">Capture Faciale</h2>
                                                            <button onClick={() => setShowCamera(false)}>
                                                                <IoMdClose />
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="rounded-lg shadow-md h-[280px] w-[420px] overflow-hidden">
                                                                <Camera
                                                                    ref={camera}
                                                                    aspectRatio={1 / 1}
                                                                    
                                                                />
                                                            </div>
                                                    
                                                            {!faceCaptured ? (
                                                                <button
                                                                    onClick={() => {
                                                                        
                                                                        captureFace(camera);
                                                                    }}
                                                                    className="bg-[#2196F3] hover:bg-[#2196F3] text-white font-bold py-2 px-4 rounded transition duration-300"
                                                                >
                                                                    Capturer mon visage
                                                                </button>
                                                            ) : (
                                                                <div className="flex flex-col space-y-4 w-full max-w-xs">
                                                                    <button
                                                                        onClick={() => handleSubmitQrData(qrData!, faceCaptured)}
                                                                        disabled={loading}
                                                                        className={`
                                                                            w-full py-2 px-4 rounded transition duration-300
                                                                            ${loading 
                                                                                ? 'bg-[#9E9E9E] cursor-not-allowed' 
                                                                                : 'bg-[#4CAF50] hover:bg-[#388E3C] text-white'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {loading ? "Validation en cours..." : "Valider la présence"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setFaceCaptured(null)}
                                                                        className="w-full py-2 px-4 bg-[#F44336] hover:bg-[#E53935] text-white rounded transition duration-300"
                                                                    >
                                                                        Réessayer la capture
                                                                    </button>
                                                                </div>
                                                            )}
                                                    
                                                            {error && <p className="text-[#F44336] mt-2">{error}</p>}
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
