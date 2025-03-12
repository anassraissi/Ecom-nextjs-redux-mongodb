import dbConnect from "@/libs/models/dbConnect"; // Replace with your actual import path
import User from "@/libs/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect(); // Ensure the database is connected
    const users = await User.find({})  
    return NextResponse.json(users); // Send the data in the response
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}