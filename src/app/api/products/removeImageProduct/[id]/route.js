// pages/api/product/deleteImage/[id].js
import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params; // Get the product ID
    const { imageUrl } = await req.json(); // Get the image URL to delete

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Remove the image from the product's images array
    product.images = product.images.filter((image) => image.url !== imageUrl);
    await product.save();

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ message: "Error deleting image" }, { status: 500 });
  }
}