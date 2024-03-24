import React from 'react'
import Link from 'next/link';
import Hcard from '@/components/hcard';
import simpy from '@/assests/Simpy.jpg';
import code from '@/assests/code.jpg';
import front from '@/assests/front.jpg';
import NewSection from '@/components/hsection';
import Footer from '@/components/footer';

const Hero = () => {
  return (
    <div className='bg-blue-950 '>
        <div className='flex items-center justify-center h-screen  bg-fixed bg-center bg-cover custom-img overflow-hidden'>
          
          
          <div className='p-5 text-white z-[2] mt-[-3rem]'>
            <h2 className='text-5xl font-bold'>Zimular</h2>
            <p className='py-5 text-xl text-justify'>Welcome to our website! Discover the shortest path to efficiency
            <br></br> with our innovative workload simulation tool.
            Predict and optimize task durations effortlessly,<br></br>
            ensuring a streamlined workflow. Experience the future of productivity – <br></br>
            start simulating your workload today!</p>
            <div className='flex space-x-4'>
                <Link href="/login"><button className='px-8 py-2 border' >Start Now!</button></Link>
                <button className='space-x-4 px-8 py-2 border'>Read Me First</button>
            </div>
          </div>
          
        </div>
        <NewSection/>
        <div className="flex gap-[80px] p-[100px] justify-center">
          <Hcard
            title="Powered By SimPy"
            subtitle="Built with SimPy, a Python simulation framework, our application utilizes its capabilities to model and simulate complex systems."
            image={simpy}
            more='Learn more about SimPy'
          />
          <Hcard
            title="Comprehensive Discrete event Simulation Framework"
            subtitle="Create a comprehensive framework that enables monitoring of the simulation, allowing users to visualize and analyze simulation data"
            image={code}
            more=''
          />
          <Hcard
            title="Streamlined Development Process"
            subtitle="Streamline the development process by providing a set of tools and utilities that simplify the creation and modification of simulations."
            image={front}
            more=""
          />

        </div>
        <Footer/>
    </div>
  )
}

export default Hero