import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Departement } from '../../../pages/Admin/Departements';
import { Region, regions } from '../../../pages/Admin/Regions';


function ModalCreateUpdate({ departement }: { departement : Departement | null }) {

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [region, setRegion] = useState<Region>();
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorRegion, setErrorRegion] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (departement) {
            setModalTitle("Mettre à jour les informations du département");
            setCode(departement.code);
            setLibelle(departement.libelle);
            setRegion(departement.region);
            
        } else {
            setModalTitle("Enregistrer un nouveau département");
            setCode("");
            setLibelle("");
            setRegion(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setErrorRegion("");
            setIsFirstRender(false);
        }
    }, [departement, isFirstRender]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorLibelle("");
        setErrorRegion("");
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
    
    
    

    const handleCreateUpdate = () => {
        if (!code || !libelle || !region) {
            if (!code) {
                setErrorCode("Le champ code est obligatoire.");
            }
            if (!libelle) {
                setErrorLibelle("Le champ libellé est obligatoire.");
            }
            if (!region) {
                setErrorRegion("Le champ région est obligatoire.");
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
                
                <label>Code</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
                <label>Libellé</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) => {setLibelle(e.target.value); setErrorLibelle("")}}
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <label>Région</label><label className="text-red-500"> *</label>
                <select
                    value={region ? region.libelle : 'Sélectionnez une région'}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une région</option>
                    {regions.map(region => (
                        <option key={region.id} value={region.libelle}>{region.libelle}</option>
                    ))}
                </select>
                {errorRegion && <p className="text-red-500">{errorRegion}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
