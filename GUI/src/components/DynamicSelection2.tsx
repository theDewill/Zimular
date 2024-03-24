import React from 'react';

interface SelectProps {
  options: { value: string; label: string }[];
  stateManager : any;
}

const DynamicSelect: React.FC<SelectProps> = ({ options,stateManager }) => {

  const changeVersion = (e : any) => {
    let opvalue = JSON.parse(e.target.value);
    console.log("from option component from layout",opvalue);
    stateManager(opvalue);
  }

  return (
    <div>
      <select
        name="output"
        id="output"
        className="bg-gray-200 rounded-lg px-4 py-2 outline-none"
        onChange={changeVersion}
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
