import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Userdash (){
    const session = await getServerSession();
    if (!session) {
        redirect('/');
    }
    return (
        <div>
            Userdash
        </div>
    )
}
