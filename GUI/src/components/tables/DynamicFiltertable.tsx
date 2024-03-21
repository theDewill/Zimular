"use client";
import React, { useState } from 'react';

const DynamicFilterTable = ({ headers, data }: { headers: string[], data: any[][] }) => {
  const [filter, setFilter] = useState('');

  const filteredData = data.filter(row =>
    row.some(cell => cell.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Filter..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded border border-gray-300"
      />
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

export default DynamicFilterTable;
