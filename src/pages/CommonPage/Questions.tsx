import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalQuestion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalQuestion/FormDelete";
import Table from "../../components/Tables/TableQuestion/Table";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";
import { setQuestionLoading, setQuestions, setErrorPageQuestion } from "../../_redux/features/question_slice";
import createToast from "../../hooks/toastify";
import { obtenirQuestionsDevoir } from "../../api/api_question";

const Questions = () => {
    const selectedDevoir = useSelector((state: RootState) => state.devoirSlice.selectedDevoir);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);

    
    const { data: { questions } } = useSelector((state: RootState) => state.questionSlice);
    
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedDevoir === undefined) {
            navigate('/pedagogies/exercise-book')
        }
    }, [selectedDevoir])
    const handleEditQuestion = (question: QuestionType) => {
        setSelectedQuestion(question);
        
    }
    
    const {t}=useTranslation();
    const handleAddQuestion = () => {
        setSelectedQuestion(null);
        
    }

    const dispatch = useDispatch();
    useEffect(() => {

        const fetchQuestions = async () => {
            dispatch(setQuestionLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyQuestions: QuestionReturnGetType = {
                    questions: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if(selectedDevoir && selectedDevoir._id){
                    const fetchedQuestions = await obtenirQuestionsDevoir({ devoirId: selectedDevoir._id, page: 1});
                        
                    if (fetchedQuestions) { // Vérifiez si fetchedQuestions n'est pas faux, vide ou indéfini
                        dispatch(setQuestions(fetchedQuestions));
                    } else {
                        dispatch(setQuestions(emptyQuestions));
                    }
                }else {
                    dispatch(setQuestions(emptyQuestions));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageQuestion(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setQuestionLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchQuestions();
    }, [dispatch, selectedDevoir, t]); // Déclencher l'effet lorsque currentPage change

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.questions')} isQuestion={true} />
            <Table data={questions}  onCreate={handleAddQuestion} onEdit={handleEditQuestion} />

            <FormCreateUpdate question={selectedQuestion} devoir={selectedDevoir}/>
            <FormDelete question={selectedQuestion}  devoir={selectedDevoir}/>

        </>
    );
};

export default Questions;