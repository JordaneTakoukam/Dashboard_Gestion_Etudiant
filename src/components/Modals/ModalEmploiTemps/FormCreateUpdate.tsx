import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import {useEffect, useState } from 'react';
import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';
import { Section, sections } from '../../../pages/Admin/Sections';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Jour, PeriodeCours, jours, listPeriode, semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { Matiere, matieres } from '../../../pages/Admin/ListeMatieres';
import { SalleCours, sallesCours } from '../../../pages/Admin/SallesDeCours';
import { FaTrash } from 'react-icons/fa6';
import { TypeEnseignement } from '../../../pages/Admin/Chapitres';
import { useTranslation } from 'react-i18next';



function ModalCreateUpdate({ periodecours }: { periodecours : PeriodeCours | null }) {
    const {t}=useTranslation();
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
            setModalTitle(t('form_update.enregistrer')+t('form_update.periode'));
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
            setModalTitle(t('form_save.enregistrer')+t('form_save.periode'));
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
    }, [periodecours, isFirstRender, t]);

    const closeModal = () => { 
        setErrorJour("");
        setErrorHeureDebut("");
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

    // Vérifie si une période chevauche une autre période dans l'emploi du temps
    const verifierChevauchementPeriode = (periode: PeriodeCours): boolean => {
        for (const autrePeriode of listPeriode) {
            // Convertir les heures de début et de fin en minutes pour faciliter la comparaison
            const heureDebutPeriode = convertirHeureVersMinutes(periode.heureDebut);
            const heureFinPeriode = convertirHeureVersMinutes(periode.heureFin);
            const heureDebutAutrePeriode = convertirHeureVersMinutes(autrePeriode.heureDebut);
            const heureFinAutrePeriode = convertirHeureVersMinutes(autrePeriode.heureFin);

            // Vérifier si les périodes se chevauchent
            if (
                (heureDebutPeriode >= heureDebutAutrePeriode && heureDebutPeriode < heureFinAutrePeriode) ||
                (heureFinPeriode > heureDebutAutrePeriode && heureFinPeriode <= heureFinAutrePeriode) ||
                (heureDebutPeriode <= heureDebutAutrePeriode && heureFinPeriode >= heureFinAutrePeriode)
            ) {
                return true; // Il y a un chevauchement
            }
        }
        return false; // Aucun chevauchement trouvé
    };

    //verifier si l'heure de fin vient avant l'heure de début
    const verifierHeureFinApresDebut = (heureDebut: string, heureFin: string): boolean => {
        const debutMinutes = convertirHeureVersMinutes(heureDebut);
        const finMinutes = convertirHeureVersMinutes(heureFin);
    
        return finMinutes < debutMinutes;
    };

    // Fonction utilitaire pour convertir l'heure au format HH:MM en minutes
    const convertirHeureVersMinutes = (heure: string): number => {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    };
    
    

    const handleCreatePeriodeCours = () => {
        if (!jour || !heuredebut || !heurefin || !section || !cycle || !niveau || !matiere || !semestre 
            || !typeEnseignement || !salleCours) {
            if (!jour) {
                setErrorJour(t('error.jour'));
            }
            if (!heuredebut) {
                setErrorHeureDebut(t('error.heure_debut'));
            }
            if (!heurefin) {
                setErrorHeureFin(t('error.heure_fin'));
            }
                
            if (!section) {
                setErrorSection(t('error.section'));
            }
            if (!cycle) {
                setErrorCycle(t('error.cycle'));
            }
            if (!niveau) {
                setErrorNiveau(t('error.niveau'));
            }

            if (!matiere) {
                setErrorMatiere(t('error.matiere'));
            }

            if (!semestre) {
                setErrorSemestre(t('error.semestre'));
            }

            if (!typeEnseignement) {
                setErrorTypeEnseignement(t('error.type_ens_periode'));
            }

            if (!salleCours) {
                setErrorSalle(t('error.salle'));
            }

            return;
        }

        if(verifierHeureFinApresDebut(heuredebut, heurefin)){
            setErrorHeureFin(t('error.debut_sup_fin_periode'));
            return;
        }
        
        if (periodecours) {
            console.log("student update");
        }else{
            
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
            if(verifierChevauchementPeriode(periode)){
                console.log("Des périodes se chevauchent");
                return;
            }
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
                            <span>{t('label.confirm_sup')}</span>
                        ) : (
                            <FaTrash style={{ color: 'red', fontSize: '20px' }} />
                        )}
                        {isDeleting && (
                            <button onClick={handleDelete} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                                {t('boutton.non')}
                            </button>
                        )}
                        {isDeleting && (
                            <button onClick={handleDelete} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                                {t('boutton.oui')}
                            </button>
                        )}
                </button>
                </div>
                
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.semestre')}</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}
                    
                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                <label>{t('label.jour')}</label><label className="text-red-500"> *</label>
                <select
                    value={jour ? jour.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.jour')}
                    onChange={handleJourChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.jour')}</option>
                    {jours.map(jour => (
                        <option key={jour.ordre} value={jour.libelle}>{jour.libelle}</option>
                    ))}
                </select>
                {errorJour && <p className="text-red-500" >{errorJour}</p>}
                <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heuredebut}
                    onChange={(e) => {setHeureDebut(e.target.value); setErrorHeureDebut("")}}
                />
                {errorHeureDebut && <p className="text-red-500" >{errorHeureDebut}</p>}
                <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heurefin}
                    onChange={(e) => {setHeureFin(e.target.value); setErrorHeureFin("")}}
                />
                {errorHeureFin && <p className="text-red-500" >{errorHeureFin}</p>}
                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? section.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.section')}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section.id} value={section.libelle}>{section.libelle}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? cycle.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}</option>
                    {cycles.map(cycle => (
                        <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? niveau.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.niveau')}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.niveau')}</option>
                    {niveaux.map(niveau => (
                        <option key={niveau.id} value={niveau.libelle}>{niveau.libelle}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
                <label>{t('label.matiere')}</label><label className="text-red-500"> *</label>
                <select
                    value={matiere ? matiere.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.matiere')}
                    onChange={handleMatiereChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.matiere')}</option>
                    {matieres.map(matiere => (
                        <option key={matiere.id} value={matiere.libelle}>{matiere.libelle}</option>
                    ))}
                </select>
                {errorMatiere && <p className="text-red-500">{errorMatiere}</p>}
                <label>{t('label.salle_cour')}</label><label className="text-red-500"> *</label>
                <select
                    value={salleCours ? salleCours.nom : t('select_par_defaut.selectionnez')+t('select_par_defaut.salle')}
                    onChange={handleSalleCoursChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.salle')}</option>
                    {sallesCours.map(salleCours => (
                        <option key={salleCours.id} value={salleCours.nom}>{salleCours.nom}</option>
                    ))}
                </select>
                {errorSalle && <p className="text-red-500">{errorSalle}</p>}
                <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
                <select
                    value={typeEnseignement ? typeEnseignement.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.type_ens')}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.type_ens')}</option>
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
