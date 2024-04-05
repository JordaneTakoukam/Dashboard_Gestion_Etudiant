import { useTranslation } from "react-i18next"
import Bouton from "../ui/Bouton";
import { useDispatch } from "react-redux";
import EmptyImage from "../ui/EmptyImage";
// import { ModalCreateUpdateBatiment } from "../Modals/ModalBatiment/ModalCreateUpdateBatiment";


function PageNoDataTable({ title }: { title?: string }) {
    const { t } = useTranslation();
    return (
        <thead className='mb-45 mt-35 flex justify-center items-center'>
            <tr>
                <th className="text-sm font-medium">{title ? title : t('label.tableau_vide')}</th>
            </tr>
        </thead>
    )
}



interface PageNoDataProps {
    titrePage: string,
    titreBouton: string,
    showModalCreate: () => void
    refreshFunction?: () => void

}
function PageNoData({ titrePage, titreBouton, showModalCreate, refreshFunction }: PageNoDataProps) {
    const { t } = useTranslation();

    return (
        <div>
            <div className=" text-center flex flex-col items-center justify-center">

                <div className='flex flex-col justify-center items-center text-center gap-y-5'>
                    <EmptyImage />

                    <h1 className="text-sm font-medium">
                        {titrePage}
                    </h1>
                    <div className="flex flex-col gap-x-3">

                        <Bouton
                            titreBouton={titreBouton}
                            onClick={showModalCreate}
                        />

                        {/* bouton refresh */}
                        <div className="w-full mt-16">
                            <Bouton
                                circle={true}
                                typeRefresh={true}
                                titreBouton={t('boutton.actualiser')}
                                onClick={refreshFunction ? refreshFunction : () => { }}
                            />
                            <p className="text-[13px] -mt-2 lowercase">{t('boutton.actualiser')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <ModalCreateUpdateBatiment batiment={null} /> */}

        </div>
    )
}

export { PageNoDataTable, PageNoData }