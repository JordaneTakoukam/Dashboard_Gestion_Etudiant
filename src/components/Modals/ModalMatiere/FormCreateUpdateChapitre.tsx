import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalChapitre } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
// import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Matiere } from '../../../pages/Admin/ListeMatieres';
// import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';
// import CustomDialogModalMatiere from '../CustomDialogModalMatiere';

// Interface pour la classe TypeEnseignement
export interface TypeEnseignement {
    id?: number;
    code: string;
    libelle: string;
    volumeHoraire: number;
}

// Définition des types d'enseignement
export const cm: TypeEnseignement = { id: 1, code: "CM", libelle: "Cours magistral", volumeHoraire: 0 };
export const td: TypeEnseignement = { id: 2, code: "TD", libelle: "Travaux dirigés", volumeHoraire: 0 };
export const tp: TypeEnseignement = { id: 3, code: "TP", libelle: "Travaux pratiques", volumeHoraire: 0 };
export const typesEnseignement: TypeEnseignement[] = [cm, td, tp];

// function ModalCreateUpdate({ matiere }: { matiere: Matiere | null }) {
//     const dispatch = useDispatch();
//     const [code, setCode] = useState("");
//     const [libelle, setLibelle] = useState("");
    
//     const [errorCode, setErrorCode] = useState("");
//     const [errorLibelle, setErrorLibelle] = useState("");
   
//     const [isFirstRender, setIsFirstRender] = useState(true);
//     const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openChapitre);
//     const [modalTitle, setModalTitle] = useState("");
//     const [typesEnseignementState, setTypesEnseignementState] = useState<TypeEnseignement[]>([cm]); // État local pour les types d'enseignement
//     const [objectifs, setObjectifs] = useState<string[]>([""]); // État local pour les objectifs
//     const [competences, setCompetences] = useState<string[]>([""]); // État local pour les compétences

//     useEffect(() => {
//         if (matiere) {
//             setModalTitle(matiere.code + " : " + matiere.libelle);
//         }
//         if (isFirstRender) {
//             setErrorCode("");
//             setErrorLibelle("");
//             setIsFirstRender(false);
//         }
//     }, [matiere, isFirstRender]);

//     const closeModal = () => {
//         setErrorCode("");
//         setErrorLibelle("");
//         setIsFirstRender(true);
//         dispatch(setShowModalChapitre());
//     };

//     const handleAddTypeEnseignement = () => {
//         // Vérifier s'il existe un type d'enseignement à ajouter
//         if (typesEnseignement.length > 0) {
//             // Ajouter le premier type d'enseignement à la liste
//             setTypesEnseignementState(prevState => [...prevState, typesEnseignement[0]]);
//         }
//     };

//     const handleRemoveTypeEnseignement = (index: number) => {
//         setTypesEnseignementState(prevState => prevState.filter((_, i) => i !== index));
//     };

//     const handleTypeEnseignementChange = (index: number, type: TypeEnseignement) => {
//         setTypesEnseignementState(prevState => {
//             const updatedTypes = [...prevState];
//             updatedTypes[index] = type;
//             return updatedTypes;
//         });
//     };

//     const handleAddObjectif = () => {
//         setObjectifs(prevObjectifs => [...prevObjectifs, ""]);
//     };

//     const handleRemoveObjectif = (index: number) => {
//         setObjectifs(prevObjectifs => prevObjectifs.filter((_, i) => i !== index));
//     };

//     const handleObjectifChange = (index: number, value: string) => {
//         setObjectifs(prevObjectifs => {
//             const updatedObjectifs = [...prevObjectifs];
//             updatedObjectifs[index] = value;
//             return updatedObjectifs;
//         });
//     };

//     const handleAddCompetence = () => {
//         setCompetences(prevCompetences => [...prevCompetences, ""]);
//     };

//     const handleRemoveCompetence = (index: number) => {
//         setCompetences(prevCompetences => prevCompetences.filter((_, i) => i !== index));
//     };

//     const handleCompetenceChange = (index: number, value: string) => {
//         setCompetences(prevCompetences => {
//             const updatedCompetences = [...prevCompetences];
//             updatedCompetences[index] = value;
//             return updatedCompetences;
//         });
//     };

