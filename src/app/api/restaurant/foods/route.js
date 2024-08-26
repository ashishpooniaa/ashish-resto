import { connectDB } from "@/app/lib/db";
import { foodSchema } from "@/app/lib/FoodsModdel";

import { NextResponse } from "next/server";


export async function POST(request){
    const paylod = await request.json();
    let success = false;
    connectDB();
    const food = new foodSchema(paylod);
    const result = await food.save();
    if(result){
        success = true
    }
    return NextResponse.json({result ,success});
}