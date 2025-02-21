import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable"; // Named import for IncomingForm
import { Readable } from "stream";
import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing for file uploads
  },
};

// Helper: Buffer the request body (Next.js req.body is a ReadableStream)
async function buffer(req) {
  const chunks = [];
  for await (const chunk of req.body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Helper: Convert a Buffer into a Node.js Readable stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Buffer the raw request body
    const rawBody = await buffer(req);

    // 3. Convert req.headers (a Headers instance) to a plain object
    const headersObj = {};
    for (const [key, value] of req.headers.entries()) {
      headersObj[key] = value;
    }

    // 4. Create a fake Node.js request object by converting the buffer to a stream and attaching headers
    const fakeReq = Object.assign(bufferToStream(rawBody), { headers: headersObj });

    // 5. Initialize Formidable with desired options
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/images/products"),
      keepExtensions: true,
      multiples: false, // Only allow one file per request
    });

    // 6. Parse the fake request with Formidable
    const formData = await new Promise((resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    // // 7. Log parsed data for debugging
    // console.log("Parsed Fields:", formData.fields);
    // console.log("Parsed Files:", formData.files);

    const { fields, files } = formData;

    // Extract single values from arrays
    const name = fields.name?.[0] || "";
    const description = fields.description?.[0] || "";
    const price = fields.price?.[0] ? Number(fields.price[0]) : 0;
    const discountPrice = fields.discountPrice?.[0] ? Number(fields.discountPrice[0]) : 0;
    const stock = fields.stock?.[0] ? Number(fields.stock[0]) : 0;
    const category = fields.category?.[0] || "";
    const brand = fields.brand?.[0] || "";
    const tags = fields.tags?.[0] ? fields.tags[0].split(",") : [];
    const imageColors = fields.imageColors?.[0] || "";
    
    // 8. Validate required fields
    if (!name || !price || !category || !description || !tags||!discountPrice || !stock||  !brand||  !files.images) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    // 9. Process the uploaded file (assume files.image is an array)
    const file = files.images[0];// Correct file reference
    const fileName = file.newFilename; // Get the correct new file name
    const destination = path.join(process.cwd(), "public/images/products", fileName);
    
    // Move the file from the temporary location to our public folder
    await fs.rename(file.filepath, destination);
    
    // Create a new image object
    const newImage = {
      url: fileName, // Ensure the correct relative path
      altText: `Product Image for ${name}`,
      color: imageColors || null, // Ensure color is optional
    };
    
    console.log(newImage);
    // 11. Create a new product object
    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      tags,
      brand,
      images: [newImage], // Ensure images is an array
    });
    
    

    // 12. Save the new product to the database
    await newProduct.save();

    // 13. Return a success response with the new product
    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



