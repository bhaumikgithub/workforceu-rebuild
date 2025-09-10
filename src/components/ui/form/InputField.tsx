import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  label?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  className?: string; // optional extra class
  addon?: string; // extra addon (suffix text)
}

export default function InputField({
  label,
  register,
  error,
  type = "text",
  placeholder,
  className = "",
  addon,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center border rounded-lg px-3 py-2 minimal-textbox">
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className={`flex-1 outline-none bg-transparent ${className}`}
        />
        {addon && <span className="ml-2 text-gray-600 whitespace-nowrap">{addon}</span>}
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}
