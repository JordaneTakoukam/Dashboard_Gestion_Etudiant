import { Link } from 'react-router-dom';
import { Matiere } from '../pages/Admin/ListeMatieres';

interface BreadcrumbProps {
  pageName: string;
  isDashboard?: boolean;
  isMatiere? : boolean;
  returnWithMatiere?:()=>void;
}

const Breadcrumb = ({ pageName, isDashboard = false, isMatiere=false, returnWithMatiere}: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="text-[14.5px]  md:text-[15px]  flex items-center gap-2">
          <li>
            <Link to="/">Tableau de bord /</Link>
          </li>

          {isMatiere && (
            <li>
              <Link to={"/subjects/subject-list"} onClick={() =>returnWithMatiere && returnWithMatiere()}> Liste des matières /</Link>
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
