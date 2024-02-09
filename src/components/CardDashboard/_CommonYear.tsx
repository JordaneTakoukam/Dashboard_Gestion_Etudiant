import { FaArrowUpLong } from "react-icons/fa6";

interface CurrentYearDateProps {
    additionalStyle?: String
}

export function CurrentYearDate({ additionalStyle }: CurrentYearDateProps) {
    const date = '2024 - 2025';
    return (

        <div className={`${additionalStyle} absolute bottom-0 right-0 mb-4 mr-2 z-10 text-meta-5 `}>
            {/* annee  */}
            <span className="flex items-center gap-1 text-[12px] font-medium">
                {date}
                <div className="fill-meta-5 h-[10px] w-[10px]">
                    <FaArrowUpLong />
                </div>
            </span>
        </div>)
}

