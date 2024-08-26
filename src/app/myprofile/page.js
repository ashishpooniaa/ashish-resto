'use client'
import React, { useEffect, useState } from 'react'
import CustomerHeader from '../_component/CustomerHeader';
import RestaurantFooter from '../_component/RestaurantFooter';

const Page = () => {
  const [myOrders, setMyOrders] = useState([]);
  

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    
    getMyOrders(userStorage._id);
  }, []);

  const getMyOrders = async (userId) => {
    try {
      let response = await fetch('http://localhost:3000/api/order?id=' + userId);
      response = await response.json();
      if (response.success) {
        setMyOrders(response.result);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h2>
            {myOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOrders.map((item, index) => (
                  <div key={`${item.data.id}-${index}`} className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="text-gray-600"><strong>Name:</strong> {item.data.name}</p>
                    <p className="text-gray-600"><strong>Amount:</strong> {item.amount} Rs.</p>
                    <p className="text-gray-600"><strong>Address:</strong> {item.data.address}</p>
                    <p className="text-gray-600"><strong>Status:</strong> {item.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no orders yet.</p>
            )}
          </div>
        </div>
      </div>
      <RestaurantFooter />
    </div>
  );
};

export default Page;
