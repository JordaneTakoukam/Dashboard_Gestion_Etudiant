import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Matiere, Chapitre, Objectif } from "../../../pages/Admin/ListeMatieres";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";

const BodyTable = ({ data }: { data: Matiere }) => {
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [matiereData, setMatiereData] = useState<Matiere>(data); // État de la matière
    useEffect(() => {
        setMatiereData(data);
    }, [data]);

    const handleCheckboxChange = (chapitreIndex: number, objectifIndex: number) => {
        if (roles.admin === userRole || roles.teacher === userRole ) {
            if(matiereData.chapitres){
                const updatedChapitres = matiereData.chapitres.map((chapitre, index) => {
                    if (index === chapitreIndex) {
                        const updatedObjectifs = chapitre.objectifs.map((objectif, idx) => {
                            if (idx === objectifIndex) {
                                // Créez un nouvel objet Objectif avec l'état mis à jour
                                return { ...objectif, etat: objectif.etat === 1 ? 0 : 1 };
                            }
                            return objectif;
                        });
                        return { ...chapitre, objectifs: updatedObjectifs };
                    }
                    return chapitre;
                });
                // Mettez à jour l'état de la matière avec les chapitres mis à jour
                setMatiereData({ ...matiereData, chapitres: updatedChapitres });
            }
            
        }
    };

    return (
        <tbody>
            {matiereData.chapitres && matiereData.chapitres.map((chapitre: Chapitre, indexChapitre: number) => (
                <React.Fragment key={indexChapitre + 1}>
                    {chapitre.objectifs.map((objectif: Objectif, indexObjectif: number) => (
                        <tr key={`${indexChapitre}-${indexObjectif}`} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                            {/* Nom du chapitre */}
                            {indexObjectif === 0 && (
                                <td rowSpan={chapitre.objectifs.length} className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black">
                                    <h5>{chapitre.libelle}</h5>
                                </td>
                            )}
                            {/* Objectif du chapitre */}
                            <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                                <h5>{objectif.libelle}</h5>
                            </td>
                            {/* Case à cocher pour l'état de l'objectif */}
                            <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                                <input type="checkbox" checked={objectif.etat === 1} onChange={() => handleCheckboxChange(indexChapitre, indexObjectif)} />
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
        </tbody>
    );
};

export default BodyTable;
