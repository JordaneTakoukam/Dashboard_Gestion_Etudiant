import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loading from "../../components/ui/loading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { obtenirQuestionsDevoir } from "../../api/api_question";
import Breadcrumb from "../../components/Breadcrumb";
import createToast from "../../hooks/toastify";

// Définition du modèle QuestionType


const TestPage = () => {
  

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
  const { t } = useTranslation();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const devoir = useSelector((state: RootState) => state.devoirSlice.selectedDevoir);

  // État pour stocker les réponses et tentatives
  const [responses, setResponses] = useState<Record<string, number[]>>({});
  const [attemptsLeft, setAttemptsLeft] = useState(devoir?.tentativesMax || 0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const { feedbackConfig, noteSur } = devoir || {};
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calculateScore = () => {
    return questions.reduce((total, question) => {
      const selectedAnswers = responses[question._id || ""] || [];
      const questionScore = selectedAnswers.reduce(
        (acc, idx) =>
          acc + (question.options[idx]?.pourcentage / 100) * question.nbPoint,
        0
      );
      return total + questionScore;
    }, 0);
  };

  const calculateQuestionScore = (question:QuestionType) => {
    return question._id && responses[question._id]?.reduce(
      (acc, idx) =>
        acc +
        (question.options[idx]?.pourcentage / 100) * question.nbPoint,
      0
    )
  };

  const verifyDeadline = () =>{
    return devoir && (new Date() > new Date(devoir.deadline));
  }

  const getFeedback = () =>{
    return feedbackConfig && (( feedbackConfig.afficherNoteApresSoumission && isSubmitted) ||
      ((feedbackConfig.afficherNoteApresDeadline && verifyDeadline())))
   
  }

  const convertScore = (obtainedScore: number | null) => {
    if(!obtainedScore || !devoir) return 0;
    if (devoir.noteSur === 0) return 0; // Évite la division par zéro
    const totalQuestionScore = questions.reduce((total, question) => total + question.nbPoint, 0);
    return (obtainedScore * devoir.noteSur) / totalQuestionScore;
  }

  // Détecter si une question permet plusieurs réponses valides
  const hasMultipleValidChoices = (question?: QuestionType): boolean => {
    if(question){
      const validOptions = question.options.filter((option) => option.pourcentage > 0);
      return validOptions.length > 1;
    }
    return false;
  };

 // Gérer la sélection des réponses
 const handleAnswerSelect = (question: QuestionType , optionIndex: number) => {
    const deadlinePassed = devoir && (new Date() > new Date(devoir.deadline));
    if(!deadlinePassed){
      // Vérifier si question._id est une chaîne valide
      let questionId="";
      if(question && question._id){
        questionId = question._id;
      }

      if(question){
        setResponses((prev) => {
          const currentAnswers = prev[questionId] || [];
          const question = questions.find((q) => q._id === questionId);

          return hasMultipleValidChoices(question)
            ? {
                ...prev,
                [questionId]: currentAnswers.includes(optionIndex)
                  ? currentAnswers.filter((idx) => idx !== optionIndex)
                  : [...currentAnswers, optionIndex],
              }
            : { ...prev, [questionId]: [optionIndex] };
        });}
    }
  };
  
  // Effacer les réponses d'une question
  const clearAnswers = (questionId: string) => {
    
    setResponses((prev) => ({ ...prev, [questionId]: [] }));
    setIsSubmitted(false);
  };

  // Réinitialiser tout le test
  const submitTest = () => {
    const score = calculateScore();
    setFinalScore(score);
    setIsSubmitted(true);
    alert(`Test soumis ! Votre score est de ${score}/${noteSur}`);
  };

  const resetTest = () => {
    if (attemptsLeft > 1) {
      setResponses({});
      setAttemptsLeft((prev) => prev - 1);
      setFinalScore(null);
      setIsSubmitted(false);
    } else {
      alert("Plus de tentatives disponibles.");
    }
  };

  const showScore = () => {
    const deadlinePassed = devoir && (new Date() > new Date(devoir.deadline));
    return (
      (feedbackConfig && feedbackConfig.afficherNoteApresSoumission && finalScore !== null) ||
      (deadlinePassed && feedbackConfig && feedbackConfig.afficherNoteApresDeadline)
    );
  };

  const isOptionCorrect = (option: { textFr?: string; textEn?: string; pourcentage: any; }) => option.pourcentage > 0;

   useEffect(() => {
  
          const fetchQuestions = async () => {
              setPageIsLoading(true); // Définissez le loading à true avant le chargement
              try {
                  const emptyQuestions: QuestionReturnGetType = {
                      questions: [],
                      currentPage: 0,
                      totalItems: 0,
                      totalPages: 0,
                      pageSize: 0
                  }
                  if(devoir && devoir._id){
                      const fetchedQuestions = await obtenirQuestionsDevoir({ devoirId: devoir._id});
                          
                      if (fetchedQuestions) { // Vérifiez si fetchedQuestions n'est pas faux, vide ou indéfini
                          setQuestions(fetchedQuestions.questions);
                      } else {
                          setQuestions(emptyQuestions.questions);
                      }
                  }else {
                      setQuestions(emptyQuestions.questions);
                  }
                  
                  // Réinitialisez les erreurs s'il y en a
              } catch (error) {
                  createToast(t('message.erreur'), "", 2)
              } finally {
                  setPageIsLoading(false); // Définissez le loading à false après le chargement
              }
          }
          fetchQuestions();
      }, [devoir, t]); 

  return (
    <>
      <Breadcrumb pageName={t('sub_menu.test')} isQuestion={true} />
      {devoir && (<div>
          {lang === 'fr' ? devoir.titreFr : devoir.titreEn}
      </div>)}
      {pageIsLoading?
        <Loading/>
      :<div className="container mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Section des questions */}
        <div className="col-span-8">
          {questions.map((question, index) => (
            <div
              key={question._id}
              id={`question-${question._id}`}
              className="mb-6 bg-white p-4 rounded shadow flex gap-4"
            >
              {/* Contenu de la question */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">
                  {index + 1}. {lang==='fr'?question.textFr:question.textEn}
                </h2>
                <div className="space-y-2">
                {question.options.map((option, idx) => {
                const isSelected = question._id && responses[question._id]?.includes(idx);
                const isCorrect = isOptionCorrect(option);
                const isWrongSelection = isSelected && !isCorrect;

                return (
                  <label
                    key={idx}
                    className={`block p-2 border rounded flex items-center gap-2 ${
                      isCorrect && isSubmitted ? "border-green-500 bg-green-100" : ""
                    } ${
                      isWrongSelection && isSubmitted
                        ? "border-red-500 bg-red-100"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`question-${question._id}`}
                      checked={isSelected || false}
                      onChange={() => handleAnswerSelect(question, idx)}
                      disabled={isSubmitted}
                    />
                    {isSubmitted && (
                      <>
                        {isCorrect && (
                          <FaCheckCircle className="text-[#008000]" />
                        )}
                        {isWrongSelection && (
                          <FaTimesCircle className="text-red-500" />
                        )}
                      </>
                    )}
                    {lang==='fr'?option.textFr:option.textEn}
                  </label>
                );
              })}
                </div>
                <button
                  type="button"
                  onClick={() => clearAnswers(question._id!)}
                  className="mt-2 text-sm text-red-500 underline"
                >
                 {t('label.effacer_choix')}
                </button>
              </div>

              {/* Détails de la question */}
              <div className="w-64 bg-gray-100 p-4 rounded">
                <p className="text-sm">
                  <strong>{t('label.question')} :</strong> {index + 1}
                </p>
                <p className="text-sm">
                  <strong>{t('label.points')} :</strong> {question.nbPoint}
                </p>
                <p className="text-sm">
                  <strong>{t('label.repondu')} :</strong>{" "}
                  {question._id && responses[question._id]?.length ? t('label.oui') : t('label.non')}
                </p>
                <p className="text-sm">
                  <strong>{t('label.points_obtenus')} :</strong>{" "}
                  {getFeedback() && calculateQuestionScore(question)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section de navigation et actions */}
        <div className="col-span-4 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">{t('label.navigation')}</h3>
          <div className="space-y-2">
            {questions.map((question, index) => (
              <button
                key={question._id}
                className={`block w-full text-left py-2 px-4 rounded border ${
                  question._id && responses[question._id]?.length ? "bg-green-100" : "bg-white"
                } hover:bg-gray-200`}
                onClick={() =>
                  document
                    .getElementById(`question-${question._id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {t('label.question')} {index + 1}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {attemptsLeft > 0 ? (
              <button
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={resetTest}
              >
                {t('label.nouvelle_tentative')} ({attemptsLeft} {t('label.tentatives_restantes')})
              </button>
            ) : (
              <p className="text-red-500 text-sm">
                {t('label.plus_tentatives')}
              </p>
            )}
            <button
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={submitTest}
            >
              {t('label.soumettre_test')}
            </button>
            {showScore() && getFeedback() && 
            (
              <p className="mt-4 text-lg font-semibold text-center">
                {t('label.note_finale')} : {convertScore(finalScore)?.toFixed(2)} / {noteSur}
              </p>
            )}
          </div>
        </div>
      </div>}
    </>
  );
};

export default TestPage;
