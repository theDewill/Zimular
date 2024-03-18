// components/Layout.tsx
"use client"

import Sidenav from '@/components/side-nav';
import { IndexProvider } from '@/utils/IndexProvider';
import React from 'react';


const DashLayout: React.FC<{ children: React.ReactNode }> = (attr) => {

  const [showOutput, setShowOutput] = React.useState(false);

  const toggleOutput = () => {
    setShowOutput(!showOutput);
  };

  return (
    <div className='flex '>
      {/* Sidebar */}
      <div className='basis-1/6 grow-0 shrink-0'>
        {/* Sidebar content */}
        <Sidenav toggleOutput={attr.toggleOutput}/>
      </div>
      {/* Main content */}
      <div className='flex-1'>
        {/* Main content */}
        {attr.children}
      </div>
    </div>
  );
};

export default DashLayout;
