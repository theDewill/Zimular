"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from './ui/separator'
import { useIndex } from '@/utils/IndexProvider'


const Sidenav = ({ toggleOutput }:any) => {
    return (
        <>
            <p className='p-2 text-lg font-medium'>Simulation Input</p>
            <Separator className='m-2'/>
            <div className="p-2">
                <Button onClick={toggleOutput} variant="default" className='w-full' >Input</Button>
            </div>
            <p className='p-2 text-lg font-medium'>Simulation Output</p>
            <Separator className='m-2'/>
            <div className="p-2">
                <Button variant="default" className='w-full' >Output</Button>
            </div>   
            <p className='p-2 text-lg font-medium'>ML Beta</p>
        </>
    )
}
export default Sidenav
