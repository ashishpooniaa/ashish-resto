import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CustomerHeader = ({ cartData, removeCartData, clearCart }) => {
  const [cartNumber, setCartNumber] = useState(0);
  const [user, setUser] = useState(undefined);
  const [cartItems, setCartItems] = useState([]);

  const router = useRouter();

  // Initialize cart items and user from localStorage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStorage = JSON.parse(localStorage.getItem('user'));
      const cartStorage = JSON.parse(localStorage.getItem('cart')) || [];

      setUser(userStorage);
      setCartItems(cartStorage);
      setCartNumber(cartStorage.length);
    }
  }, []);

  // Update cart items when cartData changes
  useEffect(() => {
    if (cartData) {
      setCartItems(prevItems => {
        const updatedCart = prevItems.some(item => item._id === cartData._id)
          ? prevItems.map(item => (item._id === cartData._id ? cartData : item))
          : [...prevItems, cartData];

        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        setCartNumber(updatedCart.length);
        return updatedCart;
      });
    }
  }, [cartData]);

  // Handle removal of items from cart
  useEffect(() => {
    if (removeCartData) {
      setCartItems(prevItems => {
        const updatedCart = prevItems.filter(item => item._id !== removeCartData);

        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        setCartNumber(updatedCart.length);

        if (updatedCart.length === 0 && typeof window !== 'undefined') {
          localStorage.removeItem('cart');
        }

        return updatedCart;
      });
    }
  }, [removeCartData]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/user-auth');
  };

  // Reset cart when clearCart is triggered
  useEffect(() => {
    if (clearCart) {
      setCartItems([]);
      setCartNumber(0);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    }
  }, [clearCart]);

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://img.freepik.com/free-vector/sticker-template-with-delivery-man-motor-scooter_1308-76822.jpg?size=626&ext=jpg"
            alt="Restaurant Logo"
            className="w-16 h-16 object-cover rounded-full shadow-md"
          />
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/myprofile">{user.name}</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:text-gray-400">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/user-auth" className="hover:text-gray-400">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href={cartNumber ? "/cart" : "#"} className="hover:text-gray-400">
                🛒 ({cartNumber})
              </Link>
            </li>
            <li>
              <Link href="/add-restaurant" className="hover:text-gray-400">
                Add Restaurant
              </Link>
            </li>
            <li>
              <Link href="/deliverypartner" className="hover:text-gray-400">
                DeliveryPartner
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default CustomerHeader;
