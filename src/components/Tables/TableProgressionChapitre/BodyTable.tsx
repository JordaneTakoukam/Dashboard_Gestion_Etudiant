import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";
import { setShowModal } from "../../../_redux/features/setting";

const BodyTable = ({ data, onEdit}: { data: ChapitreType[], onEdit: (chapitre:ChapitreType) => void}) => {
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    

    const handleCheckboxChange = async (chapitreIndex: number) => {
        onEdit(data[chapitreIndex]);
        dispatch(setShowModal());
    };

    return (
        <tbody>
            {data && data.map((chapitre: ChapitreType, indexChapitre: number) => (
                <tr key={indexChapitre} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    {/* Chapitre de la matière */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                        <h5>{lang === 'fr' ? chapitre.libelleFr : chapitre.libelleEn }</h5>
                    </td>
                    {/* Case à cocher pour l'état de l'chapitre */}
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <input className="cursor-pointer" type="checkbox" checked={chapitre.etat === 1} onChange={() => handleCheckboxChange(indexChapitre)} />
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../_redux/store";
// import { config } from "../../../config";
// import { apiUpdateChapitre } from "../../../api/api_chapitre";
// import createToast from "../../../hooks/toastify";
// import { updateMatiere } from "../../../_redux/features/progession_matiere_slice";

// const BodyTable = ({ data }: { data: MatiereType | undefined }) => {
//     const dispatch = useDispatch();
//     const userRole = useSelector((state: RootState) => state.user.role);
//     const roles = config.roles;
//     const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
//     const [matiereData, setMatiereData] = useState<MatiereType | undefined>(data); // État de la matière
//     useEffect(() => {
//         setMatiereData(data);
//     }, [data]);

//     const handleCheckboxChange = async (chapitreIndex: number, chapitreIndex: number) => {
//         if (roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole ) {
//             if(matiereData && matiereData.chapitres){
//                 const updatedChapitres = matiereData.chapitres.map((chapitre, index) => {
//                     if (index === chapitreIndex) {
//                         const updatedChapitres = chapitre.chapitres.map((chapitre, idx) => {
//                             if (idx === chapitreIndex) {
//                                 // Créez un nouvel objet Chapitre avec l'état mis à jour
//                                 const updatedChapitre = { ...chapitre, etat: chapitre.etat === 1 ? 0 : 1 };

//                                 // Appel de l'API de mise à jour du chapitre
//                                 if (chapitre._id) {
//                                     apiUpdateChapitre({
//                                         _id: chapitre._id,
//                                         code: chapitre.code,
//                                         libelleFr: chapitre.libelleFr,
//                                         libelleEn: chapitre.libelleEn,
//                                         typesEnseignement: chapitre.typesEnseignement,
//                                         matiere: chapitre.matiere,
//                                         chapitres: chapitre.chapitres.map((o, index) => {
//                                             if (index === chapitreIndex) {
//                                                 return updatedChapitre;
//                                             }
//                                             return o;
//                                         }),
//                                     }).then((response) => {
//                                         // Gestion de la réponse de l'API
//                                         if (response.success) {
//                                             // Mettez à jour l'état de la matière avec les chapitres mis à jour
//                                             setMatiereData((prevData: MatiereType | undefined) => {
//                                                 if (!prevData || !prevData.chapitres) return prevData; // Retourne le state inchangé si prevData est undefined
//                                                 const updatedChapitres = prevData.chapitres.map((c, idx) => {
//                                                     if (idx === chapitreIndex) {
//                                                         return { ...c, chapitres: c.chapitres.map((o, idx) => idx === chapitreIndex ? updatedChapitre : o) };
//                                                     }
//                                                     return c;
//                                                 });
//                                                 return { ...prevData, chapitres: updatedChapitres };
//                                             });
//                                             if(matiereData._id){
//                                                 dispatch(
//                                                     updateMatiere({
//                                                         id: matiereData._id,
//                                                         matiereData: {
//                                                             _id: matiereData._id,
//                                                             code: matiereData.code,
//                                                             chapitres:updatedChapitres
//                                                         }
//                                                     }));
//                                                 }
//                                             createToast(response.message[lang as keyof typeof response.message], '', 0);
//                                         } else {
//                                             createToast(response.message[lang as keyof typeof response.message], '', 2);
//                                         }
//                                     }).catch((error) => {
//                                         console.error('Error updating chapter:', error);
//                                         createToast(error.message, '', 2);
//                                     });
//                                 }

//                                 return updatedChapitre;
//                             }
//                             return chapitre;
//                         });
//                         return { ...chapitre, chapitres: updatedChapitres };
//                     }
//                     return chapitre;
//                 });
//                 // Mettez à jour l'état de la matière avec les chapitres mis à jour
//                 setMatiereData({ ...matiereData, chapitres: updatedChapitres });
//             }
//         }
//     };


//     // const handleCheckboxChange = (chapitreIndex: number, chapitreIndex: number) => {
//     //     if (roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole ) {
//     //         if(matiereData && matiereData.chapitres){
//     //             const updatedChapitres = matiereData.chapitres.map((chapitre, index) => {
//     //                 if (index === chapitreIndex) {
//     //                     const updatedChapitres = chapitre.chapitres.map((chapitre, idx) => {
//     //                         if (idx === chapitreIndex) {
//     //                             // Créez un nouvel objet Chapitre avec l'état mis à jour
//     //                             return { ...chapitre, etat: chapitre.etat === 1 ? 0 : 1 };
//     //                         }
//     //                         return chapitre;
//     //                     });
//     //                     return { ...chapitre, chapitres: updatedChapitres };
//     //                 }
//     //                 return chapitre;
//     //             });
//     //             // Mettez à jour l'état de la matière avec les chapitres mis à jour
//     //             setMatiereData({ ...matiereData, chapitres: updatedChapitres });
//     //         }
            
//     //     }
//     // };

//     return (
//         <tbody>
//             {matiereData && matiereData.chapitres && matiereData.chapitres.map((chapitre: ChapitreType, indexChapitre: number) => (
//                 <React.Fragment key={indexChapitre + 1}>
//                     {chapitre.chapitres && chapitre.chapitres.map((chapitre: ChapitreType, indexChapitre: number) => (
//                         <tr key={`${indexChapitre}-${indexChapitre}`} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
//                             {/* Nom du chapitre */}
//                             {indexChapitre === 0 && (
//                                 <td rowSpan={chapitre.chapitres.length} className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black">
//                                     <h5>{lang==='fr' ? chapitre.libelleFr : chapitre.libelleEn}</h5>
//                                 </td>
//                             )}
//                             {/* Chapitre du chapitre */}
//                             <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
//                                 <h5>{lang==='fr' ? chapitre.libelleFr : chapitre.libelleEn }</h5>
//                             </td>
//                             {/* Case à cocher pour l'état de l'chapitre */}
//                             <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
//                                 <input type="checkbox" checked={chapitre.etat === 1} onChange={() => handleCheckboxChange(indexChapitre, indexChapitre)} />
//                             </td>
//                         </tr>
//                     ))}
//                 </React.Fragment>
//             ))}
//         </tbody>
//     );
// };

// export default BodyTable;
