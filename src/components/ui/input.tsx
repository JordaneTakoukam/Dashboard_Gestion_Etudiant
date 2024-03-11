import React, { ReactNode, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for visibility

interface InputProps {
  value: string;
  setValue: (value: string) => void;
  type?: string;
  showIcon?: boolean;
  icon?: ReactNode;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  setValue,
  type = 'text',
  showIcon = false,
  icon,
  placeholder = 'Enter your text',
}) => {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        className="w-full rounded text-sm border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {type === "password" && (
        <span
          className="absolute right-4 top-2 cursor-pointer text-md lg:text-[18px]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}

      {(showIcon && type != "password") && (
        <span
          className="absolute right-4 top-2 cursor-pointer text-md lg:text-[18px]"
        >
          {icon}
        </span>
      )}
    </div>
  );
};

export default Input;
