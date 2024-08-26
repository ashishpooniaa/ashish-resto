'use client'
import React, { useState, useEffect } from 'react';
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
    const [userStorage, setUserStorage] = useState(null);
    const [cartStorage, setCartStorage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clearCart, setClearCart] = useState(false);
    const router = useRouter();

    // Fetch user and cart data from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setUserStorage(storedUser);
        setCartStorage(storedCart);
        setLoading(false);
    }, []);

    // Calculate total amount
    const total = cartStorage.reduce((acc, item) => acc + item.price, 0);

    // Redirect if cart is empty
    useEffect(() => {
        if (!loading && total === 0) {
            router.push('/');
        }
    }, [loading, total, router]);

    // Handle order placement
    const orderNow = async () => {
        const user_id = userStorage?._id;
        let city = JSON.parse(localStorage.getItem('user')).city;
        const cart = cartStorage;
        const resto_id = cart[0]?.resto_id;
        const foodItemIds = cart.map((item) => item._id).toString();
        let deliveryBoyResponse = await fetch('http://localhost:3000/api/deliverypartner/'+city);
        deliveryBoyResponse = await deliveryBoyResponse.json();
        let deliveryBoyIds = deliveryBoyResponse.result.map((item)=>item._id);

        const deliveryBoy_id = deliveryBoyIds[Math.floor(Math.random()*deliveryBoyIds.length)]
        console.log(deliveryBoy_id);
        if(!deliveryBoy_id){
            alert('delivery partner is not availble')
            return false;
        }

       
        // const deliveryBoy_id = '66abad8538b871d5751f2e99';

        const collection = {
            user_id,
            resto_id,
            foodItemIds,
            deliveryBoy_id,
            status: 'confirm',
            amount: (total + DELIVERY_CHARGES + (total * TAX / 100)).toFixed(2),
        };
       

        const response = await fetch('http://localhost:3000/api/order', {
            method: 'POST',
            body: JSON.stringify(collection),
        });
        const result = await response.json();

        if (result.success) {
            alert('Order Confirmed');
            setClearCart(true);
            router.push('myprofile');
        } else {
            alert('Order Failed');
        }
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-100 to-yellow-100">
            <CustomerHeader clearCart={clearCart} />

            {cartStorage.length > 0 && (
                <div className="bg-white shadow-lg p-8 mt-8 rounded-xl max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Order Summary</h2>
                    <div className="bg-gradient-to-r from-yellow-100 to-pink-100 p-6 rounded-xl mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">User Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Name:</span>
                                <span className="font-medium text-gray-600">{userStorage?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Address:</span>
                                <span className="font-medium text-gray-600">{userStorage?.address}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Contact:</span>
                                <span className="font-medium text-gray-600">{userStorage?.contact}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-100 to-pink-100 p-6 rounded-xl mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Amount Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Food Charges:</span>
                                <span className="font-medium text-gray-600">{total} Rs.</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Tax ({TAX}%):</span>
                                <span className="font-medium text-gray-600">{(total * TAX / 100).toFixed(2)} Rs.</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Delivery Charges:</span>
                                <span className="font-medium text-gray-600">{DELIVERY_CHARGES} Rs.</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-xl text-gray-700">
                                <span>Total Amount:</span>
                                <span>{(total + DELIVERY_CHARGES + (total * TAX / 100)).toFixed(2)} Rs.</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-100 to-pink-100 p-6 rounded-xl mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Payment Method</h3>
                        <div className="flex justify-between items-center font-bold text-xl text-gray-700">
                            <span>Cash on Delivery:</span>
                            <span>{(total + DELIVERY_CHARGES + (total * TAX / 100)).toFixed(2)} Rs.</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <button onClick={orderNow} className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-8 rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-300">
                            Place Your Order Now
                        </button>
                    </div>
                </div>
            )}
            <RestaurantFooter />
        </div>
    );
};

export default Page;
