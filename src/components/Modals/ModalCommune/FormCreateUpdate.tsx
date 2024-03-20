import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Commune } from '../../../pages/Admin/Communes';
import { useTranslation } from 'react-i18next';
import { CommonSettingProps, DepartementProps } from '../../../_types/data_setting_interface';


function ModalCreateUpdate({ commune }: { commune: Commune | null }) {
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departement) ?? [];

    const regions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.region) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<DepartementProps>();

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorRegion, setErrorRegion] = useState("");
    const [errorDepartement, setErrorDepartement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (commune) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.commune'));
            setCode(commune.code);
            setLibelle(commune.libelle);
            setRegion(commune.departement.region);
            setDepartement(commune.departement);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.commune'));
            setCode("");
            setLibelle("");
            setRegion(undefined);
            setDepartement(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setErrorRegion("");
            setErrorDepartement("");
            setIsFirstRender(false);
        }
    }, [commune, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelle("");
        setErrorRegion("");
        setErrorDepartement("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionLibelle = e.target.value;
        const selectedRegion = regions.find(region => region.libelle === selectedRegionLibelle);
        if (selectedRegion) {
            setRegion(selectedRegion);
            setErrorRegion("");
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        const selectedDepartement = departements.find(departement => departement.libelle === selectedDepartementLibelle);
        if (selectedDepartement) {
            setDepartement(selectedDepartement);
            setErrorDepartement("");
        }
    };




    const handleCreateUpdate = () => {
        if (!code || !libelle || !region || !departement) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelle) {
                setErrorLibelle(t('error.libelle'));
            }
            if (!region) {
                setErrorRegion(t('error.region'));
            }
            if (!departement) {
                setErrorDepartement(t('error.departement'));
            }


            return;
        }

        closeModal();
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

                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
                <label>{t('label.libelle')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) => { setLibelle(e.target.value); setErrorLibelle("") }}
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <label>{t('label.region')}</label><label className="text-red-500"> *</label>
                <select
                    value={region ? region.libelle : 'Sélectionnez une region'}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={region.libelle}>{region.libelle}</option>
                    ))}
                </select>
                {errorRegion && <p className="text-red-500">{errorRegion}</p>}
                <label>{t('label.departement')}</label><label className="text-red-500"> *</label>
                <select
                    value={departement ? departement.libelle : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                    {departements.map(departement => (
                        <option key={departement._id} value={departement.libelle}>{departement.libelle}</option>
                    ))}
                </select>
                {errorDepartement && <p className="text-red-500">{errorDepartement}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
