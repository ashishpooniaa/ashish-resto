'use client'
import AddFoodItem from '@/app/_component/AddFoodItem'
import FoodItemList from '@/app/_component/FoodItemList'
import RestaurantFooter from '@/app/_component/RestaurantFooter'
import RestaurantHeader from '@/app/_component/RestaurantHeader'
import React, { useState } from 'react'

const Page = () => {
  const [addItem, setAddItem] = useState(false)

  return (
    <>
      <RestaurantHeader />
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setAddItem(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Add Food
        </button>
        <button
          onClick={() => setAddItem(false)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Dashboard
        </button>
      </div>
      <div className="text-center">
        {addItem ? <AddFoodItem setAddItem={setAddItem} /> : <FoodItemList />}
      </div>
      <RestaurantFooter />
    </>
  )
}

export default Page
