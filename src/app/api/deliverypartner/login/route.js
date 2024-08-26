import { connectDB } from "@/app/lib/db";
import { deliveryPartnersSchema } from "@/app/lib/deliveryPartnerModel";

import { NextResponse } from "next/server";

export async function POST(request){
    const payload = await request.json();
    let success = false;
    connectDB();
    const result = await deliveryPartnersSchema.findOne({email:payload.email, password:payload.password})
    if(result){
        success = true;
    }
    return NextResponse.json({result,success});
}