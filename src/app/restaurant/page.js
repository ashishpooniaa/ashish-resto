'use client'

import React, { useState } from 'react'
import RestaurantLogin from '../_component/RestaurantLogin'
import RestaurantSignup from '../_component/RestaurantSignup'
import RestaurantHeader from '../_component/RestaurantHeader'
import RestaurantFooter from '../_component/RestaurantFooter'

const page = () => {
    const [login, setLogin] = useState(true);
    return (
        <>
            <RestaurantHeader/>
            <div className='text-center' >Restaurant Login/Singup Page</div>
            {
                login ? <RestaurantLogin /> : <RestaurantSignup />
            }

            <div className='text-center bg-transparent mt-4 text-sky-400'>
            <button onClick={()=>setLogin(!login)}>
                {login?"Do not have account? SignUp":"Already have Account? Login"}
            </button>
            <RestaurantFooter/>
            </div>


        </>
    )
}

export default page