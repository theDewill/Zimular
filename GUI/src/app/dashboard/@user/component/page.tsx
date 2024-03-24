'use client'
import DynamicSelect from '@/components/DynamicSelection'
import LineChartComponent from '@/components/charts/Linechrt';
import MultiLineChartComponent from '@/components/charts/MultiLineBarAreachrt';
import DetailsTable from '@/components/tables/DetailsTable';
import FilterComponentTable from '@/components/tables/DynamicFiltertable';
import React, { useEffect, useState } from 'react'
import Card from '@/components/Card';
import { set } from 'mongoose';
import { useRouter } from 'next/router';
import { useDashboard } from '@/app/dashContext';



const headers = ['Time', 'Component Cat.', 'Component Name', 'Action', 'Entity'];



const chartdata = [
  {
    amount: 1000,
    time: 1000,
  },
  {
    amount: 200,
    time: 3000,
    
  }
];

let castData : any = { 
  tableData: [], 
  data: [], 
  mlchartdata: [] ,
  lnchartdata: [] ,
  options : []
};

let castDataJson : any = {};

const Componentpg = ({ option }) => {

  //const { optionTypek , setOptionTypek } = useDashboard();

  // const router = useRouter();
  // const { query } = router;
  //console.log("component options from child element:" , optionTypek);
  
  const [castDatanew, setCastData] = useState({ tableData: [],data: [] , chartdata: [] , options : [], mlchartdata: [], lnchartdata: [] });
  
  const [count, setCount] = useState(0);
  const [optionType, setoptionType] = useState('');
  const [catType, setCatType] = useState('');


  // const [onEvent, setOnEvent] = useState(() => (optionValue : any) => {
  //   setoptionType(optionValue.com_name);
  //     setCatType(optionValue.com_cat);
  // });
  let handleOptionChange = (optionValue : any) => {
    console.log("option value is ", optionValue.com_name, optionValue.com_cat);
        
        setoptionType(optionValue.com_name);
        setCatType(optionValue.com_cat);
      }
  useEffect(() => {

    castData = { tableData: [], data: [], chartdata: [], options : [] , mlchartdata: [], lnchartdata: []};
    
    async function fetchData() {

      if (count == 0) {
        
        
      const response = await fetch(`http://localhost:3005/sendSubReqs?uid=1&option=component`);
      castDataJson = await response.json();
      castDataJson = castDataJson.data; //this is an Array...
     
      
      //TODO: check wether this comes as an array or object
      castDataJson.forEach((entry : any) => {
        let option = { value : {com_name : entry.component_name , com_cat :entry.component_catgory}, label: `${entry.component_name} (${entry.component_catgory})`};
        castData.options.push(option);
      });

      setoptionType(castData.options[0].value.com_name);
      setCatType(castData.options[0].value.com_cat);
      setCount(1);
    } else {
      console.log("inside else and executing the new url :", `http://localhost:3005/sendSubReqs?uid=1&option=component` );

    const responsetmp = await fetch(`http://localhost:3005/sendSubReqs?uid=1&option=component`);
      castDataJson = await responsetmp.json();
      castDataJson = castDataJson.data; //this is an Array...
       console.log("casted json data for component not onecompo : ",castDataJson);
      
      
      //TODO: check wether this comes as an array or object
      castDataJson.forEach((entry : any) => {
        let option = { value : {com_name : entry.component_name , com_cat :entry.component_catgory}, label: `${entry.component_name} (${entry.component_catgory})`};
        castData.options.push(option);
      });

      console.log("new link query with ", catType, optionType);
      const response = await fetch(`http://localhost:3005/sendSubReqs?uid=1&option=onecomponent&cat=${catType}&compname=${optionType}`);
      let onecomponent = await response.json();
      onecomponent = onecomponent.data; //this is an Array...
      console.log("casted json data for component : ",onecomponent);

      //TODO: UPTO HERE DONE ////

      
      Object.keys(onecomponent).forEach((key : any) => {
          if(!key.includes("chart")){
            let arr : any = [];
          arr.push(key);
          arr.push(onecomponent[key]);
        castData.tableData.push(arr);
      }
      });

  

      if(catType == 'resources'){
        console.log("inside resources", typeof(onecomponent.resource_queued_time_chart));
        onecomponent.resource_queued_time_chart.forEach((pnt : any) => {
          let point = {
            time : pnt[0],
            amount : pnt[1]
          }
          castData.mlchartdata.push(point);
        });

        
      } else if (catType == 'store'){
        
        onecomponent.store_put_time_chart.forEach((pnt : any) => {
          let point = {
            time : pnt[0],
            amount : pnt[1]
          }
          castData.mlchartdata.push(point);
        
        })
      } else {
        onecomponent.container_put_time_chart.forEach((pnt : any) => {
          let point = {
            time : pnt[0],
            amount : pnt[1]
          }
          castData.mlchartdata.push(point);
        });
      }

    
      setCastData(castData);
      
      
    }}
  
    fetchData();
  }, [count, optionType, catType]);

  return (
    <>
      <div className='  outline outline-offset-1 outline-2 outline-gray-500 mt-0 p-12 mx-1  rounded-lg'>
        <div className='flex justify-between'>
          <div className='text-3xl font-semibold'>
            Component Name: {optionType}
          </div>
          <div>
            
            <hr className=" border-black border-5 my-8" />
            
          </div>
          <div>
            <DynamicSelect options={castDatanew.options} stateManager={handleOptionChange}/>
          </div>
        </div>
        <div className='m-4'>
          <DetailsTable data={castDatanew.tableData}/>
        </div>
        <div className='flex my-8 gap-[120px] justify-center'>
          <Card>
          <MultiLineChartComponent data={castDatanew.mlchartdata} />
          </Card>
          {/* <Card>
          <LineChartComponent data={castDatanew.lnchartdata} />
          </Card> */}
        </div>
        <div>
          <FilterComponentTable componame={optionType}/>
        </div>
      </div>
    </>
  )
}

export default Componentpg;
