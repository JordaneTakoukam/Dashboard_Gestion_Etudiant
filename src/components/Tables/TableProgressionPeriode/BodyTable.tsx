import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalChapitre, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import React from "react"
import { useTranslation } from "react-i18next"
import { getPeriodesByNiveau } from "../../../api/api_periode"
import { jours } from "../../../pages/CommonPage/EmploiDeTemp"

interface BodyPeriodeEnseignementProps {
    data: PeriodeEnseignementType | undefined;
}

const BodyTable = ({ data}: BodyPeriodeEnseignementProps) => {
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [periodes, setPeriodes] = useState<PeriodeType[] | null>(null);
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [nbSeanceCalcule, setNbSeanceCalcul]=useState<Map<MatiereEnseignement, number>>();
    // Récupérer le premier niveau du premier cycle
    
    useEffect(() => {
        const fetchPeriodes = async () => {
            try {

                if (data && data.niveau) {
                    const fetchedPeriodes = await getPeriodesByNiveau({ niveauId: data.niveau, annee: currentYear, semestre: currentSemester });
                    setPeriodes(fetchedPeriodes.periodes);
                }
            } catch (error) {
                // createToast(t('message.erreur'), "", 2);
            } finally {
            }
        };

        fetchPeriodes();
    }, [data]);
    const calculateSeancesEffectuees = (enseignement: MatiereEnseignement) => {
        
        if (!enseignement.matiere || !enseignement.matiere.typesEnseignement) {
            return 0;
        }


        const absences = enseignement.matiere.typesEnseignement.reduce((acc: AbsenceType[], type: any) => {
            acc.push(...type.enseignantPrincipal.absences);
            return acc;
        }, []);
    
        let seancesEffectuees = enseignement.nombreSeance;
        let countAbsences = 0;
    
        if (absences.length > 0) {
            const absencesMap = new Map<string, boolean>(); // Map pour stocker les absences déjà traitées
    
            absences.forEach((absence) => {
                // Convertir la date d'absence en objet Date
                const dateAbsence = new Date(absence.dateAbsence);
    
                // Obtenez le jour de la semaine en utilisant les méthodes de l'objet Date
                const jourSemaine = joursSemaine[dateAbsence.getDay()];
                const ordre = jours.find((jour) => jour.libelleFr.toLowerCase() === jourSemaine.toLowerCase())?.ordre ?? -1;
    
                if (ordre !== -1 && periodes) {
                    
                    const key = `${ordre}-${absence.heureDebut}-${absence.heureFin}`; // Clé pour identifier l'absence
                    if (!absencesMap.has(key)) {
                        const periodesAvecJour = periodes.filter((periode) => 
                            periode.jour == ordre && 
                            periode.heureDebut === absence.heureDebut && 
                            periode.heureFin === absence.heureFin
                        );

                        if (periodesAvecJour.length > 0) {
                            const typeEns = enseignement.matiere.typesEnseignement && enseignement.matiere.typesEnseignement.find((ens) => ens.typeEnseignement === periodesAvecJour[0].typeEnseignement);
                            if (typeEns) {
                                countAbsences++;
                            }
                        }
                        absencesMap.set(key, true); // Marquer l'absence comme traitée
                    }
                }
            });
        }
    
        // Calculer le nombre de séances effectuées
        seancesEffectuees -= countAbsences;
        return seancesEffectuees;
    };
    

    return <tbody>
        {data?.enseignements && data?.enseignements.map((periode, index) => (
            <React.Fragment key={index}>
                <tr>
                    <th className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black text-center " colSpan={4}>
                        {lang === 'fr' ? periode.matiere.libelleFr : periode.matiere.libelleEn}
                    </th>
                </tr>
                <tr>
                    <td className="text-center">{t('label.nb_seance_periode')}</td>
                    <td className="text-center">{t('label.nb_seance_pratique')}</td>
                    <td className="text-center">{t('label.gap')}</td>
                    <td className="text-center">{t('label.taux_presence')}</td>
                </tr>
                <tr>
                    <td className="text-center">{periode.nombreSeance}</td>
                    <td className="text-center">{calculateSeancesEffectuees(periode)}</td>
                    <td className="text-center">{periode.nombreSeance-calculateSeancesEffectuees(periode)}</td>
                    <td className="text-center">{(calculateSeancesEffectuees(periode)/(periode.nombreSeance) * 100).toFixed(2)}%</td>
                </tr>
            </React.Fragment>
        ))}
    </tbody>
}

export default BodyTable