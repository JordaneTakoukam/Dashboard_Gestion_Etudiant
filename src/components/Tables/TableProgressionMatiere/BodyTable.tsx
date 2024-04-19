import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { apiUpdateChapitre } from "../../../api/api_chapitre";
import createToast from "../../../hooks/toastify";
import { updateMatiere } from "../../../_redux/features/progession_matiere_slice";

const BodyTable = ({ data }: { data: MatiereType | undefined }) => {
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [matiereData, setMatiereData] = useState<MatiereType | undefined>(data); // État de la matière
    useEffect(() => {
        setMatiereData(data);
    }, [data]);

    const handleCheckboxChange = async (chapitreIndex: number, objectifIndex: number) => {
        if (roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole ) {
            if(matiereData && matiereData.chapitres){
                const updatedChapitres = matiereData.chapitres.map((chapitre, index) => {
                    if (index === chapitreIndex) {
                        const updatedObjectifs = chapitre.objectifs.map((objectif, idx) => {
                            if (idx === objectifIndex) {
                                // Créez un nouvel objet Objectif avec l'état mis à jour
                                const updatedObjectif = { ...objectif, etat: objectif.etat === 1 ? 0 : 1 };

                                // Appel de l'API de mise à jour du chapitre
                                if (chapitre._id) {
                                    apiUpdateChapitre({
                                        _id: chapitre._id,
                                        code: chapitre.code,
                                        libelleFr: chapitre.libelleFr,
                                        libelleEn: chapitre.libelleEn,
                                        typesEnseignement: chapitre.typesEnseignement,
                                        matiere: chapitre.matiere,
                                        objectifs: chapitre.objectifs.map((o, index) => {
                                            if (index === objectifIndex) {
                                                return updatedObjectif;
                                            }
                                            return o;
                                        }),
                                    }).then((response) => {
                                        // Gestion de la réponse de l'API
                                        if (response.success) {
                                            // Mettez à jour l'état de la matière avec les chapitres mis à jour
                                            setMatiereData((prevData: MatiereType | undefined) => {
                                                if (!prevData || !prevData.chapitres) return prevData; // Retourne le state inchangé si prevData est undefined
                                                const updatedChapitres = prevData.chapitres.map((c, idx) => {
                                                    if (idx === chapitreIndex) {
                                                        return { ...c, objectifs: c.objectifs.map((o, idx) => idx === objectifIndex ? updatedObjectif : o) };
                                                    }
                                                    return c;
                                                });
                                                return { ...prevData, chapitres: updatedChapitres };
                                            });
                                            if(matiereData._id){
                                                dispatch(
                                                    updateMatiere({
                                                        id: matiereData._id,
                                                        matiereData: {
                                                            _id: matiereData._id,
                                                            code: matiereData.code,
                                                            chapitres:updatedChapitres
                                                        }
                                                    }));
                                                }
                                            createToast(response.message[lang as keyof typeof response.message], '', 0);
                                        } else {
                                            createToast(response.message[lang as keyof typeof response.message], '', 2);
                                        }
                                    }).catch((error) => {
                                        console.error('Error updating chapter:', error);
                                        createToast(error.message, '', 2);
                                    });
                                }

                                return updatedObjectif;
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


    // const handleCheckboxChange = (chapitreIndex: number, objectifIndex: number) => {
    //     if (roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole ) {
    //         if(matiereData && matiereData.chapitres){
    //             const updatedChapitres = matiereData.chapitres.map((chapitre, index) => {
    //                 if (index === chapitreIndex) {
    //                     const updatedObjectifs = chapitre.objectifs.map((objectif, idx) => {
    //                         if (idx === objectifIndex) {
    //                             // Créez un nouvel objet Objectif avec l'état mis à jour
    //                             return { ...objectif, etat: objectif.etat === 1 ? 0 : 1 };
    //                         }
    //                         return objectif;
    //                     });
    //                     return { ...chapitre, objectifs: updatedObjectifs };
    //                 }
    //                 return chapitre;
    //             });
    //             // Mettez à jour l'état de la matière avec les chapitres mis à jour
    //             setMatiereData({ ...matiereData, chapitres: updatedChapitres });
    //         }
            
    //     }
    // };

    return (
        <tbody>
            {matiereData && matiereData.chapitres && matiereData.chapitres.map((chapitre: ChapitreType, indexChapitre: number) => (
                <React.Fragment key={indexChapitre + 1}>
                    {chapitre.objectifs && chapitre.objectifs.map((objectif: ObjectifType, indexObjectif: number) => (
                        <tr key={`${indexChapitre}-${indexObjectif}`} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                            {/* Nom du chapitre */}
                            {indexObjectif === 0 && (
                                <td rowSpan={chapitre.objectifs.length} className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black">
                                    <h5>{lang==='fr' ? chapitre.libelleFr : chapitre.libelleEn}</h5>
                                </td>
                            )}
                            {/* Objectif du chapitre */}
                            <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                                <h5>{lang==='fr' ? objectif.libelleFr : objectif.libelleEn }</h5>
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
