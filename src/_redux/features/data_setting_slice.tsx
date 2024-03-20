import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommonSettingProps, CommuneProps, CycleProps, DataSettingProps, DataSettingSlice, DepartementProps, NiveauProps } from "../../_types/data_setting_type";


// Initial state
const initialState: DataSettingSlice = {
    dataSetting: {
        services: [],
        fonctions: [],
        grades: [],
        categories: [],
        region: [],
        departement: [],
        communes: [],
        sections: [],
        cycles: [],
        niveaux: [],
        __v: 0,
    },
    loading: false,
    error: null,
};

// Création du slice
const dataSettingSlice = createSlice({
    name: "dataSettingSlice",
    initialState,
    reducers: {

        setLoadingDataSetting(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setErrorDataSetting(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        //
        //
        //
        //
        setDataSetting(state, action: PayloadAction<DataSettingProps>) {
            state.dataSetting = action.payload;
        },


        //
        //
        //
        //
        //
        // create
        createSettingItem(state, action: PayloadAction<{
            tableName: keyof DataSettingProps; newItem: CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps
        }>) {
            const { tableName, newItem } = action.payload;

            const table = state.dataSetting[tableName] as (CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps)[];

            (state.dataSetting[tableName] as any) = [...table, newItem];
        },

        //
        //
        //
        //
        // update 
        updateSettingItem(state, action: PayloadAction<{ tableName: keyof DataSettingProps; updatedItem: CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps }>) {
            const { tableName, updatedItem } = action.payload;

            const table = state.dataSetting[tableName] as (CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps)[];

            const index = table.findIndex(item => item._id === updatedItem._id);
            if (index !== -1) {
                table[index] = updatedItem;
            } else {
                console.error("Item not found in the table:", updatedItem._id);
            }

            (state.dataSetting[tableName] as any) = [...table];
        },


        //
        //
        //
        //
        // Action pour supprimer un élément dans un tableau en fonction de son ID
        deleteSettingItem(state, action: PayloadAction<{ tableName: keyof DataSettingProps; itemId: string }>) {
            const { tableName, itemId } = action.payload;

            const table = state.dataSetting[tableName] as (CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps)[];

            const index = table.findIndex((item) => item._id === itemId);
            if (index !== -1) {
                (state.dataSetting[tableName] as any) = table.filter((item) => item._id !== itemId);
            }
        },
    },
});

// Actions exportées
export const {
    setLoadingDataSetting,
    setErrorDataSetting,
    setDataSetting,
    //
    createSettingItem,
    updateSettingItem,
    deleteSettingItem,
    //
} = dataSettingSlice.actions;

// Reducer exporté
export default dataSettingSlice.reducer;
