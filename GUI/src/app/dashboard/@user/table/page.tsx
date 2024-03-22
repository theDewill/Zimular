import DynamicColumnFilterTable from '@/components/tables/DynamicColumnFiltertable'
import FilterdbTable from '@/components/tables/FilterTable';
import React from 'react'

const headers = ['Time', 'Component Cat.', 'Component Name', 'Action', 'Entity'];
const data = [
  ['Row 1, Column 1', 'Row 1, Column 2', 'Row 1, Column 3', 'Row 1, Column 4', 'Row 1, Column 5'],
  ['Row 2, Column 1', 'Row 2, Column 2', 'Row 2, Column 3', 'Row 2, Column 4', 'Row 2, Column 5'],
  ['Row 3, Column 1', 'Row 3, Column 2', 'Row 3, Column 3', 'Row 3, Column 4', 'Row 3, Column 5'],
];

const Tablepg = () => {
  return (
    <div>
      <FilterdbTable />
    </div>
  )
}

export default Tablepg
