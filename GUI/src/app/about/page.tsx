import React from 'react'
import  developersData  from '@/components/developer';
function page() {
  return (
    <div className='h-screen  bg-fixed bg-center bg-cover custom-img overflow-hidden'>
    <div className="container mx-auto p-8 "> 
      <h1 className="text-3xl font-bold mb-4 text-white">About Our Zimular</h1>
      <p className="text-lg text-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil reprehenderit nulla sunt velit dolore ipsa odio, impedit placeat necessitatibus aperiam corporis perferendis dignissimos corrupti repellat nesciunt repellendus soluta aliquid ab.
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

