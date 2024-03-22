import React from 'react'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Inputform from '@/components/Inputform';

function In() {
  return (
    <div className='outline outline-offset-1 outline-2 outline-gray-500 mt-0 p-12 mx-1  rounded-lg'>
      <Inputform />
    </div>
  )
}
 
export default In
