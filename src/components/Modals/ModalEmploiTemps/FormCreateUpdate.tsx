import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalCreate, setShowModalUpdate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { SetStateAction, useEffect, useState } from 'react';
import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';
import { Section, sections } from '../../../pages/Admin/Sections';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Jour, PeriodeCours, jours, listPeriode, semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { Matiere, TypeEnseignement, matieres } from '../../../pages/Admin/ListeMatieres';
import { SalleCours, sallesCours } from '../../../pages/Admin/SallesDeCours';
import { FaTrash } from 'react-icons/fa6';


function ModalCreateUpdate({ periodecours }: { periodecours : PeriodeCours | null }) {

    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heuredebut, setHeureDebut] = useState("");
    const [heurefin, setHeureFin] = useState("");
    const [section, setSection] = useState<Section>();
    const [cycle, setCycle] = useState<Cycle>();
    const [niveau, setNiveau] = useState<Niveau>();
    const [matiere, setMatiere] = useState<Matiere>();
    const [semestre, setSemestre] = useState(0);
    const [salleCours, setSalleCours] = useState<SalleCours>();
    const [typeEnseignement, setTypeEnseignement] = useState<TypeEnseignement>();

    const [errorJour, setErrorJour] = useState("");
    const [errorHeureDebut, setErrorHeureDebut] = useState("");
    const [errorHeureFin, setErrorHeureFin] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorMatiere, setErrorMatiere] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
    const [errorSalle, setErrorSalle] = useState("");
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (periodecours) {
            setModalTitle("Mettre à jour la période de cours");
            setJour(periodecours.jour);
            setHeureDebut(periodecours.heureDebut);
            setHeureFin(periodecours.heureFin);
            setSection(periodecours.matiere.niveau.cycle.section);
            setCycle(periodecours.matiere.niveau.cycle);
            setNiveau(periodecours.matiere.niveau);
            setMatiere(periodecours.matiere);
            setSalleCours(periodecours.salle);
            setTypeEnseignement(periodecours.typeUE);
            setSemestre(periodecours.semestre);
        } else {
            setModalTitle("Enregistrer une nouvel période");
            setJour(undefined);
            setHeureDebut("");
            setHeureFin("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
            setMatiere(undefined);
            setSalleCours(undefined);
            setTypeEnseignement(undefined);
            setSemestre(0);
        }


        if (isFirstRender) {
            setErrorJour("");
            setHeureDebut("");
            setErrorHeureFin("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setErrorMatiere("");
            setErrorSemestre("");
            setErrorSalle("");
            setErrorTypeEnseignement("");
            setIsFirstRender(false);
        }
    }, [periodecours, isFirstRender]);

    const closeModal = () => { 
        setErrorJour("");
        setHeureDebut("");
        setErrorHeureFin("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorMatiere("");
        setErrorSemestre("");
        setErrorSalle("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };

    const handleJourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedJourLibelle = e.target.value;
        const selectedJour = jours.find(jour => jour.libelle === selectedJourLibelle);
        if (selectedJour) {
            setJour(selectedJour);
            setErrorJour("");
        }
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
        if (selectedSection) {
            setSection(selectedSection);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        const selectedCycle = cycles.find(cycle => cycle.libelle === selectedCycleLibelle);
        if (selectedCycle) {
            setCycle(selectedCycle);
            setErrorCycle("");
        }
    };
    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        const selectedNiveau = niveaux.find(niveau => niveau.libelle === selectedNiveauLibelle);
        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };
    const handleSalleCoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSalleCoursLibelle = e.target.value;
        const selectedSalleCours = sallesCours.find(sallecours => sallecours.nom === selectedSalleCoursLibelle);
        if (selectedSalleCours) {
            setSalleCours(selectedSalleCours);
            setErrorSalle("");
        }
    };
    const handleMatiereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMatiereLibelle = e.target.value;
        const selectedMatiere = matieres.find(matiere => matiere.libelle === selectedMatiereLibelle);
        if (selectedMatiere) {
            setMatiere(selectedMatiere);
            setErrorMatiere("");
        }
    };

    const handleTypeEnseignementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTypeEnseignementLibelle = e.target.value;
        const selectedTypeEnseignement = matiere?.chapitres && matiere?.chapitres[0].typesEnseignement.find(typeenseignement => typeenseignement.libelle === selectedTypeEnseignementLibelle);
        if (selectedTypeEnseignement) {
            setTypeEnseignement(selectedTypeEnseignement);
            setErrorTypeEnseignement("");
        }
    };
    
    

    const handleCreatePeriodeCours = () => {
        if (!jour || !heuredebut || !heurefin || !section || !cycle || !niveau || !matiere || !semestre 
            || !typeEnseignement || !salleCours) {
            if (!jour) {
                setErrorJour("Le champ Jour est obligatoire.");
            }
            if (!heuredebut) {
                setErrorHeureDebut("Le champ heure de début est obligatoire.");
            }
            if (!heurefin) {
                setErrorHeureFin("Le champ heure de fin est obligatoire.");
            }
                
            if (!section) {
                setErrorSection("Le champ section est obligatoire.");
            }
            if (!cycle) {
                setErrorCycle("Le champ cycle est obligatoire.");
            }
            if (!niveau) {
                setErrorNiveau("Le champ niveau est obligatoire.");
            }

            if (!matiere) {
                setErrorMatiere("Le champ matiere est obligatoire.");
            }

            if (!semestre) {
                setErrorSemestre("Le champ semestre est obligatoire.");
            }

            if (!typeEnseignement) {
                setErrorTypeEnseignement("Le champ type d'enseignement est obligatoire.");
            }

            if (!salleCours) {
                setErrorSalle("Le champ salle de cours est obligatoire.");
            }

            return;
        }
        
        if (periodecours) {
            console.log("student update");
        }else{
            console.log("taille liste before "+listPeriode.length);
            let periode:PeriodeCours={
                id:listPeriode.length+1,
                jour: jour,
                heureDebut: heuredebut,
                heureFin: heurefin,
                salle: salleCours,
                matiere: matiere,
                typeUE: typeEnseignement,
                semestre: semestre,
                annee: 2024
            }
            console.log("taille liste after "+listPeriode.length);console.log("student add");
        }
        closeModal();
    }
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleDelete = () => {
        setIsDeleting(!isDeleting);
    };

    const handleDelete = () => {
        // onDelete(); // Appeler la fonction de suppression de la période
        setIsDeleting(false); // Réinitialiser le toggle à false après la suppression
    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreatePeriodeCours}
            >   
                <div style={{textAlign:'right'}}>
                <button onClick={handleToggleDelete} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                {isDeleting ? (
                    <span>Confirmer la suppression</span>
                ) : (
                    <FaTrash style={{ color: 'red', fontSize: '20px' }} />
                )}
                {isDeleting && (
                    <button onClick={handleDelete} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        Oui
                    </button>
                )}
        </button>
                </div>
                
                <label>Semestre</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un semestre</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}
                    
                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                <label>Jour</label><label className="text-red-500"> *</label>
                <select
                    value={jour ? jour.libelle : 'Sélectionnez un cycle'}
                    onChange={handleJourChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un jour de la semaine</option>
                    {jours.map(jour => (
                        <option key={jour.ordre} value={jour.libelle}>{jour.libelle}</option>
                    ))}
                </select>
                {errorJour && <p className="text-red-500" >{errorJour}</p>}
                <label>Heure de début</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heuredebut}
                    onChange={(e) => {setHeureDebut(e.target.value); setErrorHeureDebut("")}}
                />
                {errorHeureDebut && <p className="text-red-500" >{errorHeureDebut}</p>}
                <label>Heure de fin</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heurefin}
                    onChange={(e) => {setHeureFin(e.target.value); setErrorHeureFin("")}}
                />
                {errorHeureFin && <p className="text-red-500" >{errorHeureFin}</p>}
                <label>Section</label><label className="text-red-500"> *</label>
                <select
                    value={section ? section.libelle : 'Sélectionnez une section'}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une section</option>
                    {sections.map(section => (
                        <option key={section.id} value={section.libelle}>{section.libelle}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>Cycle</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? cycle.libelle : 'Sélectionnez un cycle'}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un cycle</option>
                    {cycles.map(cycle => (
                        <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>Niveau</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? niveau.libelle : 'Sélectionnez un niveau'}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un niveau</option>
                    {niveaux.map(niveau => (
                        <option key={niveau.id} value={niveau.libelle}>{niveau.libelle}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
                <label>Matière</label><label className="text-red-500"> *</label>
                <select
                    value={matiere ? matiere.libelle : 'Sélectionnez un matiere'}
                    onChange={handleMatiereChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une matière</option>
                    {matieres.map(matiere => (
                        <option key={matiere.id} value={matiere.libelle}>{matiere.libelle}</option>
                    ))}
                </select>
                {errorMatiere && <p className="text-red-500">{errorMatiere}</p>}
                <label>Salle de cours</label><label className="text-red-500"> *</label>
                <select
                    value={salleCours ? salleCours.nom : 'Sélectionnez une sallecours'}
                    onChange={handleSalleCoursChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez une salle de cours</option>
                    {sallesCours.map(salleCours => (
                        <option key={salleCours.id} value={salleCours.nom}>{salleCours.nom}</option>
                    ))}
                </select>
                {errorSalle && <p className="text-red-500">{errorSalle}</p>}
                <label>Type d'enseignement</label><label className="text-red-500"> *</label>
                <select
                    value={typeEnseignement ? typeEnseignement.libelle : 'Sélectionnez un typeenseignement'}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un type d'enseignement</option>
                    {matiere?.chapitres && matiere.chapitres[0].typesEnseignement.map(typeEnseignement => (
                        <option key={typeEnseignement.id} value={typeEnseignement.libelle}>{typeEnseignement.libelle}</option>
                    ))}
                </select>
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
