// src/app/api/categories/route.js (or pages/api/categories/index.js)
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
    const parent = fields.parent?.[0] || null;
let fileName=null;
    if (!name || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
if (files.image && files.image.length > 0) {
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


    const newCategory = new Category({
      name,
      description,
      image: fileName || null,
      parent: parent || null,
    });

    await newCategory.save();

    return NextResponse.json(
      { message: 'Category created successfully', category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}