import React from 'react'
import DetailsTable from '@/components/tables/DetailsTable';
import DynamicTable from '@/components/tables/Dynamictable';
import LineChartComponent from '@/components/charts/Linechrt';
import PieChartcomponent from '@/components/charts/Piechart';
const tableData = [
    ['Row 1, Column 1', 'Row 1, Column 2'],
    ['Row 2, Column 1', 'Row 2, Column 2'],
    ['Row 3, Column 1', 'Row 3, Column 2'],
];

const workflowheaders = ['Workflow Name', 'Resource Count', 'Priority Res. Count', 'Premitive Res. Count', 'Container Count', 'Store', 'Priority Store', 'Filter Store', 'Custom'];
const data = [
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
const Overviewpg = () => {
  return (
    <div className='mx-12 flex flex-col items-center gap-4'>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Details
            </div>
            <DetailsTable data={tableData}/>
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Workflows
            </div>
            <DynamicTable headers = {workflowheaders} data={data}/>     
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Entities
            </div>
            <DynamicTable headers = {entityheaders} data={entitydata}/>
        </div>
        <div className="flex justify-around gap-3">
          <PieChartcomponent />
          <LineChartComponent />
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
