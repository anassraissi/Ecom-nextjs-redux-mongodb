// src/app/api/category/updateCategory.js (or src/app/api/category/[id].js)

import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import dbConnect from '@/libs/models/dbConnect';
import Category from '@/libs/models/Category';

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
    const { id } = params; // Get the category ID from the URL

    const rawBody = await buffer(req);
    const headersObj = {};
    for (const [key, value] of req.headers.entries()) {
      headersObj[key] = value;
    }
    const fakeReq = Object.assign(bufferToStream(rawBody), { headers: headersObj });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/images/categories'),
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
    // Ensure parent is either a valid ObjectId or null
    const parent = fields.parent?.[0] === '' ? null : fields.parent?.[0]; 

    let fileName = null;
    if (files.image) {
      const file = files.image[0];
      fileName = file.newFilename;
      const destination = path.join(process.cwd(), 'public/images/categories', fileName);
      // Ensure the directory exists
      const uploadDir = path.join(process.cwd(), 'public/images/categories');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        console.error('Error creating directory:', mkdirError);
        return NextResponse.json({ message: 'Error creating directory' }, { status: 500 });
      }
      await fs.rename(file.filepath, destination);
    }

    // Dynamically update fields, including image only if a new one is uploaded
    const updatedData = { name, description, parent };
    if (fileName) { 
      updatedData.image = fileName;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );  

    if (!updatedCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated successfully', category: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}