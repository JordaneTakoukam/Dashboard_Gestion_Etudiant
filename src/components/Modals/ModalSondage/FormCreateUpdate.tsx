import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Sondage } from '../../../pages/Admin/Sondages';
// import { Section, sections } from '../../../pages/Admin/Sections';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Rubrique, allRubriques } from '../../../pages/Admin/Rubriques';


// function ModalCreateUpdate({ sondage }: { sondage : Sondage | null }) {

//     const dispatch = useDispatch();
//     const [code, setCode] = useState("");
//     const [libelle, setLibelle] = useState("");
//     const [section, setSection] = useState<Section>();
//     const [cycle, setCycle] = useState<Cycle>();
//     const [matiere, setMatiere] = useState<Matiere>();
//     const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    
//     const [errorCode, setErrorCode] = useState("");
//     const [errorLibelle, setErrorLibelle] = useState("");
//     const [errorSection, setErrorSection] = useState("");
//     const [errorCycle, setErrorCycle] = useState("");
//     const [errorMatiere, setErrorMatiere] = useState("");
//     const [errorRubrique, setErrorRubrique] = useState("");
//     const [isFirstRender, setIsFirstRender] = useState(true);
    

//     const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
//     const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

//     useEffect(() => {
//         if (sondage) {
//             setModalTitle("Mettre à jour les informations du sondage");
//             setCode(sondage.code);
//             setLibelle(sondage.libelle);
//             setSection(sondage.cycle.section);
//             setCycle(sondage.cycle);
//             setMatiere(sondage.matiere);
//             setRubriques(sondage.rubriques);
            
//         } else {
//             setModalTitle("Enregistrer un nouveau sondage");
//             setCode("");
//             setLibelle("");
//             setSection(undefined);
//             setCycle(undefined);
//             setMatiere(undefined);
//             setRubriques([]);
//         }


//         if (isFirstRender) {
//             setErrorCode("");
//             setErrorLibelle("");
//             setErrorSection("");
//             setErrorCycle("");
//             setErrorMatiere("");
//             setErrorRubrique("");
//             setIsFirstRender(false);
//         }
//     }, [sondage, isFirstRender]);

//     const closeModal = () => { 
//         setErrorCode(""); 
//         setErrorLibelle("");
//         setErrorSection("");
//         setErrorCycle("");
//         setErrorMatiere("");
//         setErrorRubrique("");
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
//     const handleMatiereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedMatiereLibelle = e.target.value;
//         const selectedMatiere = matieres.find(matiere => matiere.libelle === selectedMatiereLibelle);
//         if (selectedMatiere) {
//             setMatiere(selectedMatiere);
//             setErrorMatiere("");
//         }
//     };
//     const handleRubriqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedRubriques = Array.from(e.target.selectedOptions, option => option.value);
//         const rubriquesList: Rubrique[] = selectedRubriques.map(libelle => {
//             const rubrique = allRubriques.find(rubrique => rubrique.libelle === libelle);
//             if (rubrique) {
//                 return rubrique;
//             }
//             return { ordre:0, libelle: "" }; // Ou tout autre gestion d'erreur nécessaire
//         });
//         setRubriques(rubriquesList);
//     };
    
    

//     const handleCreateUpdate = () => {
//         if (!code || !libelle || !section || !cycle || !matiere || rubriques.length === 0) {
//             if (!code) {
//                 setErrorCode("Le champ code est obligatoire.");
//             }
//             if (!libelle) {
//                 setErrorLibelle("Le champ libellé est obligatoire.");
//             }
//             if (!section) {
//                 setErrorSection("Le champ section est obligatoire.");
//             }
//             if (!cycle) {
//                 setErrorCycle("Le champ cycle est obligatoire.");
//             }
//             if(!matiere){
//                 setErrorMatiere("Le champ matière est obligatoire");
//             }
//             if (rubriques.length === 0) {
//                 setErrorRubrique("Veuillez sélectionner au moins une rubrique.");
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
                
//                 <label>Code</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={code}
//                     onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
//                 />
//                 {errorCode && <p className="text-red-500" >{errorCode}</p>}
//                 <label>Libellé</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={libelle}
//                     onChange={(e) => {setLibelle(e.target.value); setErrorLibelle("")}}
//                 />
//                 {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
//                 <label>Section</label><label className="text-red-500"> *</label>
//                 <select
//                     value={section ? section.libelle : 'Sélectionnez une section'}
//                     onChange={handleSectionChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">Sélectionnez une section</option>
//                     {sections.map(section => (
//                         <option key={section.id} value={section.libelle}>{section.libelle}</option>
//                     ))}
//                 </select>
//                 {errorSection && <p className="text-red-500">{errorSection}</p>}
//                 <label>Cycle</label><label className="text-red-500"> *</label>
//                 <select
//                     value={cycle ? cycle.libelle : 'Sélectionnez un cycle'}
//                     onChange={handleCycleChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">Sélectionnez un cycle</option>
//                     {cycles.map(cycle => (
//                         <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
//                     ))}
//                 </select>
//                 {errorCycle && <p className="text-red-500">{errorCycle}</p>}
//                 <label>Matière</label><label className="text-red-500"> *</label>
//                 <select
//                     value={matiere ? matiere.libelle : 'Sélectionnez une matiere'}
//                     onChange={handleMatiereChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">Sélectionnez une matière</option>
//                     {matieres.map(matiere => (
//                         <option key={matiere.id} value={matiere.libelle}>{matiere.libelle}</option>
//                     ))}
//                 </select>
//                 {errorMatiere && <p className="text-red-500">{errorMatiere}</p>}
//                 <label>Rubriques</label><label className="text-red-500"> *</label>
//                 <select
//                     multiple
//                     value={rubriques.map(rubrique => rubrique.libelle)}
//                     onChange={handleRubriqueChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     {/* Options pour les rubriques */}
//                     {allRubriques.map(rubrique => (
//                         <option key={rubrique.id} value={rubrique.libelle}>{rubrique.libelle}</option>
//                     ))}
//                 </select>
//                 {errorRubrique && <p className="text-red-500">{errorRubrique}</p>}
//             </CustomDialogModal>

//         </>
//     );
// }
function ModalCreateUpdate({ sondage }: { sondage : Sondage | null }) {}
export default ModalCreateUpdate;
