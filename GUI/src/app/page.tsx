import Image from 'next/image'
import Hero from './home/Hero'
import Contact from './home/Contact'
import Navbar from './home/Navbar'


export default function Home() {
  return (
    <main >
      <Navbar/>
      <Hero/>
      <Contact/>
    </main>
  )
}
