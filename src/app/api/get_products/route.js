// pages/api/get_products.js

import dbConnect from "@/libs/models/dbConnect"; // Replace with your actual import path
import Product from "@/libs/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect(); // Ensure the database is connected
    const products = await Product.find({})  
    return NextResponse.json(products); // Send the data in the response
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}
