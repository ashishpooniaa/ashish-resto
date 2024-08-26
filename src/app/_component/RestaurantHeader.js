'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const RestaurantHeader = () => {
    const [details, setDetails] = useState();
    const router = useRouter();
    const pathName = usePathname();



    useEffect(() => {
        let data = localStorage.getItem("RestaurantUser");
        if (!data && pathName == "/restaurant/dashboard") {
            router.push("/restaurant");
        } else if (data && pathName == "/restaurant") {
            router.push("/restaurant/dashboard")
        } else {

            setDetails(JSON.parse(data));
        }
    },[])
    const logout = ()=>{
        localStorage.removeItem("RestaurantUser");
        router.push('/restaurant');
    }
    return (
        <header className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo Section */}
                <div>
                    <img
                        src='https://img.freepik.com/free-vector/sticker-template-with-delivery-man-motor-scooter_1308-76822.jpg?size=626&ext=jpg'
                        alt="Restaurant Logo"
                        className="w-24 h-24 object-cover rounded-full shadow-md"
                    />
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-6">
                    <Link href="/">
                        <h1 className="hover:text-indigo-300 transition duration-300">Home</h1>
                    </Link>
                    {
                        details && details.name ?
                            <> <h1 className=''>
                                <button onClick={logout} className="hover:text-indigo-300 transition duration-300">Logout</button>
                            </h1>
                                <Link href="/login">
                                    <h1 className="hover:text-indigo-300 transition duration-300">Profile</h1>
                                </Link>

                            </> : <Link href="/profile">
                                <h1 className="hover:text-indigo-300 transition duration-300">Login/SignUp</h1>
                            </Link>
                    }
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden flex items-center text-gray-300 hover:text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default RestaurantHeader;
