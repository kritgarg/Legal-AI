import  {NavbarDemo}  from "@/components/ui/Navbar";
import { HeroHighlightDemo } from '@/components/Hero'
import How from "@/components/How";
import Why from "@/components/Why"
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <>
    <NavbarDemo />
    <div className="relative w-full h-screen bg-black dark:bg-black overflow-hidden">
      {/* Hero Section */}
          
      <HeroHighlightDemo />

      {/* Radial fade overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)]"></div>
    </div>
         <div className="flex justify-center my-10">
        <How />
      </div>
         <div className="flex justify-center my-10">
        <Why />
      </div>
             <div className="flex justify-center my-10">
        <Footer/>
      </div>
    </>

  );
}
