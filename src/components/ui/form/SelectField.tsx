import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectFieldProps {
  label?: string;
  register: UseFormRegisterReturn;
  options: { value: string | number; label: string }[];
  error?: FieldError;
  placeholder?: string;
  className?: string; // optional extra class
}

export default function SelectField({ label, register, options, error , className="" }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      {/* {label && <label className="font-medium">{label}</label>} */}
      <select {...register}
        className={`minimal-textbox ${className} `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}
