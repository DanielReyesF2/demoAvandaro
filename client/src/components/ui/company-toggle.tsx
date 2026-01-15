import { useState } from "react";

interface CompanyToggleProps {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function CompanyToggle({ options, defaultValue, onChange }: CompanyToggleProps) {
  const [selected, setSelected] = useState(defaultValue || options[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`
            flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              selected === option
                ? "bg-accent-green text-white shadow-sm"
                : "bg-white text-gray-700 border border-subtle hover:bg-gray-50"
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
