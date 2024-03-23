"use client";
import React, { useState } from 'react';

interface FormData {
  time: string;
  action: string;
}

const FilterComponentTable = ({data}:{data:any}) => {
  const [formData, setFormData] = useState<FormData>({
    time: '',
    action: '',
  });
  const [responseData, setResponseData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(25);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchData = async () => {
    try {
      // Send a request to the server with formData
      // For example:
      const response = await fetch('url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Logic for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = responseData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="mb-4">
        {/* Input fields for filtering data */}
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 mr-2"
          placeholder="Filter by Time"
        />
        <input
          type="text"
          name="action"
          value={formData.action}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 mr-2"
          placeholder="Filter by Action"
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Apply Filters
        </button>
      </div>
      <table className="border-collapse border border-gray-300 w-full">
        {/* Table headers */}
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Component Category</th>
            <th className="px-4 py-2">Component Name</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Entity</th>
          </tr>
        </thead>
        <tbody>
          {/* Rows for current page */}
          {currentRows.map((dataItem: any, index: number) => (
            <tr key={index}>
              <td className="border px-4 py-2">{dataItem.time}</td>
              <td className="border px-4 py-2">{dataItem.componentCategory}</td>
              <td className="border px-4 py-2">{dataItem.componentName}</td>
              <td className="border px-4 py-2">{dataItem.action}</td>
              <td className="border px-4 py-2">{dataItem.entity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastRow >= responseData.length}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FilterComponentTable;
