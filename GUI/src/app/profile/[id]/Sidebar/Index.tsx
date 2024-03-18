import React from 'react'
import Link from 'next/link';
import Form from '../Form';


const Sidebar = () => {
  return (
    <div className='flex'>
      <div className='bg-white dark:gray-900 w-[400px] h-screen overflow-auto border-r border-gray-200 dark:border-gray-600 transition-all ease-in-out duration-500'>
        <div className='px-5'>
          <span className='dark:text-white font-extrabold text-2xl'>Zimular</span>
        </div>

        <ul className='px-3 mt-10 flex flex-col gap-2'>
          <span className='px-2 text-sm dark:text-white font-light'>Simulation Inputs</span>
          <li className='hover:bg-gray-500 hover:text-white my-2 py-4 px-2 rounded-lg transition-all ease-in-out duration-500'>
            <a href='#' className='flex flex-row gap-3 items-center'>Input_01</a>
          </li>
          <li className='hover:bg-gray-500 hover:text-white my-2 py-4 px-2 rounded-lg transition-all ease-in-out duration-500'>                              
            <a href='#' className='flex flex-row gap-3 items-center'>Input_02</a>
          </li> 
          <li className='hover:bg-gray-500 hover:text-white my-2 py-4 px-2 rounded-lg transition-all ease-in-out duration-500'>
            <a href='#' className='flex flex-row gap-3 items-center'>Input_03</a>
          </li>
        </ul>
        <ul className='px-3 mt-10 flex flex-col gap-2'>
          <span className='px-2 text-sm dark:text-white font-light'>Simulation Outputs</span>
          <li className='hover:bg-gray-500 hover:text-white my-2 py-4 px-2 rounded-lg transition-all ease-in-out duration-500'>
            <a href='#' className='flex flex-row gap-3 items-center'>Output_01</a>
          </li>
          <li className='hover:bg-gray-500 hover:text-white my-2 py-4 px-2 rounded-lg transition-all ease-in-out duration-500'>                              
            <a href='#' className='flex flex-row gap-3 items-center'>Output_02</a>
          </li> 
          <li className='hover:bg-gray-500 hover:text-white my-2 py-4 px-2 rounded-lg transition-all ease-in-out duration-500'>
            <a href='#' className='flex flex-row gap-3 items-center'>Output_03</a>
          </li>
          <li>
            <div className='flex space-x-4'>
              <button className='bg-blue-500 hover:bg-blue-700 text-white  py-1 px-4 rounded pl-3  '>
                <span className='dark:text-white '>Btn01</span>
              </button>
              <button className='bg-blue-500 hover:bg-blue-700 text-white  py-1 px-4 rounded pl-3   '>
                <span className='dark:text-white '>btn02</span>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <main className='w-full '>
        <nav className='w-full p-3 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900'>
          <div className='flex justify-end space-x-4 place-items-end'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white  py-1 px-4 rounded '>
              <span className='dark:text-white '>Profile</span>
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white  py-1 px-4 rounded  '>
              <span className='dark:text-white '>Connect</span>
            </button>
          </div>
        </nav>
        <nav className='w-full p-1 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900'>
          <div className='flex justify-end space-x-4 place-items-end'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded '>
              <span className='dark:text-white  '>Run</span>
            </button>
          </div>
        </nav>
        <div className='bg-slate-200 h-screen w-full overflow-auto'>
            <h1 className='text-3xl '>Input_01</h1>
              <div className='flex space-x-3 mt-5'>
                <Form/>
              </div>
        </div>
      </main>
    </div>
  )
}

export default Sidebar