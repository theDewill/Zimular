import DynamicSelect from '@/components/DynamicSelection';
import Link from 'next/link';
import React from 'react';

const options = [
    { value: '', label: 'Output' },
    { value: 'out1', label: 'Output 1' },
    { value: 'out2', label: 'Output 2' },
  ];
export default function dashLayout ({ children }: { children: React.ReactNode}) {

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className=" grow-0 shrink-0 flex justify-between">
                        <div className=" grow-0 shrink-0 flex gap-2">
                            <Link href="/dashboard/input" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300">
                                Input
                            </Link>
                            <Link href="/dashboard/overview" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300">
                                Overview
                            </Link>
                            <Link href="/dashboard/component" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300">
                                Component
                            </Link>
                            <Link href="/dashboard/table" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300">
                                Table
                            </Link>
                        </div>
                        <div>
                            <DynamicSelect options={options}/>
                        </div>
                        
                </div>
                <div>
                    {children}
                </div>
            </div>
        </>
    )
}
