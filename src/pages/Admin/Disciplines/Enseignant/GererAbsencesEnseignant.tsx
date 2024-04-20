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



const GererAbsencesEnseignant = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedEnseignant = useSelector((state: RootState) => state.enseignantDisciplineSlice.selected.user);
    const [isHourRemove, setHourRemove] = useState(false);

    const [enseignantCustomSelected, setEnseignantCustomSelected] = useState<CustomEnseignantSelect>({ absence: undefined, user: selectedEnseignant })

    const handleEditHourEnseignant = (absence: AbsenceType, isHourRemove: boolean) => {
        handleShowModal();
        setHourRemove(isHourRemove);
        if (selectedEnseignant) {
            // contien l'utilisateur et l'objet absence a supprimer
            setEnseignantCustomSelected({ absence: absence, user: selectedEnseignant })
        }
    }

    const handleAddHourEnseignant = () => {
        handleShowModal();
        setHourRemove(false);
        setEnseignantCustomSelected({ absence: undefined, user: selectedEnseignant })
    }


    const handleShowModal = () => { dispatch(setShowModal()); }


    useEffect(() => {
        if (selectedEnseignant === undefined) {
            navigate('/teachers/disciplines/')
        }
    }, [selectedEnseignant])
    return (
        <>
            <Breadcrumb isGestionEnseignant={true} pageName={t('sub_menu.gestion_absences_enseignant')} />

            <div className="flex justify-end mt-10">
                <ButtonCreate onClick={handleAddHourEnseignant} />
            </div>

            {selectedEnseignant &&
                <>
                    <SectionNomEtAction user={selectedEnseignant} />
                    <CardListAbsence listAbsence={selectedEnseignant.absences} onEdit={handleEditHourEnseignant} />
                </>
            }


            {
                <ModalCreateUpdateAbsence user={enseignantCustomSelected} isHourRemove={isHourRemove} />
            }

            {/* Boite de dialogue */}
        </>
    );
};

export default GererAbsencesEnseignant;
