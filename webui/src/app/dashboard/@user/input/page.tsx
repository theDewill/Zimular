import React from 'react'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Inputform from '@/components/Inputform';

async function In() {
  const session = await getServerSession();
    if (!session) {
        redirect('/');
    }
  return (
    <div>
      <Inputform />
    </div>
  )
}
 
export default In
