import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reduceWord } from '../fonctions/fonction';

interface BreadcrumbProps {
  pageName: string;
  isDashboard?: boolean;
  isChapitre?: boolean;
  isObjectif?: boolean;
  isPeriodeEnseignement?: boolean;
  isEnseignement?: boolean;
  returnWithMatiere?: () => void;
  returnWithChapitre?: () => void;
  returnWithPeriodeEnseignement?: () => void;

  //
  isGestionEnseignant?: boolean;
  isGestionEtudiant?: boolean;
}



const Breadcrumb = ({ pageName, isGestionEnseignant = false, isGestionEtudiant = false, isDashboard = false, isChapitre = false, isObjectif = false, isEnseignement = false, isPeriodeEnseignement = false, returnWithMatiere, returnWithChapitre, returnWithPeriodeEnseignement }: BreadcrumbProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleChapitreClick = () => {
    returnWithChapitre && returnWithChapitre();
  };

  const handleMatiereClick = () => {
    returnWithMatiere && returnWithMatiere();
  };

  const handlePeriodeClick = () => {
    returnWithPeriodeEnseignement && returnWithPeriodeEnseignement();
  };

  const handleDisciplneEnseignant = () => {
    navigate('/teachers/disciplines/');
  };


  const handleDisciplneEtudiant = () => {
    navigate('/students/disciplines/');
  };


 

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="text-[14.5px]  md:text-[15px]  flex items-center gap-2">
          <li>
            <li className='flex'>
              <Link className='hover:underline' to={"/"} >{t('tableau_de_bord.title')}</Link>
              <span className='ml-2'> /</span>
            </li>
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
            isGestionEnseignant &&
            <li className='flex'>
              <Link className='hover:underline ' to={"/teachers/disciplines"} onClick={handleDisciplneEnseignant}>{t('sub_menu.discipline')}</Link>
              <span className='ml-2'> /</span>
            </li>
          }

          {
            isGestionEtudiant &&
            <li className='flex'>
              <Link className='hover:underline ' to={"/students/disciplines"} onClick={handleDisciplneEtudiant}>{t('sub_menu.discipline')}</Link>
              <span className='ml-2'> /</span>
            </li>
          }
          {
            isDashboard == false && (
              <li className="text-primary">{reduceWord(pageName, 15)}</li>

            )
          }



        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
