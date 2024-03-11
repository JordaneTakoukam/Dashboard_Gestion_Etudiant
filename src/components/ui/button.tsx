import { IoIosNavigate } from "react-icons/io";


interface ButtomCustomProps {
    title: String,
    onClick: () => void,
    next?: boolean,

}



function ButtonCustom({ title, onClick, next }: ButtomCustomProps) {
    return (
        <button
            className=" flex items-center justify-center gap-x-4 w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
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