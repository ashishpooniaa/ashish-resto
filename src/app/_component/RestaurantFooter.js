import React from 'react';

const RestaurantFooter = () => {
    return (
        <div className="border-t bg-gray-900 border-gray-700 mt-8 pt-4 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Restaurant Name. All rights reserved.</p>
        </div>
    )
}

export default RestaurantFooter;