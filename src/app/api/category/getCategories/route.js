import Category from "@/libs/models/Category";
import dbConnect from "@/libs/models/dbConnect";  // Replace with your actual import path
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect(); // Ensure the database is connected
    const categories = await Category.find({})  
    return NextResponse.json(categories); // Send the data in the response
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}