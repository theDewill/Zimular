"use client";
import React, { useState } from 'react';

const DynamicColumnFilterTable = ({ headers, data }: { headers: string[]; data: any[][] }) => {
  const [filters, setFilters] = useState<string[]>(new Array(headers.length).fill(''));

  const handleFilterChange = (index: number, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = value;
    setFilters(newFilters);
  };

  const filteredData = data.filter(row =>
    row.some((cell, index) =>
      cell.toLowerCase().includes(filters[index].toLowerCase())
    )
  );

  return (
    <div>
      <div className='flex gap-4'>
        {headers.map((header, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder={`Filter ${header}...`}
              value={filters[index]}
              onChange={(e) => handleFilterChange(index, e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
      </div>
      <table className="border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicColumnFilterTable;
