'use client';

import { useEffect, useState } from "react";
import CustomerHeader from "./_component/CustomerHeader";
import RestaurantFooter from "./_component/RestaurantFooter";
import { useRouter } from "next/navigation";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchData("locations", setLocations, "Failed to load locations. Please try again later.");
    fetchData("", setRestaurants, "Failed to load restaurants. Please try again later.");
  }, []);

  const fetchData = async (endpoint, setData, errorMessage, params = {}) => {
    try {
      const query = params.location ? `?location=${params.location}` : params.restaurant ? `?restaurant=${params.restaurant}` : '';
      const response = await fetch(`http://localhost:3000/api/customer/${endpoint}${query}`);
      const data = await response.json();
      if (data.success) {
        setData(data.result);
      } else {
        throw new Error();
      }
    } catch {
      console.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleListItem = (item) => {
    setSelectedLocation(item);
    setShowLocation(false);
    fetchData("", setRestaurants, "Failed to load restaurants. Please try again later.", { location: item });
  };

  return (
    <>
      <CustomerHeader />
      <main className="flex flex-col items-center">
        <Banner
          selectedLocation={selectedLocation}
          locations={locations}
          handleListItem={handleListItem}
          showLocation={showLocation}
          setShowLocation={setShowLocation}
          error={error}
          fetchData={fetchData}
        />
        <RestaurantList restaurants={restaurants} router={router} />
      </main>
      <RestaurantFooter />
    </>
  );
}

function Banner({ selectedLocation, locations, handleListItem, showLocation, setShowLocation, error, fetchData }) {
  return (
    <div
      className="w-full h-90 bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{ backgroundImage: 'url("https://t4.ftcdn.net/jpg/04/43/37/07/360_F_443370711_sqHRnSIQovW6uyQ5ZwDpd4kjCG8Q6swm.jpg")' }}
    >
      <h1 className="text-4xl font-bold mb-4 shadow-md">Food Delivery App</h1>
      <SearchInputs
        selectedLocation={selectedLocation}
        locations={locations}
        handleListItem={handleListItem}
        showLocation={showLocation}
        setShowLocation={setShowLocation}
        error={error}
        fetchData={fetchData}
      />
    </div>
  );
}

function SearchInputs({ selectedLocation, locations, handleListItem, showLocation, setShowLocation, error, fetchData }) {
  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      <input
        type="text"
        onClick={() => setShowLocation(!showLocation)}
        value={selectedLocation}
        placeholder="Select Place"
        className="w-full p-4 text-gray-800 rounded-full bg-white bg-opacity-80 border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        readOnly
      />
      {error && <p className="text-red-500">{error}</p>}
      {showLocation && !error && (
        <ul className="bg-white text-black bg-opacity-90 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {locations.map((item, index) => (
            <li
              key={index}
              onClick={() => handleListItem(item)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        onChange={(e) => fetchData("", setRestaurants, "Failed to load restaurants. Please try again later.", { restaurant: e.target.value })}
        placeholder="Enter Food And Restaurant"
        className="w-full p-4 text-gray-800 rounded-full bg-white bg-opacity-80 border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function RestaurantList({ restaurants, router }) {
  return (
    <div className="w-full max-w-6xl mt-10 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {restaurants.map((restaurant, index) => (
        <div
          onClick={() => router.push(`explore/${restaurant.name}?id=${restaurant._id}`)}
          key={index}
          className="bg-gray-800 rounded-2xl shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold text-white mb-2">
              {restaurant.name}
            </h3>
            <p className="text-white mb-4 italic">{restaurant.city}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <p className="text-gray-700">
              <span className="font-medium">Contact:</span> {restaurant.contact}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Address:</span> {restaurant.address}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {restaurant.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
