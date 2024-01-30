import { BsSearch } from "react-icons/bs";

interface SearchProps {
    text: string;
    hintText: string;
    onSubmit: () => void;
}

const InputSearch = ({ text, hintText, onSubmit }: SearchProps) => {
    return (
        <div className="flex justify-between items-center w-full">
            <input
                className="w-full  h-[49px]  rounded border border-stroke bg-gray-2  px-6 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                placeholder={hintText}
            />

            <button
                onClick={onSubmit}
                className=" 
                           inline-flex items-center justify-center gap-2.5 bg-primary px-4 text-center font-medium text-white my-4 lg:my-2   
                           h-[45px]   hover:bg-opacity-90 lg:py-4 lg:px-2 xl:px-6 rounded text-sm md:text-md"
            >
                <div className="text-[20px] lg:text-[22px]">
                    <BsSearch />
                </div>
                <h1 className="hidden lg:block">
                    Rechercher
                </h1>

            </button>
        </div>
    );
};

export default InputSearch;
