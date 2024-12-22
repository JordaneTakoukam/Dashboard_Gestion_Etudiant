import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteQuestion } from '../../../api/api_question';
import createToast from '../../../hooks/toastify';
import { deleteQuestion } from '../../../_redux/features/question_slice';
import { retirerQuestion } from '../../../_redux/features/devoir_slice';



function ModalDelete({ question, devoir }: { question : QuestionType|null, devoir:DevoirType | null|undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();

    const handleDelete = async () => {
        if(question && question._id){
            await apiDeleteQuestion(question._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    if(question._id){
                        dispatch(deleteQuestion({ id: question._id }));
                        // dispatch(retirerQuestion({questionId:question._id}))
                    }
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

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.question')} : {question? lang === 'fr' ? question.textFr: question.textEn:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



