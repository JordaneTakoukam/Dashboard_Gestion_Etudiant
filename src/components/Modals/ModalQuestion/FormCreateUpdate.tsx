import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiCreateQuestion, apiUpdateQuestion } from '../../../api/api_question';
import createToast from '../../../hooks/toastify';
import { createQuestion, updateQuestion } from '../../../_redux/features/question_slice';




function ModalCreateUpdate({ question, devoir  }: { question: QuestionType | null, devoir : DevoirType |undefined|null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
   
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [type, setType] = useState("");
    const [textFr, setTextFr] = useState("");
    const [textEn, setTextEn] = useState("");
    const [nbPoint, setNbPoint]=useState(20);
    const [options, setOptions] = useState([{ textFr: "", textEn: "", pourcentage: 0 }, { textFr: "", textEn: "", pourcentage: 0 }]);
    
    const [errorType, setErrorType] = useState("");
    const [errorTextFr, setErrorTextFr] = useState("");
    const [errorTextEn, setErrorTextEn] = useState("");
    const [errorNbPoint, setErrorNbPoint] = useState("");
    const [errorOptions, setErrorOptions] = useState("");
    const [errors, setErrors] = useState<{ [key: number]: { textFr: string, textEn: string } }>({});
    const [isFirstSave, setIsFirstSave] = useState(true);


   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const types:string[]=[t('label.vrai_faux'), t('label.qcm')];

    
   
    useEffect(() => {
        
        if (question) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.question'));
            setType(question.type);
            setTextFr(question.textFr);
            setTextEn(question.textEn);
            setNbPoint(question.nbPoint);
            setOptions(question.options || []);
            
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.question'));
            setType("");
            setTextFr("");
            setTextEn("");
            setNbPoint(0);
            setOptions([{ textFr: "", textEn: "", pourcentage: 0 }, { textFr: "", textEn: "", pourcentage: 0 }]);
            
        }
        if (isFirstRender) {
            setErrorType("");
            setErrorTextFr("");
            setErrorTextEn("");
            setErrorNbPoint("");
            setErrorOptions("");
            setErrors([]);
            setIsFirstRender(false);
            setIsFirstSave(false);
            
        }
    }, [question,  isFirstRender, t]);

    const closeModal = () => {
        setErrorType("");
        setErrorTextFr("");
        setErrorTextEn("");
        setErrorNbPoint("");
        setErrors([]);
        setIsFirstRender(true);
        setIsFirstSave(true);
        dispatch(setShowModal());
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setType("VRAI_FAUX");
        if(selectedType === t('label.qcm')){
            setType("QCM");
        }
        setErrorType("");
    };


    const handleOptionChange = (index: number, key: "textFr" | "textEn" | "pourcentage", value: string | number) => {
        // Créez une copie du tableau d'options
        const newOptions = options.map((option, idx) => 
            idx === index ? { ...option, [key]: value } : option
        );
        
        setOptions(newOptions);
    
        if (key === 'textFr' || key === 'textEn') {
            const newErrors = { ...errors };
            if (newErrors[index]) {
                delete newErrors[index][key];
            }
            setErrors(newErrors);
        }
 
    
        if (key === 'pourcentage') {
            setErrorOptions("");
        }
    };
    
    

    const addOption = () => {
        setOptions([...options, { textFr: "", textEn: "", pourcentage: 0 }]);
    };

    const removeOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        setErrors({});
        const newErrors = { ...errors };
        options.map((option, index) => {
            if (!option.textFr || !option.textEn) {
                
                newErrors[index] = {
                    textFr:t('label.text_fr'),
                    textEn:t('label.text_en'),
                };
            }

        });
        console.log(newErrors);
        const totalPourcentagePositif = options
            .filter(opt => opt.pourcentage > 0)
            .reduce((sum, opt) => sum + opt.pourcentage, 0);
        const totalPourcentageNegatif = options
            .filter(opt => opt.pourcentage < 0)
            .reduce((sum, opt) => sum + opt.pourcentage, 0);
        if (!type || !textFr || !textEn || !nbPoint || newErrors || (!options.length || (options.length && options.length < 2)) || totalPourcentagePositif !== 100 || totalPourcentageNegatif < -100) {
            if (!type) {
                setErrorType(t('error.type'));
            }
            if (!textFr) {
                setErrorTextFr(t('error.text_fr'));
            }
            if (!textEn) {
                setErrorTextEn(t('error.text_en'));
            }
            if (!nbPoint) {
                setErrorNbPoint(t('error.nombre_point'));
            }
            if ((!options.length || (options.length && options.length < 2))) {
                setErrorOptions(t('error.options'));
            }

            if(newErrors){
                setErrors(newErrors);
            }

            if (totalPourcentagePositif !== 100) {
                setErrorOptions(t("error.somme_pourcentage_positif"));
            }
    
            if (totalPourcentageNegatif < -100) {
                setErrorOptions(t("error.somme_pourcentage_negatif"));
            }

            
            return;
        }

        
        
        
        if (!question) {
            if (devoir && devoir._id) {
                await apiCreateQuestion(
                    {
                        type, 
                        textFr,
                        textEn,
                        nbPoint,
                        options,
                        devoir, 
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        dispatch(createQuestion({
                            
                            question: {
                                _id: e.data._id,
                                type : e.data.type, 
                                textFr: e.data.textFr, 
                                textEn: e.data.textEn, 
                                nbPoint: e.data.nbPoint,
                                options:e.data.options,
                                devoir:e.data.devoir, 
                            }
                            
                        }));
                        // dispatch(ajouterQuestion({...e.data}))
                        createToast(e.message[lang as keyof typeof e.message], '', 0);    
                        closeModal();

                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }else{
            if (devoir && devoir._id) {
                await apiUpdateQuestion(
                    {
                        type, 
                        textFr, 
                        textEn, 
                        nbPoint,
                        options,
                        devoir, 
                        _id:question._id
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        dispatch(
                            updateQuestion({
                                id: e.data._id,
                                questionData: {
                                    _id: e.data._id,
                                    type : e.data.type, 
                                    textFr: e.data.textFr, 
                                    textEn: e.data.textEn, 
                                    nbPoint: e.data.nbPoint,
                                    options:e.data.options,
                                    devoir:e.data.devoir, 
                                }
                            }));
                        // dispatch(modifierQuestion({...e.data}))
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }
    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
            
                
                <label>{t('label.text_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={textFr}
                    onChange={(e) => { setTextFr(e.target.value); setErrorTextFr("") }}
                />
                {errorTextFr && <p className="text-red-500">{errorTextFr}</p>}
                <label>{t('label.text_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={textEn}
                    onChange={(e) => { setTextEn(e.target.value); setErrorTextEn("") }}
                />
                {errorTextEn && <p className="text-red-500">{errorTextEn}</p>}
                
                <label>{t('label.type')}</label><label className="text-red-500"> *</label>
                <select
                    value={type ? (type==='QCM' ? t('label.qcm') : t('label.vrai_faux')) : t('select_par_defaut.selectionnez') + t('select_par_defaut.type')}
                    onChange={handleTypeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type')}</option>
                    {types.map(tp => (
                        <option key={types.indexOf(tp)} value={tp}>{tp}</option>
                    ))}
                </select>
                {errorType && <p className="text-red-500">{errorType}</p>}
                <label>{t('label.nombre_point')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={nbPoint}
                    onChange={(e) => { setNbPoint(parseFloat(e.target.value)); setErrorNbPoint("") }}
                />
                {errorNbPoint && <p className="text-red-500">{errorNbPoint}</p>}
               
                <label>{t('label.options')} </label><label className="text-red-500"> *</label>
                {options.map((option, index) => (
                    <div key={index} className="mt-4 border-b border-stroke pb-4">
                        <div className="text-lg font-semibold">
                            {t('label.option')} {index + 1}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex flex-col w-full">
                                {/* Champ texte en français */}
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-2 px-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                    placeholder={t('label.text_fr')}
                                    value={option.textFr}
                                    onChange={(e) => handleOptionChange(index, "textFr", e.target.value)}
                                />
                                {errors[index] && errors[index].textFr && (
                                    <p className="text-red-500">{errors[index].textFr}</p>
                                )}
                                {/* Champ texte en anglais */}
                                <input
                                    className="w-full mt-2 rounded border border-stroke bg-gray py-2 px-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                    placeholder={t('label.text_en')}
                                    value={option.textEn}
                                    onChange={(e) => handleOptionChange(index, "textEn", e.target.value)}
                                />
                                {errors[index] && errors[index].textEn && (
                                    <p className="text-red-500">{errors[index].textEn}</p>
                                )}
                            </div>
                            {/* Liste déroulante pour le pourcentage */}
                            <select
                                className="w-24 rounded border border-stroke bg-gray py-2 px-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                value={option.pourcentage}
                                onChange={(e) => handleOptionChange(index, "pourcentage", parseInt(e.target.value, 10))}
                            >
                                {[...Array(41)].map((_, i) => {
                                    const value = -100 + i * 5;
                                    return (
                                        <option key={value} value={value}>
                                            {value}%
                                        </option>
                                    );
                                })}
                            </select>
                            {/* Bouton de suppression */}
                            {index >= 2 && (
                                <button
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 text-lg"
                                >
                                    x
                                </button>
                            )}
                        </div>
                    </div>
                ))}


                {errorOptions && <p className="text-red-500">{errorOptions}</p>}
                <button
                    onClick={addOption}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded"
                >
                    {t('boutton.ajouter_option')}
                </button>
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
