import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const FoodItemList = () => {
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFoodItems()
  }, [])

  const router = useRouter();

  const loadFoodItems = async () => {
    try {
      const restoData = JSON.parse(localStorage.getItem("RestaurantUser"))
      if (!restoData || !restoData._id) {
        throw new Error("Restaurant user not found")
      }
      const resto_id = restoData._id

      const response = await fetch(`http://localhost:3000/api/restaurant/foods/${resto_id}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setFoodItems(data.result)
      } else {
        throw new Error(data.message || "Failed to load food items")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteFoodItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/restaurant/foods/${id}`, {
        method: "DELETE"
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setFoodItems(prevItems => prevItems.filter(item => item._id !== id))
      } else {
        throw new Error(data.message || "Failed to delete food item")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Food Items</h1>
      {loading ? (
        <p className="text-center text-gray-700">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : foodItems.length === 0 ? (
        <p className="text-center text-gray-700">No food items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {foodItems.map(item => (
            <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img src={item.img_path} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                <p className="text-gray-700 mb-2">{item.price}</p>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between">
                  <button onClick={()=>router.push("dashboard/"+item._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-300">Edit</button>
                  <button onClick={() => deleteFoodItem(item._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-300">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodItemList
