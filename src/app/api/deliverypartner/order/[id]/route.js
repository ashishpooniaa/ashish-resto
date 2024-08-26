import { connectDB } from "@/app/lib/db";
import { orderSchema } from "@/app/lib/ordersModel";
import { restaurantSchema } from "@/app/lib/RestaurantModel";
import { NextResponse } from "next/server";

export async function GET(request,content) {
    const id = content.params.id;
    let success = false;
    connectDB();
    let result = await orderSchema.find({ deliveryBoy_id: id})
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