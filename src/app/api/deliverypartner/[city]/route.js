import { connectDB } from "@/app/lib/db";
import { deliveryPartnersSchema } from "@/app/lib/deliveryPartnerModel";
import { NextResponse } from "next/server"

export async function GET(request,content){
    let city = content.params.city
    let success = false;
    connectDB();
    let filter = {city:{$regex:new RegExp(city,'i')}};
    const result = await deliveryPartnersSchema.find(filter)
    return NextResponse.json({result})
}