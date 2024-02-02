import { useDispatch, useSelector } from 'react-redux';
import { setShowModalCreate, setShowModalUpdate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useState } from 'react';


function ModalCreateEtudiant()  {
    
    const dispatch = useDispatch();
    const [newEntry, setNewEnrty] = useState("");

    const etudiant = undefined; //initialisé la valeur de etudiant avec {} pour voir comment fonctionne la modification
    const isModalOpen = !etudiant?useSelector((state: RootState) => state.setting.showModal.create):useSelector((state: RootState) => state.setting.showModal.update);
    // const closeModal = () => { dispatch(setShowModalCreate()); };
    const closeModal = () => { !etudiant?dispatch(setShowModalCreate()):dispatch(setShowModalUpdate()); setNewEnrty("");};    

    const handleCreateEtudiant = () => {
        
        console.log("student add");
        closeModal();
        
    }

    return (
        <>
            <CustomDialogModal
                title = {!etudiant?"Enregistrer un nouvel étudiant":"Mettre à jour les informations étudiant"}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
            <label>Nom</label><input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                value={newEntry}
                onChange={(e) => setNewEnrty(e.target.value)}
            />
            <label>Prénom</label><input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                value={newEntry}
                onChange={(e) => setNewEnrty(e.target.value)}
            />

            </CustomDialogModal>
            
        </>
    );
}

export default ModalCreateEtudiant



