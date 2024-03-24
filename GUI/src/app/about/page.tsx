import React from 'react'
import  developersData  from '@/components/developer';
function page() {
  return (
    <div className='h-screen  bg-fixed bg-center bg-cover custom-img overflow-hidden'>
    <div className="container mx-auto p-8 "> 
      <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Our Innovative Workload Simulation Tool</h1>
      <p className="text-lg text-white">
      At Zimular, we're dedicated to revolutionizing the way you manage your tasks and projects. With our groundbreaking workload simulation tool, predicting and optimizing task durations has never been easier. 

      Imagine effortlessly ensuring a streamlined workflow, where every task is executed with precision and efficiency. Our tool empowers you to experience the future of productivity firsthand.

      Gone are the days of guesswork and uncertainty. With our advanced simulation technology, you can start simulating your workload today and unlock unparalleled insights into your operations.

      Discover a new era of productivity with Zimular. Join us as we redefine the possibilities of task management and propel your business towards unprecedented success.
      </p>

      {/* Developer Table */}
      <section className="mt-8"> 
        <h2 className="text-2xl font-bold mb-4 text-white">Our Team</h2>
        <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full min-w-max">
          <thead>
            <tr className='odd:bg-white'>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Skills</th>
            </tr>
          </thead>
          <tbody>
            {developersData.map((developer) => (
              <tr className='odd:bg-white even:bg-gray-100' key={developer.name}>
                <td className="border px-4 py-2">{developer.name}</td>
                <td className="border px-4 py-2">{developer.role}</td>
                <td className="border px-4 py-2">{developer.skills}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
    </div>
  );
};

export default page