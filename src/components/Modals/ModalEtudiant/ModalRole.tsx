import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete, setShowRoleModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteEtudiant, apiUpdateEtudiant } from '../../../api/other_users/api_etudiant';
import createToast from '../../../hooks/toastify';
import { deleteEtudiant, updateRolesEtudiant } from '../../../_redux/features/etudiant_slice';
import { config } from '../../../config';
import { ChangeEvent, useEffect, useState } from 'react';

function ModalRole({ etudiant }: { etudiant: EtudiantType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.addRole);
    const closeModal = () => { dispatch(setShowRoleModal()); setRolesData(etudiant?.roles)};
    const lang = useSelector((state: RootState) => state.setting.language);
    const roles = config.roles;
    const [rolesData, setRolesData] = useState<string[]|undefined>(); // État de la matière

    const handleUpdateRole = async () => {
        setIsLoading(true);
        if(etudiant){await apiUpdateEtudiant(
                    {
                        _id:etudiant._id,
                        nom:etudiant.nom,
                        genre:etudiant.genre,
                        email:etudiant.email,
                        photo_profil:etudiant.photo_profil,
                        contact:etudiant.contact,
                        matricule:etudiant.matricule,
                        prenom:etudiant.prenom,
                        date_naiss:etudiant.date_naiss,
                        lieu_naiss:etudiant.lieu_naiss,
                        date_entree:etudiant.date_entree,
                        niveaux:etudiant.niveaux,
                        // grade:etudiant.grade,
                        categorie:etudiant.categorie,
                        fonction:etudiant.fonction,
                        service:etudiant.service,
                        commune:etudiant.commune,
                        roles:rolesData
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        if(etudiant._id){
                            dispatch(updateRolesEtudiant({
                                id: etudiant._id,
                                roles: rolesData
                            }));
                        }
                            
                        closeModal();

                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false);
                })
            }

    }
    useEffect(()=>{
        setRolesData(etudiant?.roles);
    },[etudiant])
    const displayRole = (roleName: string) => {
        if (roleName === roles.admin) {
            return lang === 'fr' ? 'Administrateur' : 'Administrator';
        }
        if (roleName === roles.enseignant) {
            return lang === 'fr' ? 'Enseignant' : 'Teacher';
        }
        if (roleName === roles.delegue) {
            return lang === 'fr' ? 'Délégué' : 'Delegate';
        }
        if (roleName === roles.etudiant) {
            return lang === 'fr' ? 'Etudiant' : 'Student';
        }
    }

    const handleRoleChange = (e: ChangeEvent<HTMLInputElement>, roleName: string) => {
        const isChecked = e.target.checked;
        let updatedRoles: string[] = [];
        
        if (etudiant && etudiant._id) {
            if (isChecked) {
                updatedRoles = [...(rolesData || []), roleName];                 
            } else {
                updatedRoles = (rolesData || []).filter(r => r !== roleName);
            }
            
            if(roleName!==roles.etudiant){
                setRolesData(updatedRoles);
            }   
            
        }
    };

    return (
        <>
            <CustomDialogModal
                title={t('form_update.roles')}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleUpdateRole}
                isLoading={isLoading}
            >
                <h1>{t('label.nom_chose')+ " : "+etudiant?.nom+" "+etudiant?.prenom||""}</h1>
                {Object.entries(roles).map(([roleKey, roleName]) => (
                    (roleName !== roles.superAdmin && roleName !== roles.admin && roleName !== roles.enseignant) && (
                        <div key={roleKey}>
                            <input type="checkbox"
                                checked={rolesData?.includes(roleName)}
                                onChange={(e) => handleRoleChange(e, roleName)}
                            />

                            {displayRole(roleName)}
                        </div>
                    )
                ))}
            </CustomDialogModal>
        </>
    );
}

export default ModalRole;
