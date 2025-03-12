import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import dbConnect from '@/libs/models/dbConnect';
import Product from '@/libs/models/Product'; // Your Product model

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

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const rawBody = await buffer(req);
    const headersObj = {};
    for (const [key, value] of req.headers.entries()) {
      headersObj[key] = value;
    }
    const fakeReq = Object.assign(bufferToStream(rawBody), { headers: headersObj });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/images/products'),
      keepExtensions: true,
      multiples: true, // Allow multiple images
    });

    const formData = await new Promise((resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { fields, files } = formData;
    console.log('====================================');
    console.log(fields);
    console.log('====================================');
    const name = fields.name?.[0] || '';
    const description = fields.description?.[0] || '';
    const price = fields.price?.[0] || 0;
    const discountPrice = fields.discountPrice?.[0] || 0;
    const stock = fields.stock?.[0] || 0;
    const category = fields.category?.[0] || null;
    const brand = fields.brand?.[0] || null;
    const manufactureYear = fields.manufactureYear?.[0] || 0;
    const tags = fields.tags?.[0].split(',').map(tag => tag.trim()) || [];
    const userID = fields.userID?.[0] || null;

    let imageFiles = [];
    if (files.images) {
      if (!Array.isArray(files.images)) {
        files.images = [files.images];
      }
      for (const file of files.images) {
        const fileName = file.newFilename;
        const destination = path.join(process.cwd(), 'public/images/products', fileName);
        const uploadDir = path.join(process.cwd(), 'public/images/products');
        try {
          await fs.mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
          console.error('Error creating directory:', mkdirError);
          return NextResponse.json({ message: 'Error creating directory' }, { status: 500 });
        }
        await fs.rename(file.filepath, destination);
        imageFiles.push({url: fileName, color: fields.imageColors?.[imageFiles.length] || ""});
      }
    }

    const updatedData = {
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      manufactureYear,
      tags,
      userID,
    };

    if (imageFiles.length > 0) {
      updatedData.images = imageFiles;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}