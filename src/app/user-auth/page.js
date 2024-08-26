'use client'
import React, { useState } from 'react'
import CustomerHeader from '../_component/CustomerHeader'
import RestaurantFooter from '../_component/RestaurantFooter'
import UserSignUp from '../_component/UserSignUp'
import UserLogin from '../_component/UserLogin'

const page = (props) => {
  const [login,setLogin] = useState(true);
  console.log(props)
  return (
    <div>
        <CustomerHeader/>
        <div>
        <h1 className='flex items-center justify-center' >{login?'User Login':'User SignUp'}</h1>
        {
          login?<UserLogin redirect = {props.searchParams}/>:<UserSignUp redirect = {props.searchParams}/>
        }
        </div>
        <div className='flex items-center justify-center'>
          <button className="text-blue-500  hover:underline" onClick={()=>setLogin(!login)}>
            {login?'Do not have an account? Sign up here':'Already Have Account? Login'}
          </button>
        </div>
       
        <RestaurantFooter/>
    </div>
  )
}

export default page