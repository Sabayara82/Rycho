"use client";

import React from 'react'
import axios from 'axios';
import Image from 'next/image';
import Nav from '@components/Nav';
import { useRouter } from 'next/navigation';

const NavWrapper = () => {
    const router = useRouter();

    return (
        <nav className="bg-[#121212] flex justify-between items-center w-full pt-2 pb-4">
            <div className="flex gap-2 flex-center pl-5 pt-2 max-w-fit">
                <Image className="bg-[#ffffff] rounded-full object-contain"
                    src="/user.png"
                    alt="image not found"
                    width={30} 
                    height={30} 
                />
                <p className="font-semibold mt-1">Rycho Logo</p>
                
            </div>
            {/* <Nav/> */}
        </nav>
    )
}

export default NavWrapper