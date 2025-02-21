import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: true, // We are expecting JSON in the body
  },
};

export async function PUT(req, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get the product ID from URL parameters
    const { id } = params;
    
    
    // Parse the JSON request body
    const data = await req.json();
    
    
    // Build an update object that excludes images (do not overwrite images)
    const updateData = {
      name: data.name,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      stock: data.stock,
      category: data.category,
      brand: data.brand,
      tags: data.tags,
      updatedAt: new Date(), // Optionally update the timestamp
    };
    
    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    console.log(updateData);
    
    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
