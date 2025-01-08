import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../../components/StatCard";
import { RootState } from "../../_redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDevoirStats } from "../../api/api_devoir";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import createToast from "../../hooks/toastify";
import { setDevoirLoading, setDevoirStats } from "../../_redux/features/devoir_stats_slice";
import Table from "../../components/Tables/TableDevoirStats/Table";

const DevoirStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedDevoir = useSelector((state: RootState) => state.devoirSlice.selectedDevoir);
    const {data:{meilleureNote}} = useSelector((state: RootState) => state.devoirStatsSlice);
    const {data:{pireNote}} = useSelector((state: RootState) => state.devoirStatsSlice);
    const {data:{noteMoyenne}} = useSelector((state: RootState) => state.devoirStatsSlice);
    const {data:{nombreParticipants}} = useSelector((state: RootState) => state.devoirStatsSlice);
    const { data: { etudiants } } = useSelector((state: RootState) => state.devoirStatsSlice);
    const { data: { devoir } } = useSelector((state: RootState) => state.devoirStatsSlice);

    const navigate = useNavigate();
    useEffect(() => {
        if (selectedDevoir === undefined) {
            navigate('/pedagogies/exercise-book')
        }
    }, [selectedDevoir])

    const {t}=useTranslation();
    const dispatch = useDispatch();

   useEffect(() => {
    
        const fetchDevoirStats = async () => {
            dispatch(setDevoirLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyStats:DevoirStatsReturnGetType = {
                    devoir: {
                        _id: "",
                        titreFr: "",
                        titreEn: "",
                        noteSur: 0
                    },
                    nombreParticipants: 0,
                    meilleureNote: 0,
                    pireNote: 0,
                    noteMoyenne: 0,
                    etudiants: []
                }
                if(selectedDevoir && selectedDevoir._id){
                    const fetchedStats = await getDevoirStats({ devoirId: selectedDevoir._id});
                        
                    if (fetchedStats) { // Vérifiez si fetchedQuestions n'est pas faux, vide ou indéfini
                        dispatch(setDevoirStats(fetchedStats));
                    } else {
                        dispatch(setDevoirStats(emptyStats));
                    }
                }else {
                    dispatch(setDevoirStats(emptyStats));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setDevoirLoading(false));; // Définissez le loading à false après le chargement
            }
        }
        fetchDevoirStats();
    }, [dispatch, t]);

  
  return (
    <>
        <Breadcrumb pageName={t('sub_menu.statistiques')} isQuestion={true} />
        <div className="container mx-auto px-4 py-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
            {t('label.stats_devoir')} : {lang==='fr'?devoir.titreFr:devoir.titreEn}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label={t('label.nombre_participant')} value={nombreParticipants} />
            <StatCard label={t('label.meilleur_note')} value={meilleureNote || 0} />
            <StatCard label={t('label.pire_note')} value={pireNote || 0} />
            <StatCard label={t('label.note_moyenne')} value={noteMoyenne ? parseInt(noteMoyenne.toFixed(2)) : 0} />
        </div>

        <div>
            <h2 className="text-xl font-semibold mb-4">{t('label.liste_etudiants')}</h2>
            <Table data={etudiants} noteSur={devoir.noteSur} />
        </div>
        </div>
    </>
  );
};

export default DevoirStatsPage;
