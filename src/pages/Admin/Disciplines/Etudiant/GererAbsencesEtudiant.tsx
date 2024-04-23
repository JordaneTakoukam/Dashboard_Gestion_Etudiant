import { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import ModalCreateUpdateAbsence from "../../../../components/Modals/ModalAbsence/FormCreateUpdate";
import { useNavigate } from 'react-router-dom';
import SectionNomEtAction from "../Componants/SectionNomEtAction";
import CardListAbsence from "../Componants/CardListAbsence";
import ButtonCreate from "../../../../components/Tables/common/ButtonCreate";
import { setShowModal } from "../../../../_redux/features/setting";



const GererAbsencesEtudiant = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedEtudiant = useSelector((state: RootState) => state.etudiantDisciplineSlice.selected.user);
    const [isHourRemove, setHourRemove] = useState(false);

    const [etudiantCustomSelected, setEtudiantCustomSelected] = useState<CustomEtudiantSelect>({ absence: undefined, user: selectedEtudiant })

    const handleEditHourEtudiant = (absence: AbsenceType, isHourRemove: boolean) => {
        handleShowModal();
        setHourRemove(isHourRemove);
        if (selectedEtudiant) {
            // contien l'utilisateur et l'objet absence a supprimer
            setEtudiantCustomSelected({ absence: absence, user: selectedEtudiant })
        }
    }

    const handleAddHourEtudiant = () => {
        handleShowModal();
        setHourRemove(false);
        setEtudiantCustomSelected({ absence: undefined, user: selectedEtudiant })
    }


    const handleShowModal = () => { dispatch(setShowModal()); }


    useEffect(() => {
        if (selectedEtudiant === undefined) {
            navigate('/students/disciplines/')
        }
    }, [selectedEtudiant])
    return (
        <>
            <Breadcrumb isGestionEtudiant={true} pageName={t('sub_menu.gestion_absences_etudiant')} />

            <div className="flex justify-end mt-10">
                <ButtonCreate onClick={handleShowModal} title={""} />
            </div>

            {selectedEtudiant &&
                <>
                    <SectionNomEtAction user={selectedEtudiant} isStudent={true}/>
                    <CardListAbsence listAbsence={selectedEtudiant.absences} onEdit={handleEditHourEtudiant} />
                </>
            }


            {
                <ModalCreateUpdateAbsence isStudent={true} user={etudiantCustomSelected} isHourRemove={isHourRemove} />
            }

            {/* Boite de dialogue */}
        </>
    );
};

export default GererAbsencesEtudiant;
