// src/app/api/brand/updateBrand.js (or src/pages/api/brand/[id].js)

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
    const chunks = []; // Correct initialization
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
    const { id } = params; // Get the brand ID from the URL

    const rawBody = await buffer(req);
    const headersObj = {};
    for (const [key, value] of req.headers.entries()) {
      headersObj[key] = value;
    }
    const fakeReq = Object.assign(bufferToStream(rawBody), { headers: headersObj });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/images/brands'),
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
    let fileName = null;
    if (files.logo) {
      const file = files.logo[0];
      fileName = file.newFilename;
      const destination = path.join(process.cwd(), 'public/images/brands', fileName);

      // Ensure the directory exists
      const uploadDir = path.join(process.cwd(), 'public/images/brands');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        console.error('Error creating directory:', mkdirError);
        return NextResponse.json({ message: 'Error creating directory' }, { status: 500 });
      }

      await fs.rename(file.filepath, destination);
    }

    // Dynamically update fields, including image only if a new one is uploaded
    const updatedData = { name, description, categories };
    if (fileName) {
      updatedData.logoUrl = fileName;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBrand) {
      return NextResponse.json({ message: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Brand updated successfully', brand: updatedBrand }, { status: 200 });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ message: 'Failed to update brand' }, { status: 500 });
  }
}