import { connectDB } from "@/app/lib/db";
import { foodSchema } from "@/app/lib/FoodsModdel";
import { restaurantSchema } from "@/app/lib/RestaurantModel";
import { NextResponse } from "next/server";

export async function GET(request,content){
   const id = content.params.id;
   await connectDB();
   const details = await restaurantSchema.findOne({_id:id});
   const foodItems = await foodSchema.find({resto_id:id});
   return NextResponse.json({success:true,details,foodItems});
}