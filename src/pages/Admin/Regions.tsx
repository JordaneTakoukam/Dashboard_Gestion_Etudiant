import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableRegion/Table";
import FormCreateUpdate from "../../components/Modals/ModalRegion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalRegion/FormDelete";

export interface Region{
    id?:number;
    code:string;
    libelle:string;
}

const Regions = () => {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const handleEditRegion = (region : Region) => {
        setSelectedRegion(region);
    }

    const handleAddRegion = () => {
        setSelectedRegion(null);
    }
    return (
        <>
            <Breadcrumb pageName="Regions" />
            <Table data={regions} onCreate={handleAddRegion} onEdit={handleEditRegion}/>

            <FormCreateUpdate region={selectedRegion}/>
            <FormDelete region={selectedRegion}/>

        </>
    );
};

export default Regions;
export const regions: Region[] = [
    {
        id:1,
        code:"CE",
        libelle:"Centre",
    },
    {
        id:2,
        code:"LT",
        libelle:"Littoral",
    },
    {
        id:3,
        code:"AD",
        libelle:"Adamaoua",
    },
    {
        id:4,
        code:"NO",
        libelle:"Nord",
    },
    {
        id:5,
        code:"SU",
        libelle:"Sud",
    },
    {
        id:6,
        code:"ES",
        libelle:"Est",
    },
    {
        id:7,
        code:"OU",
        libelle:"Ouest",
    },
    {
        id:8,
        code:"EN",
        libelle:"Extrême Nord",
    },
    {
        id:9,
        code:"NW",
        libelle:"Nord Ouest",
    },
    {
        id:10,
        code:"SW",
        libelle:"Sud Ouest",
    },
];
