import { GrFormPreviousLink, GrFormNextLink } from 'react-icons/gr';

interface PaginationProps {
    count: number;
    itemsPerPage: number;
    startItem: number;
    endItem: number;
    hasPrevious: boolean;
    hasNext: boolean;
    currentPage: number;
    pageNumbers: number[];
    handlePageClick: (pageNumber: number) => void;
}

function Pagination({ count, itemsPerPage, startItem, endItem, hasPrevious, hasNext, currentPage, pageNumbers, handlePageClick }: PaginationProps) {
    return (
        <>
            {count > itemsPerPage && (
                <div className='flex items-center mt-8 mb-5'>
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p>Affichage l'élément{" "}
                                <span className="font-semibold">{startItem}</span>
                                {" "}-{" "}
                                <span className="font-semibold">{endItem}</span>
                                {" "}
                                sur
                                <span className="font-semibold">{" "}{count}{" "}</span>
                                entrées
                            </p>
                        </div>
                        <div className="flex">
                            {hasPrevious && (
                                <button
                                    className="pr-3 text-black text hover:text-primary duration-300 flex items-center  font-semibold text-[13px] dark:text-gray-2 hover:dark:text-primary"
                                    onClick={() => handlePageClick(currentPage - 1)}
                                >
                                    <div className="text-[20px] text-black dark:text-gray-2 ">
                                        <GrFormPreviousLink />
                                    </div>
                                    Précédent
                                </button>
                            )}
                            <ul className="pagination">
                                {pageNumbers.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`w-[40px] h-[32px] duration-300 text-sm mx-1 border border-gray-300 shadow-sm font-bold  ${currentPage === pageNumber ? 'border-2 border-primary text-white bg-primary' : 'hover:bg-boxdark hover:text-white'}`}
                                        onClick={() => {
                                            handlePageClick(pageNumber);
                                        }}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                            </ul>
                            {hasNext && (
                                <button
                                    className="pl-3 text-black  hover:text-primary duration-300 flex items-center  font-semibold text-[13px] dark:text-gray-2 hover:dark:text-primary"
                                    onClick={() => handlePageClick(currentPage + 1)}>
                                    Suivant
                                    <div className="text-[20px] text-black dark:text-gray-2">
                                        <GrFormNextLink />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Pagination;
