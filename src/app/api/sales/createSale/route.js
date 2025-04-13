// src/app/api/sales/createSale/route.js

import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import dbConnect from '@/libs/models/dbConnect';
import Sale from '@/libs/models/Sale';

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
      uploadDir: path.join(process.cwd(), 'public/images/sales'),
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

    const product = fields.product?.[0] || null;
    const category = fields.category?.[0] || '';
    const subCategory = fields.subCategory?.[0] || '';
    const originalPrice = fields.originalPrice?.[0] || '';
    const salePrice = fields.salePrice?.[0] || '';
    const title = fields.title?.[0] || '';
    const description = fields.description?.[0] || '';
    const occasion = fields.occasion?.[0] || '';
    const type = fields.type?.[0] || '';
    const couponCode = fields.couponCode?.[0] || '';
    const discountPercentage = fields.discountPercentage?.[0] || '';
    const isActive = fields.isActive?.[0] === 'true';
    const isFeatured = fields.isFeatured?.[0] === 'true';
    const tags = fields.tags?.[0] ? fields.tags[0].split(',') : [];
    const saleType = fields.saleType?.[0] || '';
    const priority = fields.priority?.[0] || '';
    const stockQuantity = fields.stockQuantity?.[0] || '';
    const usageLimit = fields.usageLimit?.[0] || '';
    const saleStartDate = fields.saleStartDate?.[0] || '';
    const saleEndDate = fields.saleEndDate?.[0] || '';
    const bonusTitle = fields['bonus[bonusTitle]']?.[0] || '';
    const bonusDescription = fields['bonus[bonusDescription]']?.[0] || '';
    const termsAndConditions = Object.keys(fields)
      .filter((key) => key.startsWith('termsAndConditions['))
      .sort()
      .map((key) => fields[key][0]);

    if (!category || !originalPrice || !salePrice || !title || !type) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let fileName = null;

    if (files.image && files.image.length > 0) {
      const file = files.image[0];
      fileName = file.newFilename;
      const destination = path.join(process.cwd(), 'public/images/sales', fileName);

      const uploadDir = path.join(process.cwd(), 'public/images/sales');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        console.error('Error creating directory:', mkdirError);
        return NextResponse.json({ message: 'Error creating directory' }, { status: 500 });
      }

      await fs.rename(file.filepath, destination);
    }

    const newSale = new Sale({
      product,
      category,
      subCategory,
      originalPrice,
      salePrice,
      image: fileName ? fileName : null,
      title,
      description,
      occasion,
      type,
      couponCode,
      discountPercentage,
      isActive,
      isFeatured,
      tags,
      saleType,
      priority,
      stockQuantity,
      usageLimit,
      saleStartDate,
      saleEndDate,
      bonus: {
        bonusTitle,
        bonusDescription,
      },
      termsAndConditions,
    });

    await newSale.save();

    return NextResponse.json({ message: 'Sale created successfully', sale: newSale }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ message: 'Failed to create sale' }, { status: 500 });
  }
}