import React from 'react'

const Contact = () => {
  return (
    
    <section id='contact'>
      <div className="flex justify-center items-center h-screen ">
        <div className="w-500  p-6 shadow-lg bg-white rounded-md">
          <div className='max-w-[1240px] m-auto p-4  '>
              <h1 className='text-2xl font-bold text-center p-4'>Contact Us</h1>
              <form className='max-w-[600px] m-auto'>
                  <div className='grid grid-cols-2 gap-2'>
                      <input className='border shadow-lg p-3' type="text" placeholder='Name' />
                      <input className='border shadow-lg p-3' type="email" placeholder='Email' />
                  </div>
                  <input className='border shadow-lg p-3 w-full my-2' type="text" placeholder='Subject' />
                  <textarea className='border shadow-lg p-3 w-full'  placeholder='Message'></textarea>
                  <button className='border shadow-lg p-3 w-full mt-2'>Submit</button>
              </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact