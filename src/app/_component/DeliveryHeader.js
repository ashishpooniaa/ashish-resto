import Link from 'next/link';

import React from 'react';

const DeliveryHeader = () => {
    
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
                
                <ul>
                    <Link href='/'>Home</Link>
                </ul>
            </div>
        </header>
    );
};

export default DeliveryHeader;

