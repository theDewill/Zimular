'use client';
import React, { useEffect, useState } from 'react'
import DetailsTable from '@/components/tables/DetailsTable';
import DynamicTable from '@/components/tables/Dynamictable';
import LineChartComponent from '@/components/charts/Linechrt';
import PieChartcomponent from '@/components/charts/Piechart';
import Card from '@/components/Card';

const workflowheaders = ['Workflow Name', 'Resource Count', 'Priority Res. Count', 'Premitive Res. Count', 'Container Count', 'Store', 'Priority Store', 'Filter Store', 'Custom'];

const workFlowHeadIter = ['workflow_name', 'res_count', 'prires_count', 'preeres_count' , 'cont_count' , 'store_count' , 'filstore_count' , 'pristore_count' , 'custom'];
const entityIter = ['entity_name', 'entity_count', 'percentage'];

const entityheaders = ['Entity name', 'Entity Count', 'Percentage'];

const overviewheaders = ['Workflow', 'Component Category', 'Component']



const detailtableData = [
    ['Row 1, Column 1', 'Row 1, Column 2'],
    ['Row 2, Column 1', 'Row 2, Column 2'],
    ['Row 3, Column 1', 'Row 3, Column 2'],
];

const workflowdata = [
  ['Row 1, Column 1', 'Row 1, Column 2', 'Row 1, Column 3', 'Row 1, Column 4', 'Row 1, Column 5'],
  ['Row 2, Column 1', 'Row 2, Column 2', 'Row 2, Column 3', 'Row 2, Column 4', 'Row 2, Column 5'],
  ['Row 3, Column 1', 'Row 3, Column 2', 'Row 3, Column 3', 'Row 3, Column 4', 'Row 3, Column 5'],
];

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



//let piedataf = Object.entries(pieLiterel).map(([name, value]) => ({ name: name.toString(), value: Math.round(value * 100) / 100 }));


let castData : any = {
  details : [],
  workflow_table : [],
  entity_table : [],
  LineChart : [],
  overview_table : [],
  pieLiterel : [],
};

let castDataJson : any = {};


const Overviewpg = () => {
  const [castDatanew, setCastData] = useState({ details: [], workflow_table: [], entity_table: [], overview_table : [] , LineChart : {} , pieLiterel : {}});

  useEffect(() => {


    castData = {details : [], workflow_table : [], entity_table : [], overview_table : [], LineChart : [], pieLiterel : []}
    async function fetchData() {
      const response = await fetch(`http://localhost:3005/sendSubReqs?uid=1&option=overview`);
      castDataJson = await response.json();
      castDataJson = castDataJson.data;
      console.log("casted json data : ",castDataJson);
      Object.keys(castDataJson.details).forEach((key) => {
        castData.details.push([key, castDataJson.details[key]]);
      });
      castDataJson.workflow_table.forEach((entry : any) => {
        let arr : any = [];
        Object.keys(entry).forEach((key) => {
          arr.push(entry[key]);
        });
        castData.workflow_table.push(arr);
      });

      castDataJson.entity_table.forEach((entry : any) => {
        let arr : any = [];
        Object.keys(entry).forEach((key) => {
          arr.push(entry[key]);
        });
        castData.entity_table.push(arr);
      });

      console.log("castDataJson.overview_table : ", JSON.parse(castDataJson.overview_table));
      console.log("castDataJson.workflow_table : ", castDataJson.workflow_table);

      JSON.parse(castDataJson.overview_table).forEach((entry : any) => {
        let arr : any = [];
        Object.keys(entry).forEach((key) => {
          arr.push(entry[key]);
        });
        castData.overview_table.push(arr);
      });

      
      //castDataJson.chart_1
      //TODO: check wether this comes as an array or object
      
      let jsdata = JSON.parse(castDataJson.chart_1)
      // Object.entries(pieLiterel).map(([name, value]) => ({ name: name.toString(), value: Math.round(value * 100) / 100 }));
      Object.keys(jsdata).forEach((rec : any) => {
        //castData.pieLiterel.push({name : rec, Value : Math.round(castDataJson.chart_1[rec] * 100) / 100});
        castData.pieLiterel.push({name : rec, Value : Math.round(jsdata[rec] * 100) / 100});

      });

      setCastData(castData);


      
      
    }
  
    fetchData();
  }, []);

  


  return (
    <div className='flex flex-col  gap-4 outline outline-offset-1 outline-2 outline-gray-500 mt-0 p-12 mx-1  rounded-lg'>
        <div>
            <div className='text-lg mb-2 font-semibold'>
                Details
            </div>
            <DetailsTable data={castDatanew.details}/>
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold mt-5'>
                Workflows
            </div>
            <DynamicTable headers = {workflowheaders} data={castDatanew.workflow_table}/>     
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold mt-5'>
                Entities
            </div>
            <DynamicTable headers = {entityheaders} data={castDatanew.entity_table}/>
        </div>

        <div className="flex justify-center gap-[120px] mt-5">
          <Card>
            <PieChartcomponent data={castDatanew.pieLiterel}/>
          </Card>
          {/* <Card>
            <LineChartComponent data={castDatanew.LineChart} />
          </Card> */}
        </div>
        <div>
            <div className='text-lg mb-2 font-semibold mt-5'>
                Overview
            </div>
            <DynamicTable headers = {overviewheaders} data={castDatanew.overview_table}/>
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
