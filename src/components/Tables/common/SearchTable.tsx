import { BsSearch } from "react-icons/bs";
import { useState } from "react";

interface SearchProps {
    hintText: string;
    onSubmit: () => void;
}

const InputSearch = ({ hintText, onSubmit }: SearchProps) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="w-full ">
            <div className="flex items-center border border-stroke rounded bg-gray-2 h-[38px] lg:h-[45px]">
                <input
                    className="w-full text-[12px] lg:text-[14px] px-3 lg:px-6 h-[42.5px] rounded bg-transparent text-black focus:outline-none dark:text-white"
                    type="text"
                    placeholder={hintText}
                    value={inputValue}
                    onChange={handleChange}
                />
                <button
                    onClick={onSubmit}
                    className="
                    flex items-center justify-center rounded h-full w-[53px]
                    hover:bg-primary hover:text-white focus:outline-none bg-primary text-[22px] text-white"
                >
                    <BsSearch />   

                </button>
            </div>
        </div>
    );
};

export default InputSearch;
