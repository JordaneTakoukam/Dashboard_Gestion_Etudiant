import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import { apiCreateCycle, apiUpdateCycle } from '../../../api/settings/api_cycle';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';


function ModalCreateUpdate({ cycle }: { cycle: CycleProps | null }) {
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [section, setSection] = useState<SectionProps>();

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorSection, setErrorSection] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (cycle) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.cycle'));
            const sectionId =""+cycle.section;
            const currentSection = sections.find(section => section._id === sectionId);
            
            setCode(cycle.code);
            setLibelleFr(cycle.libelleFr);
            setLibelleEn(cycle.libelleEn);
            setSection(currentSection);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.cycle'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setSection(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleEn("");
            setErrorLibelleFr("");
            setErrorSection("");
            setIsFirstRender(false);
        }
    }, [cycle, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorSection("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        var selectedSection = null;

        if (lang === 'fr') {
            selectedSection = sections.find(section => section.libelleFr === selectedSectionLibelle);

        }
        else {
            selectedSection = sections.find(section => section.libelleEn === selectedSectionLibelle);

        }


        if (selectedSection) {
            setSection(selectedSection);
            setErrorSection("");
        }
    };




    const handleCreateUpdate = async () => {
        // create
        if (!cycle) {
            if (!libelleFr || !libelleEn || !section) {
                
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }
                if (!section) {
                    setErrorSection(t('error.section'));
                }

            } else {
                // creation

                if (section._id) {
                    await apiCreateCycle(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            section: section._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(createSettingItem({
                                tableName: 'cycles', newItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    section: e.data.section,
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

            if (!libelleFr || !libelleEn || !section) {
                
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }
                if (!section) {
                    setErrorSection(t('error.section'));
                }
            } else {


                //
                //  mise a jour
                if (section._id) {
                    await apiUpdateCycle(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            section: section._id,
                            _id: cycle._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(updateSettingItem({
                                tableName: 'cycles',
                                updatedItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    section: e.data.section,
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

                <Label text={t('label.section')} required />


                <select
                    value={section ? (lang === 'fr' ? section.libelleFr : section.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section._id} value={lang === 'fr' ? section.libelleFr : section.libelleEn}>{lang === 'fr' ? section.libelleFr : section.libelleEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorSection} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
