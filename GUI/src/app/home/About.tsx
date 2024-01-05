import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    
    <section id='about'>
      <div className="flex flex-wrap lg:items-center ">
        <div className="lg:w-1/2 border-4 border-solid border-blue-500 rounded-lg">
          <img src='./gp.jpeg' ></img>
        </div>
        <div className='lg:w-1/2'>
          <h2 className='lg:ml-12 lg:text-3xl font-bold mt-5 mb-5'>About Us</h2>
          <p className='lg:ml-12 mb-5 lg:text-xl text-white'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque ut optio numquam fugiat officiis ipsum repudiandae harum quidem est impedit laudantium incidunt amet cumque, perspiciatis, soluta molestiae at vel assumenda!</p>
          <button className='lg:ml-12 px-2 py-1 bg-blue-500 text-sm lg:px-4 lg:py-2 lg:text-xl text-white hover:bg-blue-600'>Contact Us</button>
        </div>
      </div>
    </section>
  )
}

export default About