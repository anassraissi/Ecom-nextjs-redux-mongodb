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

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;

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

    const updateFields = {};

    if (fields.product && fields.product[0] && fields.product[0] !== '[object Object]') {
      updateFields.product = fields.product[0];
    }
    if (fields.category && fields.category[0] && fields.category[0] !== '[object Object]') {
      updateFields.category = fields.category[0];
    }
    if (fields.subCategory && fields.subCategory[0]) {
      updateFields.subCategory = fields.subCategory[0];
    }
    if (fields.originalPrice && fields.originalPrice[0]) {
      updateFields.originalPrice = fields.originalPrice[0];
    }
    if (fields.salePrice && fields.salePrice[0]) {
      updateFields.salePrice = fields.salePrice[0];
    }
    if (fields.title && fields.title[0]) {
      updateFields.title = fields.title[0];
    }
    if (fields.description && fields.description[0]) {
      updateFields.description = fields.description[0];
    }
    if (fields.occasion && fields.occasion[0]) {
      updateFields.occasion = fields.occasion[0];
    }
    if (fields.type && fields.type[0]) {
      updateFields.type = fields.type[0];
    }
    if (fields.couponCode && fields.couponCode[0]) {
      updateFields.couponCode = fields.couponCode[0];
    }
    if (fields.discountPercentage && fields.discountPercentage[0]) {
      updateFields.discountPercentage = fields.discountPercentage[0];
    }
    if (fields.isActive && fields.isActive[0]) {
      updateFields.isActive = fields.isActive[0] === 'true';
    }
    if (fields.isFeatured && fields.isFeatured[0]) {
      updateFields.isFeatured = fields.isFeatured[0] === 'true';
    }
    if (fields.tags && fields.tags[0]) {
      updateFields.tags = fields.tags[0].split(',');
    }
    if (fields.saleType && fields.saleType[0]) {
      updateFields.saleType = fields.saleType[0];
    }
    if (fields.priority && fields.priority[0]) {
      updateFields.priority = fields.priority[0];
    }
    if (fields.stockQuantity && fields.stockQuantity[0]) {
      updateFields.stockQuantity = fields.stockQuantity[0];
    }
    if (fields.usageLimit && fields.usageLimit[0]) {
      updateFields.usageLimit = fields.usageLimit[0];
    }
    if (fields.saleStartDate && fields.saleStartDate[0]) {
      updateFields.saleStartDate = fields.saleStartDate[0];
    }
    if (fields.saleEndDate && fields.saleEndDate[0]) {
      updateFields.saleEndDate = fields.saleEndDate[0];
    }
    if (fields['bonus[bonusTitle]'] && fields['bonus[bonusTitle]'][0]) {
      updateFields.bonus = {
        bonusTitle: fields['bonus[bonusTitle]'][0],
        bonusDescription: fields['bonus[bonusDescription]']?.[0] || '',
      };
    }

    const termsAndConditions = Object.keys(fields)
      .filter((key) => key.startsWith('termsAndConditions['))
      .sort()
      .map((key) => fields[key][0]);

    if (termsAndConditions.length > 0) {
      updateFields.termsAndConditions = termsAndConditions;
    }

    if (!updateFields.category && !updateFields.originalPrice && !updateFields.salePrice && !updateFields.title && !updateFields.type) {
        return NextResponse.json({ message: 'At least one field must be provided' }, { status: 400 });
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
      updateFields.image = fileName;
    } else if (fields.oldImage && fields.oldImage[0]) {
        updateFields.image = fields.oldImage[0];
    }

    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedSale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Sale updated successfully', sale: updatedSale }, { status: 200 });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json({ message: 'Failed to update sale' }, { status: 500 });
  }
}