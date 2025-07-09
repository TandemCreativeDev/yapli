interface FormInputProps {
  type: string;
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function FormInput({
  type,
  id,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  maxLength,
  disabled = false,
  className = "",
  onKeyDown,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        onKeyDown={onKeyDown}
        className={`w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-transparent disabled:opacity-50 ${className}`}
      />
    </div>
  );
}
