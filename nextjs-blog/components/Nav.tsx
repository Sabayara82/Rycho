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
            {token && (
                <div className="flex justify-end ">
                    <Image className="h-6 mt-3 mr-4"
                        src="/notification.png"
                        alt="image not found"
                        width={32} 
                        height={12} 
                    />
                    <button 
                        onClick={logout}
                        className="font-semibold rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 py-1 px-5 mt-2 mr-10">
                            Sign out
                    </button>        
                </div>   
            )}
        </nav>
    )
}

export default Nav