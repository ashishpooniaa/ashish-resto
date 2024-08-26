import { connectDB } from "@/app/lib/db";
import { foodSchema } from "@/app/lib/FoodsModdel";

const { NextResponse } = require("next/server")

export async function GET(request, content) {
    const id = content.params.id
    // console.log(id)
    let success = false;
    connectDB();
    const result = await foodSchema.find({ resto_id: id })
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success })
}

export async function DELETE(request, content) {
    const id = content.params.id;
    let success = false;
    connectDB();
    const result = await foodSchema.deleteOne({ _id: id });
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success });
}