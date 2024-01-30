import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  isDashboard?: boolean;
}

const Breadcrumb = ({ pageName, isDashboard = false }: BreadcrumbProps) => {
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
