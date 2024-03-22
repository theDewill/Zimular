import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

import { getServerSession } from 'next-auth';
import  SessionProvider  from "@/utils/SessionProvider"
import Hero from './home/Hero';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zimular',
  description: 'Simulate Events with DES Principles',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>  
      </body>
    </html>
  )
}
