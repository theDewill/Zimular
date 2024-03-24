import Link from 'next/link';
import React from 'react';

export default function Userdash (){
    return (
        
        <div>
            <div className='flex items-center justify-center h-screen  bg-fixed bg-center bg-cover bg-blue-950 overflow-hidden'>
                <div className='p-5 text-white z-[2] mt-[-3rem]'>
                    <h2 className='text-5xl font-bold'>Zimular</h2>
                    <p className='py-5 text-xl text-justify'>Welcome to our website! Discover the shortest path to efficiency
                        <br></br> with our innovative workload simulation tool.
                            Predict and optimize task durations effortlessly,<br></br>
                            ensuring a streamlined workflow. Experience the future of productivity – <br></br>
                            start simulating your workload today!</p>
                <div className='flex space-x-4'>
                    <Link href="/dashboard/input"><button className='px-8 py-2 border' >Start Zimular!</button></Link>
                </div>
                </div>
             </div>
        </div>
    )
}
