import React, { useState } from 'react'
import Swal from 'sweetalert2'

const AddFoodItem = (props) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [path, setPath] = useState("")
  const [description, setDescription] = useState("")

  const handleAddFoodItem = async () => {
    if (!name || !price || !path || !description) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required',
      })
      return
    }

    try {
      const restaurantData = JSON.parse(localStorage.getItem("RestaurantUser"))

      if (!restaurantData) {
        throw new Error("Restaurant user not found")
      }

      const resto_id = restaurantData._id
      const response = await fetch("http://localhost:3000/api/restaurant/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, img_path: path, description, resto_id }),
      })

      const result = await response.json()

      if (result.success) {
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Food Item Added Successfully',
        })
        setName("")
        setPrice("")
        setPath("")
        setDescription("")
        props.setAddItem(false)
      } else {
        throw new Error(result.message || "Failed to add food item")
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      })
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Food Item</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Food Name</label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          type="text"
          placeholder="Enter Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          type="text"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Image Path</label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          type="text"
          placeholder="Enter Image Path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={handleAddFoodItem}
        >
          Add Food Item
        </button>
      </div>
    </div>
  )
}

export default AddFoodItem
