import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Matiere } from '../../../pages/Admin/ListeMatieres';
import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';
import { useTranslation } from 'react-i18next';


// function ModalCreateUpdate({ matiere }: { matiere : Matiere | null }) {
//     const {t}=useTranslation();
//     const dispatch = useDispatch();
//     const [code, setCode] = useState("");
//     const [libelle, setLibelle] = useState("");
//     const [prerequis, setPrerequis] = useState("");
//     const [evaluationDesAcquis, setEvaluationDesAcquis] = useState("");
//     const [approchePedagogique, setApprochePedagogique] = useState("");
//     const [section, setSection] = useState<Section>();
//     const [cycle, setCycle] = useState<Cycle>();
//     const [niveau, setNiveau] = useState<Niveau>();
    
//     const [errorCode, setErrorCode] = useState("");
//     const [errorLibelle, setErrorLibelle] = useState("");
//     const [errorSection, setErrorSection] = useState("");
//     const [errorCycle, setErrorCycle] = useState("");
//     const [errorNiveau, setErrorNiveau] = useState("");
//     const [isFirstRender, setIsFirstRender] = useState(true);
    

//     const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
//     const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

//     useEffect(() => {
//         if (matiere) {
//             setModalTitle(t('form_update.enregistrer')+t('form_update.matiere'));
//             setCode(matiere.code);
//             setLibelle(matiere.libelle);
//             setPrerequis(matiere.prerequis?matiere.prerequis:"");
//             setEvaluationDesAcquis(matiere.evaluationDesAcquis?matiere.evaluationDesAcquis:"");
//             setApprochePedagogique(matiere.approchePedagogique?matiere.approchePedagogique:"");
//             setSection(matiere.niveau.cycle.section);
//             setCycle(matiere.niveau.cycle);
//             setNiveau(matiere.niveau);
            
//         } else {
//             setModalTitle(t('form_save.enregistrer')+t('form_save.matiere'));
//             setCode("");
//             setLibelle("");
//             setPrerequis("");
//             setEvaluationDesAcquis("");
//             setApprochePedagogique("");
//             setSection(undefined);
//             setCycle(undefined);
//             setNiveau(undefined);
//         }


//         if (isFirstRender) {
//             setErrorCode("");
//             setErrorLibelle("");
//             setErrorSection("");
//             setErrorCycle("");
//             setErrorNiveau("");
//             setIsFirstRender(false);
//         }
//     }, [matiere, isFirstRender, t]);

//     const closeModal = () => { 
//         setErrorCode(""); 
//         setErrorLibelle("");
//         setErrorSection("");
//         setErrorCycle("");
//         setErrorNiveau("");
//         setIsFirstRender(true);
//         dispatch(setShowModal()); 
//     };

//     const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedSectionLibelle = e.target.value;
//         const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
//         if (selectedSection) {
//             setSection(selectedSection);
//             setErrorSection("");
//         }
//     };
//     const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCycleLibelle = e.target.value;
//         const selectedCycle = cycles.find(cycle => cycle.libelle === selectedCycleLibelle);
//         if (selectedCycle) {
//             setCycle(selectedCycle);
//             setErrorCycle("");
//         }
//     };
//     const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedNiveauLibelle = e.target.value;
//         const selectedNiveau = niveaux.find(niveau => niveau.libelle === selectedNiveauLibelle);
//         if (selectedNiveau) {
//             setNiveau(selectedNiveau);
//             setErrorNiveau("");
//         }
//     };
    
    
    

//     const handleCreateUpdate = () => {
//         if (!code || !libelle || !section || !cycle || !niveau) {
//             if (!code) {
//                 setErrorCode(t('error.code'));
//             }
//             if (!libelle) {
//                 setErrorLibelle(t('error.libelle'));
//             }
//             if (!section) {
//                 setErrorSection(t('error.section'));
//             }
//             if (!cycle) {
//                 setErrorCycle(t('error.cycle'));
//             }
//             if (!niveau) {
//                 setErrorNiveau(t('error.niveau'));
//             }


//             return;
//         }
        
//         closeModal();
//     }

//     return (
//         <>
//             <CustomDialogModal
//                 title={modalTitle} // Utilisation du titre dynamique
//                 isModalOpen={isModalOpen}
//                 isDelete={false}
//                 closeModal={closeModal}
//                 handleConfirm={handleCreateUpdate}
//             >
                
//                 <label>{t('label.code')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={code}
//                     onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
//                 />
//                 {errorCode && <p className="text-red-500" >{errorCode}</p>}
//                 <label>{t('label.libelle')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={libelle}
//                     onChange={(e) => {setLibelle(e.target.value); setErrorLibelle("")}}
//                 />
//                 {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
//                 <label>{t('label.prerequis')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={prerequis}
//                     onChange={(e) => {setPrerequis(e.target.value);}}
//                 />
//                 <label>{t('label.approche_ped')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={approchePedagogique}
//                     onChange={(e) => {setApprochePedagogique(e.target.value);}}
//                 />
//                 <label>{t('label.evaluation_acquis')}</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={evaluationDesAcquis}
//                     onChange={(e) => {setEvaluationDesAcquis(e.target.value);}}
//                 />
//                 <label>{t('label.section')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={section ? section.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.section')}
//                     onChange={handleSectionChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.section')}</option>
//                     {sections.map(section => (
//                         <option key={section.id} value={section.libelle}>{section.libelle}</option>
//                     ))}
//                 </select>
//                 {errorSection && <p className="text-red-500">{errorSection}</p>}
//                 <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={cycle ? cycle.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}
//                     onChange={handleCycleChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}</option>
//                     {cycles.map(cycle => (
//                         <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
//                     ))}
//                 </select>
//                 {errorCycle && <p className="text-red-500">{errorCycle}</p>}
//                 <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={niveau ? niveau.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.niveau')}
//                     onChange={handleNiveauChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.niveau')}</option>
//                     {niveaux.map(niveau => (
//                         <option key={niveau.id} value={niveau.libelle}>{niveau.libelle}</option>
//                     ))}
//                 </select>
//                 {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
//             </CustomDialogModal>

//         </>
//     );
// }
function ModalCreateUpdate({ matiere }: { matiere : Matiere | null }) {}

export default ModalCreateUpdate;
