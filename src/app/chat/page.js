import React from 'react'
import Chat from '@/components/chat'
import Footer from '@/components/Footer'
import Link from 'next/link'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200 hover:scale-105">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>
      
      <div className="flex-1">
        <Chat/>
      </div>
      <Footer />
    </div>
  )
}

export default page
