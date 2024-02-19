import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Question } from '../../../pages/Admin/Questions';
import { Rubrique, rubriques } from '../../../pages/Admin/Rubriques';
import { GroupeQuestion, groupequestions } from '../../../pages/Admin/GroupeQuestions';


function ModalCreateUpdate({ question }: { question : Question | null }) {

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [ordre, setOrdre] = useState(0);
    const [rubrique, setRubrique] = useState<Rubrique>();
    const [groupequestion, setGroupeQuestion] = useState<GroupeQuestion>();
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorOrdre, setErrorOrdre] = useState("");
    const [errorRubrique, setErrorRubrique] = useState("");
    const [errorGroupeQuestion, setErrorGroupeQuestion] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (question) {
            setModalTitle("Mettre à jour les informations de la question");
            setCode(question.code);
            setLibelle(question.libelle);
            setOrdre(question.ordre);
            setRubrique(question.groupeQuestion.rubrique);
            setGroupeQuestion(question.groupeQuestion);
            
        } else {
            setModalTitle("Enregistrer une nouvelle question");
            setCode("");
            setLibelle("");
            setOrdre(0);
            setRubrique(undefined);
            setGroupeQuestion(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setErrorRubrique("");
            setErrorOrdre("");
            setErrorGroupeQuestion("");
            setIsFirstRender(false);
        }
    }, [question, isFirstRender]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorLibelle("");
        setErrorOrdre("");
        setErrorRubrique("");
        setErrorGroupeQuestion("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };

    const handleRubriqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRubriqueLibelle = e.target.value;
        const selectedRubrique = rubriques.find(rubrique => rubrique.libelle === selectedRubriqueLibelle);
        if (selectedRubrique) {
            setRubrique(selectedRubrique);
            setErrorRubrique("");
        }
    };
    const handleGroupeQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGroupeQuestionLibelle = e.target.value;
        const selectedGroupeQuestion = groupequestions.find(groupequestion => groupequestion.libelle === selectedGroupeQuestionLibelle);
        if (selectedGroupeQuestion) {
            setGroupeQuestion(selectedGroupeQuestion);
            setErrorGroupeQuestion("");
        }
    };
    
    
    

    const handleCreateUpdate = () => {
        if (!code || !libelle || !rubrique || !groupequestion || !ordre) {
            if (!code) {
                setErrorCode("Le champ code est obligatoire.");
            }
            if (!libelle) {
                setErrorLibelle("Le champ libellé est obligatoire.");
            }
            if (!ordre) {
                setErrorOrdre("Le champ numéro de la question est obligatoire.");
            }
            if (!rubrique) {
                setErrorRubrique("Le champ rubrique est obligatoire.");
            }
            if (!groupequestion) {
                setErrorGroupeQuestion("Le champ groupe de question est obligatoire.");
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
                <label>Numéro de la question</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={ordre}
                    onChange={(e) => {setOrdre(parseInt(e.target.value)); setErrorOrdre("")}}
                />
                {errorOrdre && <p className="text-red-500">{errorOrdre}</p>}
                <label>Libellé</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) => {setLibelle(e.target.value); setErrorLibelle("")}}
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                
                <label>Rubrique</label><label className="text-red-500"> *</label>
                <select
                    value={rubrique ? rubrique.libelle : 'Sélectionnez une rubrique'}
                    onChange={handleRubriqueChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une rubrique</option>
                    {rubriques.map(rubrique => (
                        <option key={rubrique.id} value={rubrique.libelle}>{rubrique.libelle}</option>
                    ))}
                </select>
                {errorRubrique && <p className="text-red-500">{errorRubrique}</p>}
                <label>Groupe de question</label><label className="text-red-500"> *</label>
                <select
                    value={groupequestion ? groupequestion.libelle : 'Sélectionnez un groupequestion'}
                    onChange={handleGroupeQuestionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un groupe de question</option>
                    {groupequestions.map(groupequestion => (
                        <option key={groupequestion.id} value={groupequestion.libelle}>{groupequestion.libelle}</option>
                    ))}
                </select>
                {errorGroupeQuestion && <p className="text-red-500">{errorGroupeQuestion}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
