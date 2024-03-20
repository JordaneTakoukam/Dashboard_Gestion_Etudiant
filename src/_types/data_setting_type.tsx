// Interface des propriétés communes
export interface CommonSettingProps {
    date_creation?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    _id?: string;
}

// Interface des propriétés spécifiques au département
export interface DepartementProps extends CommonSettingProps {
    region: string;
}

// Interface des propriétés spécifiques à la commune
export interface CommuneProps extends CommonSettingProps {
    departement: string;
}

// Interface des propriétés spécifiques au niveau
export interface NiveauProps extends CommonSettingProps {
    cycle: string;
}

// Interface des propriétés spécifiques au cycle
export interface CycleProps extends CommonSettingProps {
    section: string;
}



// Interface des propriétés de Setting
export interface DataSettingProps {
    services: CommonSettingProps[];
    fonctions: CommonSettingProps[];
    grades: CommonSettingProps[];
    categories: CommonSettingProps[];
    region: CommonSettingProps[];
    departement: DepartementProps[];
    communes: CommuneProps[];
    sections: CommonSettingProps[];
    cycles: CycleProps[];
    niveaux: NiveauProps[];
    __v: number;
}

// Interface de l'état du Slice
export interface DataSettingSlice {
    dataSetting: DataSettingProps;
    loading: boolean;
    error: string | null;
}