import React from 'react';

interface DynamicTableProps {
  data: Array<Array<string>>;
}

const DetailsTable: React.FC<DynamicTableProps> = ({ data }) => {
  return (
    <table className="border-collapse border-b border-gray-300 w-full">
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="border-t border-gray-300 py-2">{row[0]}</td>
            <td className="border-t border-gray-300 py-2">{row[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DetailsTable;
