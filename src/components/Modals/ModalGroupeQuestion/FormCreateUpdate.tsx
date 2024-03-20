import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { GroupeQuestion, Reponse, typesAffichage } from '../../../pages/Admin/GroupeQuestions';
import { Rubrique, rubriques } from '../../../pages/Admin/Rubriques';


function ModalCreateUpdate({ groupeQuestion }: { groupeQuestion : GroupeQuestion | null }) {

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [ordre, setOrdre] = useState(0);
    const [displayName, setDisplayName] = useState(false);
    const [sujetDeQuestion, setSujetDeQuestion] = useState("");
    const [displaySubject, setDisplaySubject] = useState(Boolean);
    const [displayType, setDisplayType] = useState("");
    const [rubrique, setRubrique] = useState<Rubrique>();
    const [reponses, setReponses] = useState<Reponse[]>([]); // État local pour les compétences
    
    const [errorOrdre, setErrorOrdre] = useState("");
    const [errorDisplayName, setErrorDisplayName] = useState("");
    const [errorDisplayType, setErrorDisplayType] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorRubrique, setErrorRubrique] = useState("");
    const [errorReponse, setErrorReponse] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const reponse:Reponse={
        id:1,
        libelle:"",
        ordre:1,
    }
    useEffect(() => {
        if (groupeQuestion) {
            setModalTitle("Mettre à jour les informations du groupe de questions");
            setCode(groupeQuestion.code);
            setLibelle(groupeQuestion.libelle);
            setRubrique(groupeQuestion.rubrique);
            setOrdre(groupeQuestion.ordre);
            setDisplayName(groupeQuestion.displayName);
            setSujetDeQuestion(groupeQuestion.sujetDeQuestion?groupeQuestion.sujetDeQuestion:"");
            setDisplaySubject(groupeQuestion.displaySubject?groupeQuestion.displaySubject:false);
            setDisplayType(groupeQuestion.displayType);
            setReponses(groupeQuestion.reponses || [reponse, reponse]);
            
        } else {
            setModalTitle("Enregistrer un nouveau groupe de questions");
            setCode("");
            setLibelle("");
            setRubrique(undefined);
            setOrdre(0);
            setDisplayName(Boolean);
            setSujetDeQuestion("");
            setDisplaySubject(Boolean);
            setDisplayType("");
            setReponses([reponse, reponse]);
        }


        if (isFirstRender) {
            setErrorOrdre("");
            setErrorLibelle("");
            setErrorRubrique("");
            setErrorDisplayName("");
            setErrorDisplayType("");
            setErrorReponse("");
            setIsFirstRender(false);
        }
    }, [groupeQuestion, isFirstRender]);

    const closeModal = () => { 
        setErrorOrdre("");
        setErrorLibelle("");
        setErrorRubrique("");
        setErrorDisplayName("");
        setErrorDisplayType("");
        setErrorReponse("");
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

    const handleAddReponse = () => {
        setReponses(prevReponses => [...prevReponses, reponse]);
    };

    const handleRemoveReponse = (index: number) => {
        setReponses(prevReponses => prevReponses.filter((_, i) => i !== index));
    };

    const handleReponseChange = (index: number, reponse: Reponse) => {
        setReponses(prevReponses => {
            const updatedReponses = [...prevReponses];
            updatedReponses[index] = reponse;
            return updatedReponses;
        });
    };
    
    
    

    const handleCreateUpdate = () => {
        if (!ordre || !libelle || !rubrique || !displayName || !displayType || !reponses[0].libelle || !reponses[1].libelle) {
            if (!ordre) {
                setErrorOrdre("Le champ numéro du groupe est obligatoire.");
            }
            if (!libelle) {
                setErrorLibelle("Le champ libellé est obligatoire.");
            }
            if (!rubrique) {
                setErrorRubrique("Le champ rubrique est obligatoire.");
            }

            if(!displayName){
                setErrorDisplayName("La sélection de l'affichage du nom du groupe est obligation.")
            }

            if(!displayType){
                setErrorDisplayType("Le champ type d'affichage du goupe est obligatoire.")
            }
            if(!reponses[0].libelle || !reponses[1].libelle){
                setErrorReponse("Il faut au moins 2 modèles de réponses.");
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
                
                <label>Code</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value);}}
                />
                <label>Numéro du groupe de question dans la rubrique</label><label className="text-red-500"> *</label>
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
                
                <label>Afficher le libellé du groupe dans le sondage</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id="oui"
                        name="displayName"
                        value="Oui"
                        checked={displayName}
                        onChange={() =>{ setDisplayName(true); setErrorDisplayName("")}}
                    />
                    <label htmlFor="oui" className='radio-intern-space'>Oui</label>
                    
                    <input
                        className='radio-label-space'
                        type="radio"
                        id="non"
                        name="displayName"
                        value="Non"
                        checked={!displayName}
                        onChange={() =>{ setDisplayName(false); setErrorDisplayName("")}}
                    />
                    <label htmlFor="oui" className='radio-intern-space'>Non</label>
                </div>
                {errorDisplayName && <p className="text-red-500">{errorDisplayName}</p>}
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
                <label>Sujet des questions du groupe</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={sujetDeQuestion}
                    onChange={(e) => {setSujetDeQuestion(e.target.value);}}
                />
                <label>Afficher le sujet des questions du groupe dans le sondage</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id="oui"
                        name="displaySubject"
                        value="Oui"
                        checked={displaySubject}
                        onChange={() =>{ setDisplaySubject(true);}}
                    />
                    <label htmlFor="oui" className='radio-intern-space'>Oui</label>
                    
                    <input
                        className='radio-label-space'
                        type="radio"
                        id="non"
                        name="displaySubject"
                        value="Non"
                        checked={!displaySubject}
                        onChange={() =>{ setDisplaySubject(false)}}
                    />
                    <label htmlFor="oui" className='radio-intern-space'>Non</label>
                </div>
                <label>Afficher le groupe de question sous forme de </label><label className="text-red-500"> *</label>
                <select
                    value={'Sélectionnez le type d\'affichage'}
                    onChange={(e) => {setDisplayType(e.target.value); setErrorDisplayType("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez le type d'affichage</option>
                    {typesAffichage.map((typeAffichage, index) => (
                        <option key={index} value={typeAffichage}>{typeAffichage}</option>
                    ))}
                </select>
                {errorDisplayType && <p className="text-red-500">{errorDisplayType}</p>}
                <div>
                    <h3>Modèle de réponses : <label className="text-red-500"> *</label></h3>
                    {reponses.map((reponse, index) => (
                        <div key={index} className="flex items-center flex-item">
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                placeholder={`Réponse ${index + 1}`}
                                value={reponse.libelle}
                                onChange={(e) => {handleReponseChange(index, {...reponse, libelle : e.target.value}); setErrorReponse("")}}
                            />
                            
                            {index !== 0 && index !== 1 && (
                                <button type="button" onClick={() => handleRemoveReponse(index)}>
                                    Supprimer
                                </button>
                            )}
                        </div>
                    ))}
                    {errorReponse && <p className="text-red-500">{errorReponse}</p>}
                    <button type="button" onClick={handleAddReponse}>
                        Ajouter une réponse
                    </button>
                </div>
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
