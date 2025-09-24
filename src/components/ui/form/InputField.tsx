import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string; // extra class
  addon?: string; // suffix text
  warning?: React.ReactNode;
}

// forwardRef is needed so you can pass ref from parent (cityInputRef)
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  register,
  error,
  className = "",
  addon,
  warning,
  ...rest
}, ref) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center border rounded-lg px-3 py-2 minimal-textbox">
        <input
          className={`flex-1 outline-none bg-transparent ${className}`}
          {...register}
          ref={ref || register.ref}
          {...rest}
        />
        {addon && <span className="ml-2 text-gray-600 whitespace-nowrap">{addon}</span>}
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
      {!error && warning && (
          <p className="text-yellow-600 text-sm">{warning}</p>
      )}
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;
