import React from 'react';


export default function Card ({ children }: {children : any}) {
  return (
    <div className="bg-white shadow-md rounded-md p-4 flex justify-center items-center">
      <div>{children}</div>
    </div>
  );
};
