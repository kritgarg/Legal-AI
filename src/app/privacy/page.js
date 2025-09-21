import React from 'react'
import  {NavbarDemo}  from "@/components/ui/Navbar";
import Footer from "@/components/Footer";
import Privacy from '@/components/Privacy';

const page = () => {
  return (
    <div>
      <NavbarDemo />
      <div className='mt-[30px]'>
        <Privacy />
      </div>
      <Footer />
    </div>
  )
}

export default page


