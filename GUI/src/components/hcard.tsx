import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  subtitle: string;
  image: string; 
}

const Hcard: React.FC<CardProps> = ({ title, subtitle, image }) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden w-[400px] h-full bg-slate-200 ">
      <Image
        src={image}
        alt={title}
        layout='responsive'
        
        
        className="object-cover w-[400px] h-[100px]"
      />
      <div className="p-4 ">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-black">{subtitle}</p>
      </div>
      
    </div>
  );
};

export default Hcard;
