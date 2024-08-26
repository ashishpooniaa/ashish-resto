"use client";
import RestaurantFooter from '@/app/_component/RestaurantFooter';
import RestaurantHeader from '@/app/_component/RestaurantHeader';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const EditFoodItem = ({ params }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleLoadFoodItem();
  }, []);

  const handleLoadFoodItem = async () => {
    setLoading(true);
    try {
      let response = await fetch(`http://localhost:3000/api/restaurant/foods/edit/${params.id}`);
      let data = await response.json();
      if (data.success) {
        setName(data.result.name);
        setPrice(data.result.price);
        setPath(data.result.img_path);
        setDescription(data.result.description);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load food item details',
        });
      }
    } catch (error) {
      console.error("Error loading food item:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while loading the food item details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFoodItem = async () => {
    if (!name || !price || !path || !description) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required',
      });
      return;
    }

    setLoading(true);
    try {
      let response = await fetch(`http://localhost:3000/api/restaurant/foods/edit/${params.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, img_path: path, description })
      });
      let data = await response.json();
      if (data.success) {
        router.push("../dashboard");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the food item',
        });
      }
    } catch (error) {
      console.error("Error updating food item:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the food item',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (label, type, value, setValue, placeholder) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );

  const renderTextArea = (label, value, setValue, placeholder) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows="3"
      />
    </div>
  );

  return (
    <>
      <RestaurantHeader />
      <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Food Item</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {renderInputField("Food Name", "text", name, setName, "Enter Food Name")}
            {renderInputField("Price", "text", price, setPrice, "Enter Price")}
            {renderInputField("Image Path", "text", path, setPath, "Enter Image Path")}
            {renderTextArea("Description", description, setDescription, "Enter Description")}
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={handleEditFoodItem}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Food Item"}
              </button>
            </div>
          </>
        )}
      </div>
      <RestaurantFooter />
    </>
  );
};

export default EditFoodItem;
