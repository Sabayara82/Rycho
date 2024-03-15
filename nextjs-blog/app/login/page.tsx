"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect } from 'react';
import {useRouter} from "next/navigation";


export default function page() {
    const CLIENT_ID = "f9010a7f16bd4939a67261cce4b5cc6f"
    const REDIRECT_URI = "http://localhost:3000/profile"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const router = useRouter();

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })  

    const onLogin = async () => {
      try {
        const response = await axios.post("/api/users/login", user);
        console.log("Login success", response.data);
        router.push("/profile");
      } catch (error:any) {
        console.log("Login failed", error.message);
      }
    }

    useEffect(() => {
      if(user.email.length > 0 && user.password.length > 0) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }, [user]);
    

    return (
      <div className="flex flex-col items-center justify-center bg-[#121212] max-w-96 min-h-96 mx-auto rounded-3xl mt-52">
        <h1 className="text-4xl font-semibold text-center mb-8">Login</h1>
        <input
            className="p-1.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="Email"
        />
        <input
            className="p-1.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="Password"
        />
        <button 
          onClick={onLogin}
          disabled={buttonDisabled}
          className={`p-1.5 px-5 rounded-lg mb-4 mt-6 border border-gray-600
            ${!buttonDisabled ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500" : "text-gray-600"}`}>       
            Login
        </button>
        <a className="underline" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login with Spotify</a>
        <div className="text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="underline">
                  Sign Up
                </Link>
            </div>
    </div>
    )
}
