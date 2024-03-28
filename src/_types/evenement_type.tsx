// Définir le type de données pour un événement
interface EvenementProps {
    _id:string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    dateDebut: string;
    dateFin: string;
    periodeFr: string;
    periodeEn: string;
    etat: CommonSettingProps;
    personnelFr: string;
    personnelEn: string;
    descriptionObservationFr: string,
    descriptionObservationEn: string,
    annee: string;
};

export default EvenementProps;
