import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import { apiCreateSection, apiUpdateSection } from '../../../api/settings/api_section';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';


function ModalCreateUpdate({ section }: { section: SectionProps | null }) {
    const departements = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [departement, setDepartement] = useState<CommonSettingProps>();

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorDepartement, setErrorDepartement] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (section) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.section'));
            const departementId =""+section.departement;
            const currentDepartement = departements.find(departement => departement._id === departementId);
            
            setCode(section.code);
            setLibelleFr(section.libelleFr);
            setLibelleEn(section.libelleEn);
            setDepartement(currentDepartement);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.section'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setDepartement(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleEn("");
            setErrorLibelleFr("");
            setErrorDepartement("");
            setIsFirstRender(false);
        }
    }, [section, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorDepartement("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        var selectedDepartement = null;

        if (lang === 'fr') {
            selectedDepartement = departements.find(departement => departement.libelleFr === selectedDepartementLibelle);

        }
        else {
            selectedDepartement = departements.find(departement => departement.libelleEn === selectedDepartementLibelle);

        }


        if (selectedDepartement) {
            setDepartement(selectedDepartement);
            setErrorDepartement("");
        }
    };




    const handleCreateUpdate = async () => {
        // create
        if (!section) {
            if (!libelleFr || !libelleEn || !departement) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }
                if (!departement) {
                    setErrorDepartement(t('error.departement'));
                }

            } else {
                // creation

                if (departement._id) {
                    await apiCreateSection(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            departement: departement._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(createSettingItem({
                                tableName: 'sections', newItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    departement: e.data.departement,
                                    _id: e.data._id,
                                }
                            }));

                            closeModal();

                        } else {
                            createToast(e.message[lang as keyof typeof e.message], '', 2);

                        }
                    }).catch((e) => {
                        console.log(e);
                        createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                    })
                }

            }
        }

        //update
        else {

            if (!libelleFr || !libelleEn || !departement) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }
                if (!departement) {
                    setErrorDepartement(t('error.departement'));
                }
            } else {


                //
                //  mise a jour
                if (departement._id) {
                    await apiUpdateSection(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            departement: departement._id,
                            _id: section._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(updateSettingItem({
                                tableName: 'sections',
                                updatedItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    departement: e.data.departement,
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

                {/* input 1 */}
                <Label text={t('label.code')} />
                <Input
                    value={code}
                    type='text'
                    setValue={(value) => { setCode(value); setErrorCode("") }}
                    hasBackground={true}
                />
                {/* <ErrorMessage message={errorCode} /> */}


                {/* input 2 */}
                <Label text={t('label.libelle_fr')} required />
                <Input
                    value={libelleFr}
                    type='text'
                    setValue={(value) => { setLibelleFr(value); setErrorLibelleFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorLibelleFr} />

                {/* input 3 */}
                <Label text={t('label.libelle_en')} required />
                <Input
                    value={libelleEn}
                    type='text'
                    setValue={(value) => { setLibelleEn(value); setErrorLibelleEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorLibelleEn} />

                {/* input 4 */}

                <Label text={t('label.departement')} required />


                <select
                    value={departement ? (lang === 'fr' ? departement.libelleFr : departement.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                    {departements.map(departement => (
                        <option key={departement._id} value={lang === 'fr' ? departement.libelleFr : departement.libelleEn}>{lang === 'fr' ? departement.libelleFr : departement.libelleEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorDepartement} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
