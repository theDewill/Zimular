import React from 'react';


export default function Card ({ children }: {children : any}) {
  return (
    <div className="bg-slate-100 shadow-lg rounded-md p-4 flex justify-center items-center">
      <div>{children}</div>
    </div>
  );
};
