'use client';

import CustomerHeader from '@/app/_component/CustomerHeader';
import RestaurantFooter from '@/app/_component/RestaurantFooter';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = ({ params }) => {
  const { name } = params;
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [cartStorage, setCartStorage] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [removeCartData, setRemoveCartData] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('id');

  useEffect(() => {
    // Access localStorage only on the client side
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (storedCart.length > 0 && storedCart[0].resto_id !== restaurantId) {
      localStorage.removeItem('cart');
    } else {
      setCartStorage(storedCart);
      setCartIds(storedCart.map(item => item._id));
    }
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantDetails(restaurantId);
    }
  }, [restaurantId]);

  const loadRestaurantDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/${id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setRestaurantDetails(data.details);
        setFoodItems(data.foodItems);
      } else {
        throw new Error(data.message || 'Failed to load restaurant details');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError('Failed to load restaurant details. Please try again later.');
    }
  };

  const addToCart = (item) => {
    if (cartStorage.length > 0 && cartStorage[0].resto_id !== item.resto_id) {
      // If the restaurant ID is different, clear the cart
      setCartStorage([item]);
      setCartIds([item._id]);
      localStorage.setItem('cart', JSON.stringify([item]));
    } else {
      const updatedCart = [...cartStorage, item];
      setCartStorage(updatedCart);
      setCartIds([...cartIds, item._id]);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    setCartData(item);
    setRemoveCartData(null);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartStorage.filter(item => item._id !== id);
    setCartStorage(updatedCart);
    setCartIds(updatedCart.map(item => item._id));
    setRemoveCartData(id);

    // Update localStorage
    if (updatedCart.length === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    setCartData(null);
  };

  return (
    <div>
      <CustomerHeader cartData={cartData} removeCartData={removeCartData} />
      <Banner title={decodeURI(name)} />
      <div className="container mx-auto mt-8 p-4">
        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        ) : (
          <>
            {restaurantDetails ? (
              <div className="bg-gray-800 p-6 text-center rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Restaurant Details</h2>
                <p className="text-white"><strong>Contact:</strong> {restaurantDetails.contact}</p>
                <p className="text-white"><strong>City:</strong> {restaurantDetails.city}</p>
                <p className="text-white"><strong>Address:</strong> {restaurantDetails.address}</p>
                <p className="text-white"><strong>Email:</strong> {restaurantDetails.email}</p>
              </div>
            ) : (
              <div className="text-center text-white">Loading restaurant details...</div>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mb-4">Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {foodItems.length > 0 ? (
                foodItems.map((item) => (
                  <div key={item._id} className="bg-white p-6 rounded-lg shadow-md">
                    <img src={item.img_path} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    <p className="text-gray-900 font-bold mt-4">{item.price} Rs.</p>
                    {cartIds.includes(item._id) ? (
                      <button onClick={() => removeFromCart(item._id)} className="bg-red-500 text-white p-2 rounded mt-4">
                        Remove From Cart
                      </button>
                    ) : (
                      <button onClick={() => addToCart(item)} className="bg-blue-500 text-white p-2 rounded mt-4">
                        Add to Cart
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <h1 className="col-span-full text-center text-gray-800">No Food Items Available</h1>
              )}
            </div>
          </>
        )}
      </div>
      <RestaurantFooter />
    </div>
  );
};

const Banner = ({ title }) => {
  return (
    <div
      className="w-full h-60 bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: 'url("https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
    >
      <h2 className="text-5xl font-bold text-white shadow-lg">{title}</h2>
    </div>
  );
};

export default Page;
