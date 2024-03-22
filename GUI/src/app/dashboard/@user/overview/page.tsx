import React from 'react'
import DetailsTable from '@/components/tables/DetailsTable';
import DynamicTable from '@/components/tables/Dynamictable';
import LineChartComponent from '@/components/charts/Linechrt';
import PieChartcomponent from '@/components/charts/Piechart';
import Card from '@/components/card';

const detailtableData = [
    ['Row 1, Column 1', 'Row 1, Column 2'],
    ['Row 2, Column 1', 'Row 2, Column 2'],
    ['Row 3, Column 1', 'Row 3, Column 2'],
];

const workflowheaders = ['Workflow Name', 'Resource Count', 'Priority Res. Count', 'Premitive Res. Count', 'Container Count', 'Store', 'Priority Store', 'Filter Store', 'Custom'];
const workflowdata = [
  ['Row 1, Column 1', 'Row 1, Column 2', 'Row 1, Column 3', 'Row 1, Column 4', 'Row 1, Column 5'],
  ['Row 2, Column 1', 'Row 2, Column 2', 'Row 2, Column 3', 'Row 2, Column 4', 'Row 2, Column 5'],
  ['Row 3, Column 1', 'Row 3, Column 2', 'Row 3, Column 3', 'Row 3, Column 4', 'Row 3, Column 5'],
];

const entityheaders = ['Entity name', 'Entity Count', 'Percentage'];
const entitydata = [
  ['Row 1, Column 1', 'Row 1, Column 2', 'Row 1, Column 3'],
  ['Row 2, Column 1', 'Row 2, Column 2', 'Row 2, Column 3'],
  ['Row 3, Column 1', 'Row 3, Column 2', 'Row 3, Column 3'],
];

const data = [
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

let pieLiterel = {
  "resource": 83.33333333333334,
  "piorityresource": 0.0,
  "peemptiveresource": 0.0,
  "container": 0.0,
  "store": 16.666666666666664,
  "filterstore": 0.0,
  "prioritystore": 0.0,
  "custom": 0.0
}

let piedata = Object.entries(pieLiterel).map(([name, value]) => ({ name: name.toString(), value: Math.round(value * 100) / 100 }));

const Overviewpg = () => {
  return (
    <div className='flex flex-col items-center gap-4 outline outline-offset-1 outline-2 outline-gray-500 mt-0 p-12 mx-1  rounded-lg'>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Details
            </div>
            <DetailsTable data={detailtableData}/>
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Workflows
            </div>
            <DynamicTable headers = {workflowheaders} data={workflowdata}/>     
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Entities
            </div>
            <DynamicTable headers = {entityheaders} data={entitydata}/>
        </div>
        <div className="flex justify-around gap-[120px]">
          <Card>
            <PieChartcomponent data={piedata}/>
          </Card>
          <Card>
            <LineChartComponent data={data} />
          </Card>
        </div>


    </div>
  )
}

export default Overviewpg

function GridItem({ title, children }: { title: string; children: any }) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-slate-900 rounded-xl h-[400px]">
        <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
        {children}
      </div>
    );
  }
