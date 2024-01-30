import { IoMdAdd } from "react-icons/io";


interface ButtonNewProps {
    title: string;
    onClick: () => void;
}

const ButtonNew = ({ title, onClick }: ButtonNewProps) => {
    return (
        <button
            onClick={onClick}
            className="  
            w-[90px] lg:w-auto  
            inline-flex items-center justify-center gap-2.5 bg-primary  px-2 text-center font-medium text-white my-4 lg:my-2   
             h-[45px] lg:min-w-[230px] hover:bg-opacity-90 lg:py-4 lg:px-8 xl:px-10 rounded text-[11.5px] lg:text-sm md:text-md"
        >
            <div className="text-[22px]">
                <IoMdAdd />
            </div>
            <h1 className='hidden lg:block'>
                {title}
            </h1>
        </button>
    );
};

export default ButtonNew;
