import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Section, sections } from '../../../pages/Admin/Sections';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Matiere } from '../../../pages/Admin/ListeMatieres';
import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';


function ModalCreateUpdate({ matiere }: { matiere : Matiere | null }) {

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [prerequis, setPrerequis] = useState("");
    const [evaluationDesAcquis, setEvaluationDesAcquis] = useState("");
    const [approchePedagogique, setApprochePedagogique] = useState("");
    const [section, setSection] = useState<Section>();
    const [cycle, setCycle] = useState<Cycle>();
    const [niveau, setNiveau] = useState<Niveau>();
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (matiere) {
            setModalTitle("Mettre à jour les informations de la matière");
            setCode(matiere.code);
            setLibelle(matiere.libelle);
            setPrerequis(matiere.prerequis?matiere.prerequis:"");
            setEvaluationDesAcquis(matiere.evaluationDesAcquis?matiere.evaluationDesAcquis:"");
            setApprochePedagogique(matiere.approchePedagogique?matiere.approchePedagogique:"");
            setSection(matiere.niveau.cycle.section);
            setCycle(matiere.niveau.cycle);
            setNiveau(matiere.niveau);
            
        } else {
            setModalTitle("Enregistrer une nouvelle matière");
            setCode("");
            setLibelle("");
            setPrerequis("");
            setEvaluationDesAcquis("");
            setApprochePedagogique("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setIsFirstRender(false);
        }
    }, [matiere, isFirstRender]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorLibelle("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
        if (selectedSection) {
            setSection(selectedSection);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        const selectedCycle = cycles.find(cycle => cycle.libelle === selectedCycleLibelle);
        if (selectedCycle) {
            setCycle(selectedCycle);
            setErrorCycle("");
        }
    };
    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        const selectedNiveau = niveaux.find(niveau => niveau.libelle === selectedNiveauLibelle);
        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };
    
    
    

    const handleCreateUpdate = () => {
        if (!code || !libelle || !section || !cycle || !niveau) {
            if (!code) {
                setErrorCode("Le champ code est obligatoire.");
            }
            if (!libelle) {
                setErrorLibelle("Le champ libellé est obligatoire.");
            }
            if (!section) {
                setErrorSection("Le champ section est obligatoire.");
            }
            if (!cycle) {
                setErrorCycle("Le champ cycle est obligatoire.");
            }
            if (!niveau) {
                setErrorNiveau("Le champ niveau est obligatoire.");
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
                <label>Prérequis</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={prerequis}
                    onChange={(e) => {setPrerequis(e.target.value);}}
                />
                <label>Approche pédagogique</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={approchePedagogique}
                    onChange={(e) => {setApprochePedagogique(e.target.value);}}
                />
                <label>Evaluations des acquis</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={evaluationDesAcquis}
                    onChange={(e) => {setEvaluationDesAcquis(e.target.value);}}
                />
                <label>Section</label><label className="text-red-500"> *</label>
                <select
                    value={section ? section.libelle : 'Sélectionnez une section'}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une section</option>
                    {sections.map(section => (
                        <option key={section.id} value={section.libelle}>{section.libelle}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>Cycle</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? cycle.libelle : 'Sélectionnez un cycle'}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un cycle</option>
                    {cycles.map(cycle => (
                        <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>Niveau</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? niveau.libelle : 'Sélectionnez un niveau'}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un niveau</option>
                    {niveaux.map(niveau => (
                        <option key={niveau.id} value={niveau.libelle}>{niveau.libelle}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
