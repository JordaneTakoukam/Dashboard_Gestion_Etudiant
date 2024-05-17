
// Interface des propriétés communes
interface CommonSettingProps {
    date_creation?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    _id?: string;
}

// Interface des propriétés spécifiques au département
interface DepartementProps extends CommonSettingProps {
    region: string;
}

// Interface des propriétés spécifiques à la commune
interface CommuneProps extends CommonSettingProps {
    departement: string;
}



// Interface des propriétés spécifiques au niveau
interface NiveauProps extends CommonSettingProps {
    cycle: string;
}

// Interface des propriétés spécifiques au cycle
interface CycleProps extends CommonSettingProps {
    section: string;
}

// Interface des propriétés spécifiques au section
interface SectionProps extends CommonSettingProps {
    departement: string;
}

// Interface des propriétés spécifiques au catégorie
interface CategorieProps extends CommonSettingProps {
    grade: string;
}

//interface des propriétés de la salle de cours
interface SalleDeCoursProps extends CommonSettingProps {
    nbPlace: number;
}



// Interface des propriétés de Setting
interface DataSettingProps {
    services: CommonSettingProps[];
    fonctions: CommonSettingProps[];
    grades: CommonSettingProps[];
    categories: CategorieProps[];
    regions: CommonSettingProps[];
    departements: DepartementProps[];
    departementsAcademique:CommonSettingProps[];
    communes: CommuneProps[];
    sections: SectionProps[];
    cycles: CycleProps[];
    niveaux: NiveauProps[];
    salleDeCours: SalleDeCoursProps[];
    typesEnseignement: CommonSettingProps[];
    etatsEvenement: CommonSettingProps[];
    anneeCourante: number;
    premiereAnnee: number;
    semestreCourant:number;
    // roles:CommonSettingProps[];
    __v: number;
}

// Interface de l'état du Slice
interface DataSettingSlice {
    dataSetting: DataSettingProps;
    loading: boolean;
    error: string | null;
}