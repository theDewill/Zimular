import React from 'react';

interface SelectProps {
  options: { value: string; label: string }[];
}

const DynamicSelect: React.FC<SelectProps> = ({ options }) => {
  return (
    <div>
      <select
        name="output"
        id="output"
        className="bg-gray-200 rounded-lg px-4 py-2 outline-none"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicSelect;
