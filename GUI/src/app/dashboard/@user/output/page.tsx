"use client"

import React, { useState } from 'react'
import Tabs from '@/components/Tabs'
import Overview from './Overview';

function Out() {
  const [selectedOutput, setSelectedOutput] = useState('');

  const tabs = [
    { label: 'Overview', content: <div><Overview/></div> },
    { label: 'Chart', content: <div>Content of Tab 2</div> },
    { label: 'Test', content: <div>Content of Tab 3</div> },
  ];

  const handleOutputChange = (e:any) => {
    setSelectedOutput(e.target.value);
  };
  return (
    <div>
      <div className='flex flex-col items-end mb-2'>
        <select  
          value={selectedOutput} 
          onChange={handleOutputChange}
          name="output" 
          id="output" 
          className="bg-gray-200 rounded-lg px-4 py-2 outline-none">
          <option value="">Select Output</option>
          <option value="out1">Output 1</option>
          <option value="out2">Output 2</option>
        </select>
      </div>

      {selectedOutput && <Tabs tabs={tabs} />}
    </div>
  )
}

export default Out
