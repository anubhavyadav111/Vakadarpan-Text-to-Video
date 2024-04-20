import Image from 'next/image'
import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import About from '@/components/about'
import Gallery from '@/components/mag'
import Join from '@/components/join'
import Footer from '@/components/footer'

export default function Home() {

  return (
    <div className="min-h-screen">
      {/* <div>
        <Navbar />
      </div> */} 
      <div className='pt-32'>
        {<Hero/>} 
      </div>
      <div>
        <Gallery/>
      </div>
      <div className="mx-auto max-w-screen-xl mt-48">
        <About/>
      </div>
      <div className="mt-32 bg-black">
        <Join/>
      </div>
      <div className="pt-32 bg-black">
        <Footer/>
      </div>
      {/* <section className="bg-black">
        
      </section> */}
      
    </div>
  )
}
