"use client"
    
import React from 'react';
import Dashform from '@/components/dashform';
import DashLayout from './Dashlayout';

const Dashbrd = () => {
    const [visibility, setVisibility] = React.useState('hidden');
    const toggleVisibility = () => {
        if(visibility === 'hidden'){
            setVisibility('');
        }else{
            setVisibility('hidden');
        }
    }
    return (
        <>
            <DashLayout toggleOutput={toggleVisibility}>
                <Dashform visible={visibility}/>
            </DashLayout>
        </>
    )
}

export default Dashbrd;
