import { connectDB } from "@/app/lib/db";
import { orderSchema } from "@/app/lib/ordersModel";
import { restaurantSchema } from "@/app/lib/RestaurantModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    const payload = await request.json();
    connectDB();
    let success = false;
    const orderObj = new orderSchema(payload);
    const result = await orderObj.save();
    if (result) {
        success = true;
    }

    return NextResponse.json({ result, success });
}


export async function GET(request) {
    const userId = request.nextUrl.searchParams.get('id');
    let success = false;
    connectDB();
    let result = await orderSchema.find({ user_id: userId })
    if (result) {
        let restoData = await Promise.all(
            result.map(async (item) => {
                let restoInfo = {};
                restoInfo.data = await restaurantSchema.findOne({ _id: item.resto_id })
                restoInfo.amount = item.amount;
                restoInfo.status = item.status;

                return restoInfo;
            })
        )
        result = restoData; 
        success = true;
    }
    return NextResponse.json({ result,success });
}