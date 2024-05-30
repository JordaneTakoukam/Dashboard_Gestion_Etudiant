import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setShowModal } from '../../../_redux/features/setting';
import Input from '../../ui/input';
import { ErrorMessage, Label } from '../../ui/Label';
import { apiCreatePromotion, apiUpdatePromotion } from '../../../api/settings/api_promotion';
import createToast from '../../../hooks/toastify';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import { formatYear } from '../../../fonctions/fonction';


function ModalCreateUpdate({ promotion }: { promotion: PromotionProps | null }) {
    const { t } = useTranslation();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [annee, setAnnee] = useState(currentYear);

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (promotion) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.promotion'));
            setAnnee(promotion.annee);
            setCode(promotion.code);
            setLibelleFr(promotion.libelleFr);
            setLibelleEn(promotion.libelleEn);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.promotion'));
            setAnnee(currentYear);
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
        }

        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleEn("");
            setErrorLibelleFr("");
            setIsFirstRender(false);
        }
    }, [promotion, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        // create
        if (!promotion) {
            if (!libelleFr || !libelleEn) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }

            } else {
                // creation
                await apiCreatePromotion(
                    { code, libelleFr, libelleEn, annee }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createSettingItem({
                            tableName: 'promotions', newItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                date_creation: e.data.date_creation,
                                _id: e.data._id,
                            }
                        }));

                        closeModal();


                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }

        //update
        else {

            if (!libelleFr || !libelleEn) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }

            } else {
                //
                //
                // mise a jour
                await apiUpdatePromotion(
                    { _id: promotion._id, code, libelleFr, libelleEn, annee }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(updateSettingItem({
                            tableName: 'promotions',
                            updatedItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                date_creation: e.data.date_creation,
                                _id: e.data._id,
                            }
                        }));

                        closeModal();


                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }


    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >

                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(annee)}
                    onChange={(e) => {setAnnee(parseInt(e.target.value))}}
                />
                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) =>{setLibelleFr(e.target.value); setErrorLibelleFr("");} }
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) =>{setLibelleEn(e.target.value); setErrorLibelleEn("");} }
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

