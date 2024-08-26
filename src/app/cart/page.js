'use client'
import React, { useState, useEffect } from 'react'
import CustomerHeader from '../_component/CustomerHeader';
import RestaurantFooter from '../_component/RestaurantFooter';
import { DELIVERY_CHARGES, TAX } from '../lib/constant';
import { useRouter } from 'next/navigation';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-100 to-yellow-100">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
                <div className="absolute top-1 left-1 w-full h-full border-4 border-t-4 border-transparent border-t-yellow-500 rounded-full animate-spin delay-200"></div>
                <div className="absolute top-2 left-2 w-full h-full border-4 border-t-4 border-transparent border-t-red-500 rounded-full animate-spin delay-400"></div>
            </div>
        </div>
    );
};

const Page = () => {
    const [cartStorage, setCartStorage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartStorage(storedCart);
        setLoading(false);
    }, []);

    const total = cartStorage.reduce((acc, item) => acc + item.price, 0);
    
    const removeFromCart = (id) => {
        const updatedCart = cartStorage.filter(item => item._id !== id);
        setCartStorage(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    const router = useRouter();

    const orderNow = ()=>{
        if(JSON.parse(localStorage.getItem('user'))){
            router.push('/order')
        }else{
            router.push('/user-auth?order=true')
        }
        
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-100 to-yellow-100">
            <CustomerHeader />
            <div className="container mx-auto p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cartStorage.length > 0 ? (
                        cartStorage.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
                                <img src={item.img_path} alt={item.name} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                                <h3 className="text-2xl font-semibold text-pink-700">{item.name}</h3>
                                <p className="text-gray-600 mt-2">{item.description}</p>
                                <p className="text-gray-900 font-bold mt-4">{item.price} Rs.</p>
                                <button 
                                    onClick={() => removeFromCart(item._id)} 
                                    className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-full mt-4 hover:from-red-600 hover:to-red-800 transition-all duration-300"
                                >
                                    Remove From Cart
                                </button>
                            </div>
                        ))
                    ) : (
                        <h1 className="col-span-full text-center text-gray-800 text-2xl">No Food Items Available</h1>
                    )}
                </div>
            </div>

            {cartStorage.length > 0 && (
                <div className="bg-white shadow-lg p-8 mt-8 rounded-xl">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-800">
                            <div className="flex justify-between">
                                <span className="font-semibold text-lg">Food Charges:</span>
                                <span className="font-medium">{total} Rs.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-lg">Tax ({TAX}%):</span>
                                <span className="font-medium">{(total * TAX / 100).toFixed(2)} Rs.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-lg">Delivery Charges:</span>
                                <span className="font-medium">{DELIVERY_CHARGES} Rs.</span>
                            </div>
                            <div className="font-bold text-xl flex justify-between">
                                <span>Total Amount:</span>
                                <span>{(total + DELIVERY_CHARGES + (total * TAX / 100)).toFixed(2)} Rs.</span>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <button onClick={orderNow} className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-8 rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-300">
                                Order Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <RestaurantFooter />
        </div>
    )
}

export default Page;
