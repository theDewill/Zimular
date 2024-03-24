"use client";
import DynamicSelect from '@/components/DynamicSelection2';
import Link from 'next/link';
import React, { ReactElement, cloneElement, useEffect, useState } from 'react';
import DashboardContext, { DashboardProvider, useDashboard } from '@/app/dashContext';

const options = [
    { value: '', label: 'Output' },
    { value: 'out1', label: 'Output 1' },
    { value: 'out2', label: 'Output 2' },
  ];

let castData : any = {
    options : []
}

const terminateSim = async () => {
    const response = await fetch(`http://localhost:3005/terminateSim?uid=1`);
}

//export default function dashLayout ({ children }: { children: React.ReactNode}) {
export default function dashLayout ({ children }: { children: ReactElement | ReactElement[]}) {

    const [optionTypek, setOptionTypek] = useState('');

    const enhanceChildren = () => {
        return React.Children.map(children, child => {
          // You can pass specific properties or the whole state
          console.log("option type is before clone element ", optionTypek);
          return cloneElement(child, { option: optionTypek });
        });
      };

    const [castDatanew, setCastData] = useState({ tableData: [],data: [] , chartdata: [] , options : [], mlchartdata: [], lnchartdata: [] });
  
  const [count, setCount] = useState(0);
  //const [optionType, setoptionType] = useState('');
  let castDataJson : any = {};

  
  let handleOptionChange = (optionValue : any) => {
    console.log("option value is ", optionValue);
        
        setOptionTypek(optionValue);

      }

    useEffect(()=>{

        castData = { options : []};
        async function fetchData() {

            if (count == 0) {
              
            const response = await fetch(`http://localhost:3005/getSesList?uid=1`);
            castDataJson = await response.json();
            castDataJson = castDataJson.sesset; //this is an Array...
           
            //TODO: check wether this comes as an array or object
            castDataJson.forEach((entry : any) => {
              let option = { value : entry.ses_id, label: `session_${entry.ses_id}`};
              castData.options.push(option);
            });
      
            setOptionTypek(castData.options[0].value);
            setCount(1);

          } else {
            console.log("inside else");
      
          const responsetmp = await fetch(`http://localhost:3005/getSesList?uid=1`);
            castDataJson = await responsetmp.json();
            castDataJson = castDataJson.sesset; //this is an Array...
             console.log("casted json data for output list : ",castDataJson);
            
            
            //TODO: check wether this comes as an array or object
            castDataJson.forEach((entry : any) => {
                let option = { value : entry.ses_id, label: `session_${entry.ses_id}`};
                castData.options.push(option);
              });
      

      
            setCastData(castData);
            
            
          }}
        
          fetchData();
    },[count, optionTypek]);



    return (
        <>
        <div className='m-4'>
            <div className="flex flex-col gap-2">
                <div className=" grow-0 shrink-0 flex justify-between">
                        <div className=" grow-0 shrink-0 flex gap-2">
                            <Link href="/dashboard/input" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300 focus:bg-gray-800  focus:text-white">
                                Input
                            </Link>
                            <Link href="/dashboard/overview" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300 focus:bg-gray-800  focus:text-white">
                                Overview
                            </Link>
                            <Link href="/dashboard/component" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300 focus:bg-gray-800  focus:text-white">
                                Component
                            </Link>
                            <Link href="/dashboard/table" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300 focus:bg-gray-800  focus:text-white">
                                Table
                            </Link>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={terminateSim}
                            >
                                Terminate
                            </button>
                            <DynamicSelect options={castDatanew.options} stateManager={handleOptionChange}/>
                        </div>
                        
                </div>
                <div>
                <DashboardContext.Provider value={{ optionTypek, setOptionTypek }}>
            <div className='m-4'>
                {/* Your layout JSX */}
                {enhanceChildren()}
            </div>
        </DashboardContext.Provider>
                </div>
            </div>
        </div>
        </>
    )
}
