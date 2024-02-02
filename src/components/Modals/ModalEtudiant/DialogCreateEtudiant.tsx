import { useDispatch, useSelector } from 'react-redux';
import { setShowModalCreate, setShowModalUpdate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
// import CustomDialogModal from '../CustomDialogModal';
import FormInfoEtudiants from './FormInfoEtudiants';
import { Etudiant } from '../../../pages/Admin/ListeEtudiants';


function ModalCreateEtudiant()  {
    const dispatch = useDispatch();
    const etudiant = {}; //initialisé la valeur de etudiant avec {} pour voir comment fonctionne la modification
    const isModalOpen = !etudiant?useSelector((state: RootState) => state.setting.showModal.create):useSelector((state: RootState) => state.setting.showModal.update);
    // const closeModal = () => { dispatch(setShowModalCreate()); };
    const closeModal = () => { !etudiant?dispatch(setShowModalCreate()):dispatch(setShowModalUpdate()); };
    

    const handleCreateEtudiant = () => {
        
        console.log("student add");
        closeModal();
    }

    return (
        <>
            {/* <CustomDialogModal
                title="Enregistrer un nouvel étudiant"
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <h1>Contenu</h1>
            </CustomDialogModal> */}
            <FormInfoEtudiants
                title={!etudiant?"Enregistrer un nouvel étudiant":"Mettre à jour les informations étudiant"}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
               {/* {etud !instanceof Etudiant && (<h1>{"nom"+etud.firstName}</h1>)} */}
               <h1>Contenu</h1>
            </FormInfoEtudiants>
        </>
    );
}

export default ModalCreateEtudiant



