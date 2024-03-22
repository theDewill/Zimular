import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashLayout({ 
    user}:{
    user: React.ReactNode
}) {
    // const session = await getServerSession();
    // if (!session) {
    //     redirect('/');
    // }
    return (
        <div className=''>
            { user }
        </div>
    )
}
