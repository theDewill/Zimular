import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashLayout({ 
    user}:{
    user: React.ReactNode
}) {
    
    return (
        <div className=''>
            { user }
        </div>
    )
}
