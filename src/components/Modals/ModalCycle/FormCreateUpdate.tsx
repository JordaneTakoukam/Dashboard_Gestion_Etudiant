import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Cycle } from '../../../pages/Admin/Cycles';
import { useTranslation } from 'react-i18next';



// function ModalCreateUpdate({ cycle }: { cycle : Cycle | null }) {
//     const {t}=useTranslation();
//     const dispatch = useDispatch();
//     const [code, setCode] = useState("");
//     const [libelle, setLibelle] = useState("");
//     const [section, setSection] = useState<CommonSettingProps>();
    
//     const [errorCode, setErrorCode] = useState("");
//     const [errorLibelle, setErrorLibelle] = useState("");
//     const [errorSection, setErrorSection] = useState("");
//     const [isFirstRender, setIsFirstRender] = useState(true);
    

//     const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
//     const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

//     useEffect(() => {
//         if (cycle) {
//             setModalTitle(t('form_update.enregistrer')+t('form_update.cycle'));
//             setCode(cycle.code);
//             setLibelle(cycle.libelle);
//             setSection(cycle.section);
            
//         } else {
//             setModalTitle(t('form_save.enregistrer')+t('form_save.cycle'));
//             setCode("");
//             setLibelle("");
//             setSection(undefined);
//         }


//         if (isFirstRender) {
//             setErrorCode("");
//             setErrorLibelle("");
//             setErrorSection("");
//             setIsFirstRender(false);
//         }
//     }, [cycle, isFirstRender, t]);

//     const closeModal = () => { 
//         setErrorCode(""); 
//         setErrorLibelle("");
//         setErrorSection("");
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
    
    
    

//     const handleCreateUpdate = () => {
//         if (!code || !libelle || !section) {
//             if (!code) {
//                 setErrorCode(t('error.code'));
//             }
//             if (!libelle) {
//                 setErrorLibelle(t('error.libelle'));
//             }
//             if (!section) {
//                 setErrorSection(t('error.section'));
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
//                 <label>{t('label.section')}</label><label className="text-red-500"> *</label>
//                 <select
//                     value={section ? section.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}
//                     onChange={handleSectionChange}
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                 >
//                     <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}</option>
//                     {sections.map(section => (
//                         <option key={section.id} value={section.libelle}>{section.libelle}</option>
//                     ))}
//                 </select>
//                 {errorSection && <p className="text-red-500">{errorSection}</p>}
//             </CustomDialogModal>

//         </>
//     );
// }
function ModalCreateUpdate({ cycle }: { cycle : Cycle | null }) {}

export default ModalCreateUpdate;
