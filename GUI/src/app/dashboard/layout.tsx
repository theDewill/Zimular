import React from 'react';
import { useSession } from "next-auth/react"

export default function DashLayout({ 
    user}:{
    user: React.ReactNode
}) {
    
    return (
        <div className='m-4'>
            
            { user }
        </div>
    )
}
