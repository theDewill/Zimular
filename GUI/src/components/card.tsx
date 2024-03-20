import React from 'react';

function Card({  title, description }) {
  return (
    <div className="max-w-md mx-auto bg-black rounded-xl shadow-md overflow-hidden md:max-w-2xl h-[350px]">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {title}
          </div>
          <p className="block mt-1 text-sm leading-tight font-normal text-white">
            {description}
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default Card;
