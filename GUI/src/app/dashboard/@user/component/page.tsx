
import DynamicSelect from '@/components/DynamicSelection'
import LineChartComponent from '@/components/charts/Linechrt';
import MultiLineChartComponent from '@/components/charts/MultiLineBarAreachrt';
import DetailsTable from '@/components/tables/DetailsTable';
import FilterComponentTable from '@/components/tables/DynamicFiltertable';
import React from 'react'
import Card from '@/components/Card';

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

const chartdata = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Componentpg = () => {
  return (
    <>
      <div className='  outline outline-offset-1 outline-2 outline-gray-500 mt-0 p-12 mx-1  rounded-lg'>
        <div className='flex justify-between'>
          <div className='text-3xl font-semibold'>
            Component Name: {"Replace with Component Name"}
          </div>
          <div>
            
            <hr className=" border-black border-5 my-8" />
            
          </div>
          <div>
            <DynamicSelect options={options}/>
          </div>
        </div>
        <div className='m-4'>
          <DetailsTable data={tableData}/>
        </div>
        <div className='flex my-8 gap-[120px]'>
          <Card>
          <MultiLineChartComponent data={chartdata} />
          </Card>
          <Card>
          <LineChartComponent data={chartdata} />
          </Card>
        </div>
        <div>
          <FilterComponentTable />
        </div>
      </div>
    </>
  )
}

export default Componentpg;
