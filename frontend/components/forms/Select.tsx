export function Select({
  options,
  placeholder,
  disabled = false,
  option,
  onChange,
}: {
  options: { key: string; name: string }[];
  placeholder?: string;
  disabled?: boolean;
  option: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className={`p-2 w-full bg-white rounded-md focus:border-blue-600 border ${disabled ? "text-gray-400 cursor-not-allowed" : ""}`}
      value={option}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder ?? "Select an option"}</option>
      {options.map(({ key, name }) => (
        <option key={key} value={key}>
          {name}
        </option>
      ))}
    </select>
  );
}
