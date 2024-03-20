import { useDispatch, useSelector } from 'react-redux';
import { setShowModalToDOSondage} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import { Sondage } from '../../../pages/Admin/Sondages';
import {rubriques } from '../../../pages/Admin/Rubriques';
import CustomDialogModalSondage from '../CustomDialogModalSondage';
import { Question, questions } from '../../../pages/Admin/Questions';
import { GroupeQuestion, groupequestions, rubrique1 } from '../../../pages/Admin/GroupeQuestions';


function ModalCreateUpdate({ sondage }: { sondage : Sondage | null}) {

    const dispatch = useDispatch();

    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.toDoSondage);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    // État local pour gérer la pagination des questions
    const [selectedGroupeQuestions, setSelectedGroupeQuestion] = useState<GroupeQuestion[]>([]);
    const [selectedQuestions, setSelectedQuestion] = useState<Question[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    const getElement=() =>{
        let rub = rubriques[currentPage];
        let groupeQuestions:GroupeQuestion[]=[] ;
        groupequestions.forEach((groupeQuestion) => {
            if(groupeQuestion.rubrique.libelle === rub.libelle){
                groupeQuestions.push(groupeQuestion)
            }
        })
        if(groupeQuestions){
            setSelectedGroupeQuestion(groupeQuestions);
        }
    }
    // Fonction pour gérer le passage à la page suivante
    const goToNextPage = () => {
        
        setCurrentPage(currentPage + 1);
        getElement();
    };


    // Fonction pour gérer le retour à la page précédente
    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1);
        getElement();
    };

    useEffect(() => {
        
        if(sondage){
            setModalTitle(sondage.libelle);
        }
        
        getElement();

        if (isFirstRender) {
            
            setIsFirstRender(false);
        }
    }, [sondage, isFirstRender]);

    const closeModal = () => { 
        
        setIsFirstRender(true);
        dispatch(setShowModalToDOSondage()); 
    };

   
    
    

    const handleConfirm = () => {    
        closeModal();
    }

    return (
        <>
            <CustomDialogModalSondage
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
            >
                {/* Affichage de la rubrique en cours */}
                <h3>{rubriques[currentPage].libelle}</h3>
                
                {/* Affichage des questions du groupe de questions en cours */}
                {selectedGroupeQuestions.map((groupeQuestion: GroupeQuestion) => (
                    <div key={groupeQuestion.id}>
                        <br/><h4>{groupeQuestion.libelle}</h4>
                        <table className={groupeQuestion.displayType === 'Texte' ? 'border-none' : 'border'}>
                            <thead>
                                <tr>
                                    <th className={groupeQuestion.displayType === 'Texte' ? 'border-none' : 'border'}>{groupeQuestion.sujetDeQuestion}</th>
                                    {groupeQuestion.reponses.map((reponse, index) => (
                                        <th key={index} className={groupeQuestion.displayType === 'Texte' ? 'border-none' : 'border'}>{reponse.libelle}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={groupeQuestion.displayType === 'Texte' ? 'border-none' : 'border'}>
                                {questions.map((question: Question, index) => (
                                    <tr key={index}>
                                        <td className={groupeQuestion.displayType === 'Texte' ? 'border-none' : 'border'}>{question.libelle}</td>
                                        {groupeQuestion.reponses.map((reponse, index) => (
                                            <td key={index} className={groupeQuestion.displayType === 'Texte' ? 'border-none' : 'border'}>
                                                <input type="radio" name={`question_${question.id}`} value={reponse.id} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                {/* Pagination des questions */}
                {currentPage > 0 && (
                    <button onClick={goToPreviousPage}>Précédent</button>
                )}
                {currentPage < rubriques.length - 1 && (
                    <button onClick={goToNextPage}>Suivant</button>
                )}
                {currentPage === rubriques.length - 1 && (
                    <button onClick={handleConfirm}>Terminer le sondage</button>
                )}
            </CustomDialogModalSondage>

        </>
    );
}

export default ModalCreateUpdate;
