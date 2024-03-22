"use client";
import React, { useState } from 'react';

interface FormData {
  time: string;
  componentCategory: string;
  componentName: string;
  action: string;
  entity: string;
}

const FilterdbTable: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    time: '',
    componentCategory: '',
    componentName: '',
    action: '',
    entity: '',
  });
  const [responseData, setResponseData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);

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
        <div className="flex gap-3">
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
          placeholder="Time"
        />
        <input
          type="text"
          name="componentCategory"
          value={formData.componentCategory}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
          placeholder="Component Category"
        />
        <input
          type="text"
          name="componentName"
          value={formData.componentName}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
          placeholder="Component Name"
        />
        <input
          type="text"
          name="action"
          value={formData.action}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
          placeholder="Action"
        />
        <input
          type="text"
          name="entity"
          value={formData.entity}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
          placeholder="Entity"
        />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={fetchData}
        >
          Fetch Data
        </button>
      </div>
      <table className="border-collapse border border-gray-300 w-full">
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

export default FilterdbTable;