//     const handleCreateUpdate = () => {
//         // Vérifier si tous les champs requis sont remplis
//         if (!code || !libelle ||  typesEnseignementState.length === 0) {
//             if (!code) {
//                 setErrorCode("Le champ code est obligatoire.");
//             }
//             if (!libelle) {
//                 setErrorLibelle("Le champ libellé est obligatoire.");
//             }
            
//             return;
//         }
//         closeModal();
//     };

//     return (
//         <>
//             <CustomDialogModalMatiere
//                 title={modalTitle}
//                 isModalOpen={isModalOpen}
//                 isDelete={false}
//                 closeModal={closeModal}
//                 handleConfirm={handleCreateUpdate}
//             >
//                 <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
//                     <div className="w-full sm:w-1/2">
//                         <label>Code</label><label className="text-red-500"> *</label>
//                         <input
//                             className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                             type="text"
//                             value={code}
//                             onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
//                         />
//                         {errorCode && <p className="text-red-500">{errorCode}</p>}
//                         <label>Libellé</label><label className="text-red-500"> *</label>
//                         <input
//                             className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                             type="text"
//                             value={libelle}
//                             onChange={(e) => { setLibelle(e.target.value); setErrorLibelle("") }}
//                         />
//                         {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
//                         <div>
//                             <h3>Types d'enseignement :</h3>
//                             {typesEnseignementState.map((type, index) => (
//                                 <div key={index} className="flex items-center">
//                                     <select
//                                         value={type.code}
//                                         onChange={(e) => {
//                                             const selectedType = typesEnseignement.find(t => t.code === e.target.value);
//                                             if (selectedType) {
//                                                 handleTypeEnseignementChange(index, selectedType);
//                                             }
//                                         }}
//                                     >
//                                         {typesEnseignement.map((t, i) => (
//                                             <option key={i} value={t.code}>{t.code}</option>
//                                         ))}
//                                     </select>
//                                     <input
//                                         className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                                         type="number"
//                                         placeholder="Volume horaire"
//                                         value={type.volumeHoraire}
//                                         onChange={(e) => handleTypeEnseignementChange(index, { ...type, volumeHoraire: +e.target.value })}
//                                     />
//                                     {index !== 0 && ( // Ne pas afficher le bouton de suppression pour le premier type
//                                         <button type="button" onClick={() => handleRemoveTypeEnseignement(index)}>
//                                             Supprimer
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                             {typesEnseignementState.length < typesEnseignement.length && ( // Afficher le bouton d'ajout si tous les types n'ont pas été ajoutés
//                                 <button type="button" onClick={handleAddTypeEnseignement}>
//                                     Ajouter un type d'enseignement
//                                 </button>
//                             )}
//                         </div>

//                         <div>
//                             <h3>Objectifs :</h3>
//                             {objectifs.map((objectif, index) => (
//                                 <div key={index} className="flex items-center">
//                                     <input
//                                         className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                                         type="text"
//                                         placeholder={`Objectif ${index + 1}`}
//                                         value={objectif}
//                                         onChange={(e) => handleObjectifChange(index, e.target.value)}
//                                     />
//                                     {index !== 0 && (
//                                         <button type="button" onClick={() => handleRemoveObjectif(index)}>
//                                             Supprimer
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                             <button type="button" onClick={handleAddObjectif}>
//                                 Ajouter un objectif
//                             </button>
//                         </div>

//                         <div>
//                             <h3>Compétences :</h3>
//                             {competences.map((competence, index) => (
//                                 <div key={index} className="flex items-center">
//                                     <input
//                                         className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                                         type="text"
//                                         placeholder={`Compétence ${index + 1}`}
//                                         value={competence}
//                                         onChange={(e) => handleCompetenceChange(index, e.target.value)}
//                                     />
//                                     {index !== 0 && (
//                                         <button type="button" onClick={() => handleRemoveCompetence(index)}>
//                                             Supprimer
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                             <button type="button" onClick={handleAddCompetence}>
//                                 Ajouter une compétence
//                             </button>
//                         </div>
//                     </div>
//                     <div className="w-full sm:w-1/2">Chapitre de la matiere</div>
//                 </div>
//             </CustomDialogModalMatiere>
//         </>
//     );
// }
function ModalCreateUpdate({ matiere }: { matiere: Matiere | null }) {}
export default ModalCreateUpdate;
