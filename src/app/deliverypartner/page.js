'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Page = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [loginData, setLoginData] = useState({
    mobile: '',
    password: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    city: '',
    address: '',
  });

  const router = useRouter();


  useEffect(()=>{
    const delivery = JSON.parse(localStorage.getItem('delivery'));
    if(delivery){
      router.push('/deliveryDashboard')
    }
  },[])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isLoginPage) {
      setLoginData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { mobile, password } = loginData;

    try {
      const response = await fetch('http://localhost:3000/api/deliverypartner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('delivery', JSON.stringify(data.result));
        router.push('deliveryDashboard');
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'You will be redirected to the homepage.',
          showConfirmButton: false,
        });
      } else {
        Swal.fire('Error', 'Invalid mobile or password. Please try again.', 'error');
      }
    } catch (error) {
      Swal.fire('Oops...', 'Something went wrong! Please try again later.', 'error');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match!', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/deliverypartner/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('delivery', JSON.stringify(data.result));
        router.push('deliveryDashboard');
        Swal.fire('Success', 'Signup Successfully!', 'success').then(() => {
          setIsLoginPage(true);
        });
      } else {
        Swal.fire('Error', 'Signup Failed!', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  };

  const togglePage = () => setIsLoginPage((prev) => !prev);

  const renderInputs = (fields) =>
    fields.map((field) => (
      <div className="mb-4" key={field}>
        <input
          type={field.includes('password') ? 'password' : 'text'}
          name={field}
          value={isLoginPage ? loginData[field] : formData[field]}
          onChange={handleInputChange}
          placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
          className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    ));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLoginPage ? 'Login to Your Account' : 'Create Your Account'}
        </h2>
        <form onSubmit={isLoginPage ? handleLoginSubmit : handleSignupSubmit}>
          {isLoginPage
            ? renderInputs(['mobile', 'password'])
            : renderInputs(['name', 'mobile', 'password', 'confirmPassword', 'city', 'address'])}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            {isLoginPage ? 'Login' : 'Signup'}
          </button>
        </form>
        <button
          onClick={togglePage}
          className="w-full mt-4 text-blue-500 hover:underline focus:outline-none"
        >
          {isLoginPage ? "Don't have an account? Signup here" : 'Already have an account? Login here'}
        </button>
      </div>
    </div>
  );
};

export default Page;
