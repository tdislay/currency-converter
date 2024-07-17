import { InputHTMLAttributes } from "react";

export function Input({
  type = "text",
  placeholder,
  disabled = false,
  value,
  onChange,
}: {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      type={type}
      value={value}
      className={`p-2 w-full bg-white rounded-md border focus:outline-none focus:border-blue-600 ${disabled ? "text-gray-400 cursor-not-allowed" : ""}`}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
