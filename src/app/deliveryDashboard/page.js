'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DeliveryHeader from '../_component/DeliveryHeader';
import RestaurantFooter from '../_component/RestaurantFooter';

const Page = () => {
  const router = useRouter();
  const [myOrders, setMyOrders] = useState([]);

  const getMyOrders = useCallback(async (deliveryId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deliverypartner/order/${deliveryId}`);
      const data = await response.json();
      if (data.success) {
        setMyOrders(data.result);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    const deliveryData = JSON.parse(localStorage.getItem('delivery'));
    if (!deliveryData) {
      router.push('/deliverypartner');
    } else {
      getMyOrders(deliveryData._id);
    }
  }, [getMyOrders, router]);

  return (
    <div>
      <DeliveryHeader />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders list</h2>
            {myOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOrders.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="text-gray-600"><strong>Name:</strong> {item.data.name}</p>
                    <p className="text-gray-600"><strong>Amount:</strong> {item.amount} Rs.</p>
                    <p className="text-gray-600"><strong>Address:</strong> {item.data.address}</p>
                    <p className="text-gray-600"><strong>Status:</strong> {item.status}</p>
                    <p className="text-gray-600"><strong>Update Status:</strong><select>
                      <option>Confirm</option>
                      <option>On the Way</option>
                      <option>Delivered</option>
                      <option>Failed to Delivered</option>
                    </select> </p>
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
