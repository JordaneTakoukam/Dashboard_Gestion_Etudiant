import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface commune pour la structure des objets
interface CommonObject {
    date_creation: string;
    code: string;
    libelle: string;
    _id: string;
}

interface Parametre {
    _id: string;
    services: CommonObject[];
    fonctions: CommonObject[];
    grades: CommonObject[];
    categories: CommonObject[];
    region: CommonObject[];
    departement: CommonObject[];
    communes: CommonObject[];
    sections: CommonObject[];
    cycles: CommonObject[];
    niveaux: CommonObject[];
    __v: number;
}

interface ParametreState {
    parametres: Parametre[];
    loading: boolean;
    error: string | null;
}

const initialState: ParametreState = {
    parametres: [],
    loading: false,
    error: null,
};

const parametreSlice = createSlice({
    name: "parametreSlice",
    initialState,
    reducers: {
        saveParametre(state, action: PayloadAction<Parametre>) {
            const existingParametreIndex = state.parametres.findIndex(parametre => parametre._id === action.payload._id);
            if (existingParametreIndex !== -1) {
                state.parametres[existingParametreIndex] = action.payload;
            } else {
                state.parametres.push(action.payload);
            }
        },
        createElement(state, action: PayloadAction<{ parametreId: string, elementType: string, element: CommonObject }>) {
            const { parametreId, elementType, element } = action.payload;
            const parametre = state.parametres.find(parametre => parametre._id === parametreId);
            if (parametre) {
                parametre[elementType].push(element);
            }
        },
        updateElement(state, action: PayloadAction<{ parametreId: string, elementType: string, elementId: string, updatedElement: CommonObject }>) {
            const { parametreId, elementType, elementId, updatedElement } = action.payload;
            const parametre = state.parametres.find(parametre => parametre._id === parametreId);
            if (parametre) {
                const elements = parametre[elementType];
                const elementIndex = elements.findIndex(element => element._id === elementId);
                if (elementIndex !== -1) {
                    elements[elementIndex] = updatedElement;
                }
            }
        },
        deleteElement(state, action: PayloadAction<{ parametreId: string, elementType: string, elementId: string }>) {
            const { parametreId, elementType, elementId } = action.payload;
            const parametre = state.parametres.find(parametre => parametre._id === parametreId);
            if (parametre) {
                parametre[elementType] = parametre[elementType].filter(element => element._id !== elementId);
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const {
    saveParametre,
    createElement,
    updateElement,
    deleteElement,
    setLoading,
    setError,
} = parametreSlice.actions;

export default parametreSlice.reducer;
