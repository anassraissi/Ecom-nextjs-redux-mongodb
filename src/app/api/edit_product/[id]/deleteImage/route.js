import { NextResponse } from "next/server";
import Product from "@/libs/models/Product";
import dbConnect from "@/libs/models/dbConnect";
import { promises as fs } from "fs";
import path from "path";
import formidable from "formidable";

export async function DELETE(req, { params }) {
  try {
    await dbConnect(); // Ensure database connection

    const { id } = params; // Get product ID from URL params
    const { imageUrl } = await req.json(); // Get image URL from request body

    if (!id || !imageUrl) {
      return NextResponse.json({ error: "Missing product ID or image URL" }, { status: 400 });
    }

    // Find the product and update its images array
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.images = product.images.filter((img) => img.url !== imageUrl);
    await product.save();

    return NextResponse.json({ message: "Image deleted successfully", images: product.images }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export const config = {
  api: {
    bodyParser: false, // Necessary for formidable
  },
};

export async function POST(req) {
  await connectDB();
  
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public/images/product");
  form.keepExtensions = true;

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(new Response(JSON.stringify({ message: "Image upload failed" }), { status: 500 }));
        return;
      }

      const { productId, color } = fields;
      const file = files.image?.[0];

      if (!productId || !color || !file) {
        reject(new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 }));
        return;
      }

      const fileName = `${Date.now()}-${file.originalFilename}`;
      const filePath = path.join("public/images/product", fileName);
      await fs.rename(file.filepath, filePath);

      // Update product in database
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            images: {
              url: `/images/product/${fileName}`,
              altText: `Product Image - ${color}`,
              color,
            },
          },
        },
        { new: true }
      );

      resolve(new Response(JSON.stringify({ message: "Image uploaded", image: updatedProduct.images.at(-1) }), { status: 200 }));
    });
  });
}


