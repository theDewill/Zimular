
import DynamicSelect from '@/components/DynamicSelection'
import LineChartComponent from '@/components/charts/Linechrt';
import MultiLineChartComponent from '@/components/charts/MultiLineBarAreachrt';
import DetailsTable from '@/components/tables/DetailsTable';
import DynamicFilterTable from '@/components/tables/DynamicFiltertable';
import React from 'react'

const options = [
  { value: '', label: 'Components' },
  { value: 'out1', label: 'Component 1' },
  { value: 'out2', label: 'Component 2' },
];
const tableData = [
  ['Row 1, Column 1', 'Row 1, Column 2'],
  ['Row 2, Column 1', 'Row 2, Column 2'],
  ['Row 3, Column 1', 'Row 3, Column 2'],
];

const headers = ['Time', 'Component Cat.', 'Component Name', 'Action', 'Entity'];
const data = [
  ['Row 1, Column 1', 'Row 1, Column 2', 'Row 1, Column 3', 'Row 1, Column 4', 'Row 1, Column 5'],
  ['Row 2, Column 1', 'Row 2, Column 2', 'Row 2, Column 3', 'Row 2, Column 4', 'Row 2, Column 5'],
  ['Row 3, Column 1', 'Row 3, Column 2', 'Row 3, Column 3', 'Row 3, Column 4', 'Row 3, Column 5'],
];

const Componentpg = () => {
  return (
    <>
      <div className='mt-8 mx-12'>
        <div className='flex justify-between'>
          <div className='text-3xl font-semibold'>
            Component Name: {"Replace with Component Name"}
          </div>
          <div>
            <DynamicSelect options={options}/>
          </div>
        </div>
        <div className='m-4'>
          <DetailsTable data={tableData}/>
        </div>
        <div className='flex my-8'>
          <MultiLineChartComponent />
          <LineChartComponent />
        </div>
        <div>
          <DynamicFilterTable headers={headers} data={data}/>
        </div>
      </div>
    </>
  )
}

export default Componentpg;
