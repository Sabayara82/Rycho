import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
  return (
    <nav className="bg-[#121212] flex justify-between items-center w-full mb-16 pt-2 pb-4">
        <div className="flex gap-2 flex-center pl-5 pt-2 max-w-fit">
            <Image className="bg-[#ffffff] rounded-full object-contain"
                src="/user.png"
                alt="image not found"
                width={30} 
                height={30} 
            />
            <p className="font-semibold mt-1">Rycho Logo</p>
            
        </div>
        <div className="flex justify-end ">
            <Image className="h-7 mt-2.5 mr-4"
                src="/notification.png"
                alt="image not found"
                width={42} 
                height={32} 
            />
            <button className="font-semibold rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 py-1 px-5 mt-2 mr-10">
                Sign out
            </button>        
        </div>

        
    </nav>
  )
}

export default Nav