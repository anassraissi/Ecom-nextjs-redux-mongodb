// pages/api/edit_product/uploadImage.js
import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";
import formidable from "formidable";
import { NextResponse } from "next/server";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();

      const form = formidable({ multiples: true });
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const { productId, color } = fields;
      const image = files.image;

      // Move the uploaded image to the public directory
      const imageName = `${Date.now()}-${image.originalFilename}`;
      const imagePath = `/images/products/${imageName}`;
      const publicPath = `public${imagePath}`;
      fs.renameSync(image.filepath, publicPath);

      // Update the product with the new image
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      product.images.push({ url: imagePath, color });
      await product.save();

      return NextResponse.json({ message: "Image uploaded", image: { url: imagePath, color } }, { status: 200 });
    } catch (error) {
      console.error("Error uploading image:", error);
      return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
}