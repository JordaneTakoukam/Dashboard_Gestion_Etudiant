import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BreadcrumbProps {
  pageName: string;
  isDashboard?: boolean;
  isChapitre? : boolean;
  isObjectif?:boolean;
  isPeriodeEnseignement?:boolean;
  isEnseignement?:boolean;
  returnWithMatiere?:()=>void;
  returnWithChapitre?:()=>void;
  returnWithPeriodeEnseignement?:()=>void;
}



const Breadcrumb = ({ pageName, isDashboard = false, isChapitre=false, isObjectif=false, isEnseignement=false, isPeriodeEnseignement=false,  returnWithMatiere, returnWithChapitre, returnWithPeriodeEnseignement}: BreadcrumbProps) => {
  const { t } = useTranslation();
  const handleChapitreClick = () => {
    returnWithChapitre && returnWithChapitre();
  };

  const handleMatiereClick = () => {
    returnWithMatiere && returnWithMatiere();
  };

  const handlePeriodeClick = () => {
    returnWithPeriodeEnseignement && returnWithPeriodeEnseignement();
  };


  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="text-[14.5px]  md:text-[15px]  flex items-center gap-2">
          <li>
            <Link to="/">{t('tableau_de_bord.title')} /</Link>
          </li>

          {isChapitre && (
            <li>
              <Link to={"/subjects/subject-list"} onClick={handleMatiereClick}>{t('sub_menu.liste_matiere')} /</Link>
            </li>
          )}

          {isObjectif && (
            <li>
              <Link to="#" onClick={handleChapitreClick}>{t('sub_menu.chapitres')} / </Link>
            </li>
          )}

          {isEnseignement && (
            <li>
              <Link to={"/subjects/subject-list"} onClick={handleMatiereClick}>{t('sub_menu.liste_matiere')} /</Link>
            </li>
          )}

          {isPeriodeEnseignement && (
            <li>
              <Link to={"/subjects/periodes_enseignement"} onClick={handlePeriodeClick}>{t('sub_menu.periodes_enseignement')} /</Link>
            </li>
          )}

          {
            isDashboard == false && (
              <li className="text-primary">{pageName}</li>

            )
          }
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
