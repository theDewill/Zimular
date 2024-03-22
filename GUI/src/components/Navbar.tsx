"use client";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" legacyBehavior passHref>
            <a className="text-white font-bold text-lg">Zimular</a>
          </Link>
        </div>
        {/* Navigation items */}
        <div className="flex items-center">
          <Link href="/" legacyBehavior passHref>
            <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Home</a>
          </Link>
          <Link href="/about" legacyBehavior passHref>
            <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">About</a>
          </Link>
          {!session ? (
            <>
              <Link href="/login" legacyBehavior passHref>
                <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Login</a>
              </Link>
              <Link href="/signup" legacyBehavior passHref>
                <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Signup</a>
              </Link>
            </>
          ):(
            <>
              <Link href="/dashboard" legacyBehavior passHref>
                <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Dashboard</a>
              </Link>
              <button onClick={()=> {
                signOut();
              }} className="text-white hover:bg-gray-700 px-3 py-2 rounded ">
                Sign Out
              </button>
            </>
          )}
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
