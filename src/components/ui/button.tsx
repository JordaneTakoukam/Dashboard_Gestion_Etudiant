import { IoIosNavigate } from "react-icons/io";


interface ButtomCustomProps {
    title: String,
    onClick: () => void,
    next?: boolean,
    outline?: boolean,
    desactivated?: boolean,

}



function ButtonCustom({ title, onClick, next, outline, desactivated }: ButtomCustomProps) {
    return (
        <button
            className={` 
            ${desactivated ? 'cursor-not-allowed pointer-events-none '  : ' cursor-pointer'}
            duraction-300
            ${outline ? "text-white hover:bg-primary hover:text-white" : "border-primary bg-primary text-white hover:bg-[#3d3a95] hover:border-[#3d3a95] "}
            flex items-center justify-center gap-x-4 w-full cursor-pointer
             rounded-lg border  px-4 py-2 
              transition hover:bg-opacity-90`}
            onClick={onClick}

        >
            {
                title
            }

            {next && <div className="text-white text-[25px]">
                <IoIosNavigate />
            </div>}
        </button>)
}

export default ButtonCustom