import Link from 'next/link';
import React from 'react';

export default function dashLayout ({ children }: { children: React.ReactNode}) {

    return (
        <>
            <div className="flex gap-2">
                <div className="w-1/6 grow-0 shrink-0 flex flex-col gap-2">
                        <Link href="/dashboard/input" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300">
                            Simulation Input
                        </Link>
                        <Link href="/dashboard/output" className="block py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl-md hover:bg-gray-300">
                            Simulation Output
                        </Link>
                </div>
                <div className="w-5/6">
                    {children}
                </div>
            </div>
        </>
    )
}
