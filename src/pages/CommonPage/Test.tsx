import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loading from "../../components/ui/loading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { obtenirQuestionsDevoir } from "../../api/api_question";
import Breadcrumb from "../../components/Breadcrumb";
import createToast from "../../hooks/toastify";
import { soumettreTentative } from "../../api/api_reponse";
import { formatDatetime } from "../../fonctions/fonction";

// Définition du modèle QuestionType


const TestPage = () => {
  

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
  const { t } = useTranslation();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const devoir = useSelector((state: RootState) => state.devoirSlice.selectedDevoir);
  const currentUser = useSelector((state: RootState) => state.user);

  // État pour stocker les réponses et tentatives
  const [reponses, setReponses] = useState<{
    question: string; //identiant de la question
    reponses: string[]; // Texte ou identifiant de l'option choisie
  }[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(devoir?.tentativesMax || 0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const { feedbackConfig, noteSur } = devoir || {};
  const [isSubmitted, setIsSubmitted] = useState(false);

  // const calculateScore = () => {
  //   return questions.reduce((total, question) => {
  //     // Filtrer les réponses de la question courante
  //     const selectedAnswers = reponses.filter((r) => r.question === question._id);
  
  //     // Calculer le score total pour la question courante
  //     const questionScore = selectedAnswers.reduce(
  //       (acc, { reponse }) => {
  //         // Trouver l'option correspondante
  //         const option = question.options.find(
  //           (opt) => opt.textFr === reponse || opt.textEn === reponse
  //         );
  //         if (option) {
  //           return acc + (option.pourcentage / 100) * question.nbPoint;
  //         }
  //         return acc;
  //       },
  //       0
  //     );
      
  //     // Ajouter le score de la question au score total
  //     return total + questionScore;
  //   }, 0);
  // };

  const calculateScore = () => {
    return questions.reduce((total, question) => {
      // Trouver les réponses associées à la question courante
      const questionResponses = reponses.find((r) => r.question === question._id);
  
      if (!questionResponses) return total;
  
      // Calculer le score total pour la question courante
      const questionScore = questionResponses.reponses.reduce((acc, response) => {
        // Trouver l'option correspondante
        const option = question.options.find(
          (opt) => opt.textFr === response || opt.textEn === response
        );
        if (option) {
          return acc + (option.pourcentage / 100) * question.nbPoint;
        }
        return acc;
      }, 0);
  
      // Ajouter le score de la question au score total
      return total + questionScore;
    }, 0);
  };
  


  const calculateQuestionScore = (question: QuestionType) => {
    // Trouver les réponses associées à la question courante
    const questionResponses = reponses.find((r) => r.question === question._id);
  
    if (!questionResponses) return 0;
  
    return questionResponses.reponses.reduce((acc, response) => {
      // Trouver l'option correspondante
      const option = question.options.find(
        (opt) => opt.textFr === response || opt.textEn === response
      );
      if (option) {
        return acc + (option.pourcentage / 100) * question.nbPoint;
      }
      
      return acc;
    }, 0);
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
//  const handleAnswerSelect = (question: QuestionType, optionValue: string) => {
//   const deadlinePassed = devoir && new Date() > new Date(devoir.deadline);
//   if (!deadlinePassed) {
//     // Vérifier si question._id est une chaîne valide
//     let questionId = "";
//     if (question && question._id) {
//       questionId = question._id;
//     }

//     if (question) {
//       setReponses((prev) => {
//         // Vérifier si une réponse existe déjà pour cette question
//         const existingAnswerIndex = prev.findIndex((resp) => resp.question === questionId);

//         if (existingAnswerIndex > -1) {
//           // Si une réponse existe et la question n'accepte qu'une seule réponse
//           if (!hasMultipleValidChoices(question)) {
//             const updatedReponses = [...prev];
//             updatedReponses[existingAnswerIndex].reponse = optionValue;
//             return updatedReponses;
//           } else {
//             // Si la question accepte plusieurs réponses
//             const updatedReponses = [...prev];
//             const currentReponses = updatedReponses[existingAnswerIndex].reponse.split(",");
//             const newReponses = currentReponses.includes(optionValue)
//               ? currentReponses.filter((val) => val !== optionValue)
//               : [...currentReponses, optionValue];
//             updatedReponses[existingAnswerIndex].reponse = newReponses.join(",");
//             return updatedReponses;
//           }
//         } else {
//           // Ajouter une nouvelle réponse si elle n'existe pas
//           return [...prev, { question: questionId, reponse: optionValue }];
//         }
//       });
//     }
//   }
// };

const handleAnswerSelect = (question: QuestionType, optionValue: string) => {
  const deadlinePassed = devoir && new Date() > new Date(devoir.deadline);
  if (!deadlinePassed) {
    // Vérifier si question._id est une chaîne valide
    let questionId = "";
    if (question && question._id) {
      questionId = question._id;
    }

    if (question) {
      setReponses((prev) => {
        // Trouver la réponse existante pour cette question
        const existingAnswerIndex = prev.findIndex((resp) => resp.question === questionId);

        if (existingAnswerIndex > -1) {
          // Si une réponse existe déjà pour cette question
          const updatedReponses = [...prev];
          const currentResponses = updatedReponses[existingAnswerIndex].reponses;

          if (!hasMultipleValidChoices(question)) {
            // Si la question n'accepte qu'une seule réponse
            updatedReponses[existingAnswerIndex].reponses = [optionValue];
          } else {
            // Si la question accepte plusieurs réponses
            const newResponses = currentResponses.includes(optionValue)
              ? currentResponses.filter((val) => val !== optionValue) // Retirer la réponse
              : [...currentResponses, optionValue]; // Ajouter une nouvelle réponse
            updatedReponses[existingAnswerIndex].reponses = newResponses;
          }

          return updatedReponses;
        } else {
          // Ajouter une nouvelle entrée pour cette question
          return [...prev, { question: questionId, reponses: [optionValue] }];
        }
      });
    }
  }
};




  
  // Effacer les réponses d'une question

  const clearAnswers = (questionId: string) => {
    setReponses((prev) => prev.filter((r) => r.question !== questionId)); // Supprimer l'objet de la question concernée
    setIsSubmitted(false);
  };
  
  

  // Réinitialiser tout le test
  const submitTest = async () => {
    try {
      const score = calculateScore(); // Calculer le score obtenu
      const convertedScore = convertScore(score); // Convertir en fonction de la note sur
      // Appeler l'API soumettreTentative
      await soumettreTentative({devoirId:devoir?._id||"", etudiantId:currentUser._id, reponses:reponses}).then((response: ReponseApiPros) => {
        if(response.success){
          createToast(response.message[lang as keyof typeof response.message], '', 0);
          setFinalScore(convertedScore); // Mettre à jour le score final
          setIsSubmitted(true); // Marquer le test comme soumis
        }else{
          createToast(response.message[lang as keyof typeof response.message], '', 2);
        }
      });

      
  
      // if (response?.success) {
      //   setFinalScore(score); // Mettre à jour le score final
      //   setIsSubmitted(true); // Marquer le test comme soumis
      //   createToast(t("message.test_soumis_succes"), "", 1); // Notification de succès
      // } else {
      //   throw new Error(response?.message || t("message.erreur_soumission"));
      // }
    } catch (error) {
      createToast(t("message.erreur"), "", 2); // Notification d'erreur
      console.error(error); // Log pour débogage
    }
  };
  

  const resetTest = () => {
    if (attemptsLeft > 1) {
      setReponses([]);
      // setAttemptsLeft((prev) => prev - 1);
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
          <Breadcrumb pageName={t("sub_menu.test")} isQuestion={true} />
          {devoir && (
            <div className="mt-4 p-4 bg-white text-gray-700 ">
              {/* Titre du devoir */}
              <div className="text-center text-2xl font-bold text-blue-600">
                {lang === "fr" ? devoir.titreFr : devoir.titreEn}
              </div>

              {/* Détails du devoir */}
              <div className="mt-4">
                {/* Nombre total de points */}
                <p className="text-lg">
                  <span className="font-semibold">{t('label.note_sur')}:</span> {devoir.noteSur}
                </p>

                {/* Délai */}
                <p className="text-lg mt-2">
                  <span className="font-semibold">{t('label.deadline')}:</span>{" "}
                  {formatDatetime(devoir.deadline, lang)}
                </p>

                {/* Type de feedback */}
                <div className="mt-4">
                  <span className="font-semibold text-lg">{lang === "fr" ? "Feedback" : "Feedback"}:</span>
                  <ul className="list-disc list-inside mt-2">
                    {feedbackConfig?.afficherNoteApresSoumission && (
                      <li>
                        {t('label.note_apres_soumission')}
                      </li>
                    )}
                    {feedbackConfig?.afficherCorrectionApresSoumission && (
                      <li>
                        {t('label.correction_apres_soumission')}
                      </li>
                    )}
                    {feedbackConfig?.afficherNoteApresDeadline && (
                      <li>
                        {t('label.note_apres_deadline')}
                      </li>
                    )}
                    {feedbackConfig?.afficherCorrectionApresDeadline && (
                      <li>
                        {t('label.correction_apres_deadline')}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {pageIsLoading ? (
            <Loading />
          ) : (
            <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Section des questions */}
              <div className="lg:col-span-8">
                {questions.map((question, index) => (
                  <div
                    key={question._id}
                    id={`question-${question._id}`}
                    className="mb-6 bg-white p-4 rounded shadow flex flex-col lg:flex-row gap-4"
                  >
                    {/* Contenu de la question */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-2">
                        {index + 1}. {lang === "fr" ? question.textFr : question.textEn}
                      </h2>
                      <div className="space-y-2">
                      {question.options.map((option, idx) => {
                          const isSelected = reponses.some(
                            (r) =>
                              r.question === question._id &&
                              r.reponses.includes(lang === "fr" ? option.textFr : option.textEn)
                          );

                          const isCorrect = isOptionCorrect(option);
                          const isWrongSelection = isSelected && !isCorrect;

                          return (
                            <label
                              key={idx}
                              className={`block p-2 border rounded flex items-center gap-2 ${
                                isCorrect && isSubmitted ? "border-green-500 bg-[#C6F6D5]" : ""
                              } ${
                                isWrongSelection && isSubmitted ? "border-red-500 bg-red-100" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                name={`question-${question._id}`}
                                checked={isSelected || false}
                                onChange={() =>
                                  handleAnswerSelect(
                                    question,
                                    lang === "fr" ? option.textFr : option.textEn
                                  )
                                }
                                disabled={isSubmitted}
                              />
                              {isSubmitted && getFeedback() && (
                                <>
                                  {isCorrect && <FaCheckCircle className="text-[#008000]" />}
                                  {isWrongSelection && <FaTimesCircle className="text-red-500" />}
                                </>
                              )}
                              {lang === "fr" ? option.textFr : option.textEn}
                            </label>
                          );
                        })}

                      </div>
                      <button
                        type="button"
                        onClick={() => clearAnswers(question._id!)}
                        className="mt-2 text-sm text-red-500 underline"
                      >
                        {t("label.effacer_choix")}
                      </button>
                    </div>
      
                    {/* Détails de la question */}
                    <div className="w-full lg:w-64 bg-[#F7FAFC] p-4 rounded">
                      <p className="text-sm">
                        <strong>{t("label.question")} :</strong> {index + 1}
                      </p>
                      <p className="text-sm">
                        <strong>{t("label.points")} :</strong> {question.nbPoint}
                      </p>
                      <p className="text-sm">
                          <strong>{t("label.repondu")} :</strong>{" "}
                          {reponses.some((r) => r.question === question._id)
                              ? t("label.oui")
                              : t("label.non")}
                      </p>
                      <p className="text-sm">
                        <strong>{t("label.points_obtenus")} :</strong>{" "}
                        {getFeedback() && calculateQuestionScore(question).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
      
              {/* Section de navigation et actions */}
              <div className="lg:col-span-4 bg-[#F7FAFC] p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">{t("label.navigation")}</h3>
                <div className="space-y-2">
                  {questions.map((question, index) => {
                    // const isAnswered = question._id && responses[question._id]?.length;
                    const isAnswered = reponses.some(
                      (r) => r.question === question._id && r.reponses.length > 0
                    );
                    

                    
                    return (
                      <button
                        key={question._id}
                        className={`flex items-center justify-between w-full text-left py-2 px-4 rounded border transition-colors ${
                          isAnswered ? "bg-[#C6F6D5] border-[#48BB78]" : "bg-white"
                        } hover:bg-[#EDF2F7]`}
                        onClick={() =>
                          document
                            .getElementById(`question-${question._id}`)
                            ?.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                      >
                        {t("label.question")} {index + 1}
                        {isAnswered && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#38A169]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4">
                    {attemptsLeft > 0 ? (
                      <button
                        className="w-full py-3 px-5 bg-[#3182CE] text-white rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 active:scale-95 hover:bg-[#2B6CB0] shadow-md"
                        onClick={resetTest}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 001 1h3a1 1 0 100-2h-2V7z" />
                        </svg>
                        {t("label.nouvelle_tentative")} ({attemptsLeft}{" "}
                        {t("label.tentatives_restantes")})
                      </button>
                    ) : (
                      <p className="text-red-500 text-sm">{t("label.plus_tentatives")}</p>
                    )}
                    <button
                      className="w-full py-3 px-5 bg-[#38A169] text-white rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 active:scale-95 hover:bg-[#2F855A] shadow-md"
                      onClick={submitTest}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("label.soumettre_test")}
                    </button>
                    {showScore() && getFeedback() && (
                      <p className="mt-4 text-lg font-semibold text-center">
                        {t("label.note_finale")} : {finalScore && finalScore<0?0:finalScore?.toFixed(2)} / {noteSur}
                      </p>
                    )}
                </div>  

              </div>
            </div>
          )}
        </>
      );
      
};

export default TestPage;
