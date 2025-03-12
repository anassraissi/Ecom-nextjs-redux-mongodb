import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust the path if needed

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req.body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req) {
  try {
    await dbConnect();
    const rawBody = await buffer(req);

    const headersObj = {};
    for (const [key, value] of req.headers.entries()) {
      headersObj[key] = value;
    }

    const fakeReq = Object.assign(bufferToStream(rawBody), {
      headers: headersObj,
    });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/images/products"),
      keepExtensions: true,
      multiples: true, // Allow multiple file uploads
    });

    const formData = await new Promise((resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { fields, files } = formData;
    const session = await getServerSession(authOptions);

    // Extract values, handling potential arrays
    const name = fields.name?.[0] || "";
    const description = fields.description?.[0] || "";
    const price = parseFloat(fields.price?.[0]) || 0;
    const discountPrice = parseFloat(fields.discountPrice?.[0]) || 0;
    const stock = parseInt(fields.stock?.[0]) || 0;
    const category = fields.category?.[0] || null; // Use null for no category
    const brand = fields.brand?.[0] || null; // Use null for no brand
    const manufactureYear = parseInt(fields.manufactureYear?.[0]) || null;
    const tags = fields.tags?.[0]?.split(",").map((tag) => tag.trim());
    const userID = session?.user?.id || null; 
    const imageColors = fields.imageColors?.[0]?.split(",");

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process uploaded images
    const uploadedImages =[];
    if (files.images) {
      // Handle single or multiple files
      const imageArray = Array.isArray(files.images)
        ? files.images
        : [files.images];

      for (let i = 0; i < imageArray.length; i++) {
        const file = imageArray[i];
        const fileName = file.newFilename;
        const destination = path.join(
          process.cwd(),
          "public/images/products",
          fileName
        );
        await fs.rename(file.filepath, destination);

        uploadedImages.push({
          url: `${fileName}`, // Use correct relative path
          color: imageColors[i] || null, // Assign color if available
        });
      }
    }

    // Create and save the new product
    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      manufactureYear,
      images: uploadedImages,
      tags,
      userID,
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}