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

    // 7. Log parsed data for debugging


    const { fields, files } = formData;
    const { productId, color } = fields;

    // 8. Validate required fields
    if (!productId || !color || !files.image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 9. Process the uploaded file (assume files.image is an array)
    const file = files.image[0];
    const fileName = `${Date.now()}-${file.originalFilename}`;
    const destination = path.join(process.cwd(), "public/images/products", fileName);

    // Move the file from the temporary location to our public folder
    await fs.rename(file.filepath, destination);

    // 10. Create a new image object
    const newImage = {
      url: fileName, // URL relative to the public folder
      color:color[0],
    };

    // 11. Update the product document in MongoDB by appending the new image
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { images: newImage } },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 12. Return a success response with the new image
    return NextResponse.json(
      { message: "Image uploaded successfully", image: updatedProduct.images.at(-1) },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
