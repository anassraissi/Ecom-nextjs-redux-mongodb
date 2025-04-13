import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import dbConnect from '@/libs/models/dbConnect';
import Product from '@/libs/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const rawBody = await buffer(req);
    const headersObj = {};
    for (const [key, value] of req.headers.entries()) {
      headersObj[key] = value;
    }
    const fakeReq = Object.assign(bufferToStream(rawBody), { headers: headersObj });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/images/products'),
      keepExtensions: true,
      multiples: true,
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
    const userId = session.user.id;


    // Process images - match with their colors
    const images = fields.images?.map((url, index) => ({
      url,
      color: fields.imageColors?.[index] || ""
    })) || [];

    // Base update data
    const updateData = {
      name: fields.name?.[0] || '',
      description: fields.description?.[0] || '',
      price: parseFloat(fields.price?.[0]) || 0,
      discountPrice: parseFloat(fields.discountPrice?.[0]) || 0,
      stock: parseInt(fields.stock?.[0]) || 0,
      category: fields.category?.[0] || null,
      brand: fields.brand?.[0] || null,
      manufactureYear: parseInt(fields.manufactureYear?.[0]) || null,
      tags: fields.tags?.[0]?.split(',').map(tag => tag.trim()) || [],
      userID: userId,
      updatedAt: new Date(),
      images
    };

    // Handle new fields
    if (fields.slug?.[0]) {
      updateData.slug = fields.slug[0].toLowerCase().replace(/\s+/g, '-');
    }

    if (fields.weight?.[0]) {
      updateData.weight = parseFloat(fields.weight[0]) || 0;
    }

    // Handle variants JSON with more robust parsing
    if (fields.variants?.[0]) {
      try {
        // First, clean the JSON string
        let variantsString = fields.variants[0]
        .replace(/\r?\n|\r/g, '') // Remove line breaks
        .replace(/\s+/g, ' ')     // Collapse spaces
        .replace(/'/g, '"')       // Convert to double quotes
        .replace(/(\w+):/g, '"$1":'); // Ensure proper JSON formatting
        
        // Then parse the cleaned JSON
        updateData.variants = JSON.parse(variantsString);
      } catch (e) {
        console.error('Error parsing variants:', e);
        console.error('Problematic variants string:', fields.variants[0]);
        updateData.variants = [];
      }
    }

    // Handle dimensions
    try {
      if (fields.dimensions?.[0]) {
        const dims = JSON.parse(fields.dimensions[0]);
        updateData.dimensions = {
          length: parseFloat(dims.length) || 0,
          width: parseFloat(dims.width) || 0,
          height: parseFloat(dims.height) || 0
        };
      }
    } catch (e) {
      console.error('Error parsing dimensions:', e);
      updateData.dimensions = { length: 0, width: 0, height: 0 };
    }
    if (fields.specifications?.[0]) {
      try {
        // Parse the specifications JSON
        const specsInput = JSON.parse(fields.specifications[0]);
        
        // Convert to array format if it's an object
        if (specsInput && typeof specsInput === 'object' && !Array.isArray(specsInput)) {
          updateData.specifications = Object.entries(specsInput).map(([key, value]) => ({
            key,
            value,
            valueType: typeof value === 'number' ? 'number' : 
                      typeof value === 'boolean' ? 'boolean' :
                      Array.isArray(value) ? 'array' :
                      typeof value === 'object' ? 'object' : 'string'
          }));
        } else if (Array.isArray(specsInput)) {
          // Already in array format
          updateData.specifications = specsInput;
        }
      } catch (e) {
        console.error('Error parsing specifications:', e);
        
        // If parsing fails, create dummy specs for new products
        if (!id) { // Only for new products
          updateData.specifications = [
            { key: 'Material', value: 'Aluminum', valueType: 'string' },
            { key: 'Weight', value: 200, valueType: 'number', unit: 'grams' },
            { key: 'In Stock', value: true, valueType: 'boolean' }
          ];
        } else {
          updateData.specifications = [];
        }
      }
    } else if (!id) {
      // Default dummy specs for new products
      updateData.specifications = [
        { key: 'Material', value: 'Aluminum', valueType: 'string' },
        { key: 'Weight', value: 200, valueType: 'number', unit: 'grams' },
        { key: 'In Stock', value: true, valueType: 'boolean' }
      ];
    }

    // Handle variants JSON
    try {
      if (fields.variants?.[0]) {
        updateData.variants = JSON.parse(fields.variants[0]);
      }
    } catch (e) {
      console.error('Error parsing variants:', e);
      updateData.variants = [];
    }

    // Process uploaded files if any
    if (files.images) {
      const uploadedImages = [];
      const filesArray = Array.isArray(files.images) ? files.images : [files.images];
      
      for (const file of filesArray) {
        const fileName = file.newFilename;
        const destination = path.join(process.cwd(), 'public/images/products', fileName);
        const uploadDir = path.join(process.cwd(), 'public/images/products');
        
        try {
          await fs.mkdir(uploadDir, { recursive: true });
          await fs.rename(file.filepath, destination);
          
          uploadedImages.push({
            url: fileName,
            color: fields.imageColors?.[updateData.images.length + uploadedImages.length] || ""
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }

      if (uploadedImages.length > 0) {
        updateData.images = [...updateData.images, ...uploadedImages];
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Product updated successfully', 
      product: updatedProduct 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      message: 'Failed to update product',
      error: error.message 
    }, { status: 500 });
  }
}