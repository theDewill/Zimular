import React from 'react';


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
