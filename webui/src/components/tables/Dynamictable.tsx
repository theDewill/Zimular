import React from 'react';

interface DynamicTableProps {
  headers: Array<string>;
  data: Array<Array<string>>;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ headers, data }) => {
  return (
    <table className="border-collapse">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
