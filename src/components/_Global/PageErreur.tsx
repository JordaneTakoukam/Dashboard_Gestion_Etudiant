import { useTranslation } from "react-i18next"
import Bouton from "../ui/Bouton";
import ErrorImage from "../ui/ErrorImage";

interface PageErreurDataProps {
    onRefresh: () => void

}

export function PageErreur({ onRefresh }: PageErreurDataProps) {
    const { t } = useTranslation();

    return (
        <div className="my-20">
            <div className='flex flex-col justify-center items-center text-center gap-y-5'>
                <ErrorImage />

                <h1 className="text-sm font-medium text-[#ed4949]">
                    {t("message.erreur_recuperation")}
                </h1>

                <Bouton
                    typeRefresh={true}
                    titreBouton={t('boutton.actualiser')}
                    onClick={onRefresh}
                />
            </div>
        </div>
    )
}