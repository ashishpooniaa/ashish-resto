
import { connectDB } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/RestaurantModel";

import { NextResponse } from "next/server";

export async function GET() {
    connectDB();
    const data = await restaurantSchema.find();
    console.log(data)
    return NextResponse.json({ result: data })
}

export async function POST(request) {
    let paylod = await request.json();
    let result;
    connectDB();
    if (paylod.login) {
        // login api 
        result = await restaurantSchema.findOne({ email: paylod.email, password: paylod.password })
    } else {
        const restaurant = new restaurantSchema(paylod)
        result = await restaurant.save();
    }

    // console.log(paylod)
    return NextResponse.json({ result, success: true })
}

