"use client";

import React from 'react'
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Nav = () => {
    const router = useRouter();
    const [token, setToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        const storedToken = window.localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout')
            console.log("Logout successful")
            window.localStorage.removeItem("token");
            router.push('/login')
            setToken(null);            
        } catch (error:any) {
            console.log(error.message)
        }
    }

    return (
        <nav className="bg-[#121212] flex justify-between items-center w-full pt-1 pb-2">
            <a href={token ? '/profile' : '/login'} className="flex gap-2 flex-center pl-5 pt-2 max-w-fit">
                <Image className="bg-[#ffffff] rounded-full object-contain"
                    src="/user.png"
                    alt="image not found"
                    width={30} 
                    height={30} 
                />
                <p className="font-bebas-neue-regular text-2xl">Rycho</p>
            </a>
            {token && (
                <div className="flex justify-end ">
                    <div className="bg-[#000000] rounded-full h-10 mt-2 w-10 mr-4 flex justify-center items-center">
                        <Image
                            src="/notification.png"
                            alt="image not found"
                            width={32}
                            height={12}
                        />
                    </div>
                    <button 
                        onClick={logout}
                        className="font-semibold rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 py-1.5 px-4 mt-3 mb-1 mr-10 text-sm">
                            Sign out
                    </button>        
                </div>   
            )}
        </nav>
    )
}

export default Nav