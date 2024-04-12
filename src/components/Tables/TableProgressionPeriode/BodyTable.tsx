import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalChapitre, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import React from "react"
import { useTranslation } from "react-i18next"

interface BodyPeriodeEnseignementProps {
    data: PeriodeEnseignementType | undefined;
}

const BodyTable = ({ data}: BodyPeriodeEnseignementProps) => {
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    return <tbody>
        {data?.enseignements && data?.enseignements.map((periode, index) => (
            <React.Fragment key={index}>
                <tr>
                    <th className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black text-center " colSpan={4}>
                        {lang === 'fr' ? periode.matiere.libelleFr : periode.matiere.libelleEn}
                    </th>
                </tr>
                <tr>
                    <td className="text-center">{t('label.nb_seance_periode')}</td>
                    <td className="text-center">{t('label.nb_seance_pratique')}</td>
                    <td className="text-center">{t('label.gap')}</td>
                    <td className="text-center">{t('label.taux_presence')}</td>
                </tr>
                <tr>
                    <td className="text-center">{periode.nombreSeance}</td>
                    <td className="text-center">{0}</td>
                    <td className="text-center">{periode.nombreSeance - 0}</td>
                    <td className="text-center">{((0 / periode.nombreSeance) * 100).toFixed(2)}%</td>
                </tr>
            </React.Fragment>
        ))}
    </tbody>
}

export default BodyTable