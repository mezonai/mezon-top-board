interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <svg
        className="absolute w-5 h-5 hidden peer-checked:block text-white pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  );
}
