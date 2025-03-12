// src/app/api/brand/addBrand.js (or src/pages/api/brand/addBrand.js)

import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import dbConnect from '@/libs/models/dbConnect';
import Brand from '@/libs/models/Brand';

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
    const fakeReq = Object.assign(bufferToStream(rawBody), { headers: headersObj });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/images/brands'), // Use 'brands' directory
      keepExtensions: true,
      multiples: false,
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
    const name = fields.name?.[0] || '';
    const description = fields.description?.[0] || '';
    const categories = fields.categories?.[0] || null; // Get the selected category ID

    if (!name || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
let fileName=null;

if (files.logoUrl && files.logoUrl.length > 0) {
        const file = files.logoUrl[0];
        const fileName = file.newFilename;
        const destination = path.join(process.cwd(), 'public/images/brands', fileName); // Use 'brands' directory
    
        // Ensure the directory exists
        const uploadDir = path.join(process.cwd(), 'public/images/brands'); // Use 'brands' directory
        try {
          await fs.mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
          console.error('Error creating directory:', mkdirError);
          return NextResponse.json({ message: 'Error creating directory' }, { status: 500 });
        }
    
        await fs.rename(file.filepath, destination);
    }
 
    const newBrand = new Brand({
      name,
      description,
      logoUrl: fileName || null,
      categories, // Assign the selected category ID
    });

    await newBrand.save();

    return NextResponse.json({ message: 'Brand created successfully', brand: newBrand }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ message: 'Failed to create brand' }, { status: 500 });
  }
}