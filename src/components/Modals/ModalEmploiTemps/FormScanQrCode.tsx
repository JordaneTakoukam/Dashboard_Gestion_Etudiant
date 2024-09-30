import { useDispatch, useSelector } from 'react-redux';
import { setShowModalOpenScan } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Transition, Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { apiPresence } from '../../../api/api_presence_paie';
import createToast from '../../../hooks/toastify';
import CryptoJS from 'crypto-js'; // Import crypto-js pour la vérification de la signature

function ModalScanQrCode({ periodeCours }: { periodeCours: PeriodeType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang: string = useSelector((state: RootState) => state.setting.language);
    const isModalOpen: boolean = useSelector((state: RootState) => state.setting.showModal.openScan);
    const utilisateur = useSelector((state: RootState) => state.user); // Supposant que tu as l'utilisateur dans ton state
    const closeModal = () => {
        dispatch(setShowModalOpenScan());
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
            handleSubmitQrData(data); // Appeler la fonction de soumission après le scan
        }
    };

    const handleError = (err: any) => {
        setError(t('message.erreur'));
        console.log(err);
    };
    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {

        if (isFirstRender) {
            setIsFirstRender(false);
        }
    }, [isFirstRender, t]);

    // Vérification de la signature QR et envoi des données à l'API
    const handleSubmitQrData = async (scannedData: string) => {
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
            console.log(secret)
            // Calcul de la signature côté client
            const calculatedSignature = CryptoJS.HmacSHA256(rawData, secret).toString(CryptoJS.enc.Hex);
            
            // Vérification de la signature
            if (calculatedSignature !== qrInfo.signature) {
                setError(t('message.qr_code_invalid'));
                return;
            }

            // Préparation des données à envoyer
            const jour = periodeCours?.jour || 0; // Jour actuel
            const heureDebut = periodeCours ? periodeCours.heureDebut : '00:00'; // Exemple de l'heure de début
            const heureFin = periodeCours ? periodeCours.heureFin : '00:00'; // Exemple de l'heure de fin
            const matiere = periodeCours ? periodeCours.matiere : undefined; // Exemple de matière

            setLoading(true);

            // Appel à l'API pour enregistrer la présence
            await apiPresence({
                jour,
                semestre: qrInfo.semestre,
                annee: qrInfo.annee,
                niveau: qrInfo.niveau._id,
                matiere,
                utilisateur,
                heureDebut,
                heureFin,
            })
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
                                    <Dialog.Panel className="my-20 w-full md:w-[500px] lg:w-[600px] transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
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
                                                <div className="mt-4">
                                                    <h4 className="font-bold">{t('label.scan_qr_code')}</h4>

                                                    {/* Scanner QR Code ici */}
                                                    <div style={{ height: 240, width: 240 }}> {/* Hauteur fixe */}
                                                        <Scanner
                                                            onScan={(result) => handleScan(result)}
                                                            onError={(err) => handleError(err)}
                                                        />
                                                    </div>

                                                    {loading && <p className="text-blue-500">{t('message.loading')}</p>}
                                                    {error && <p className="text-red-500">{error}</p>}
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
