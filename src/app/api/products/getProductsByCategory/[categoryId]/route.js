// app/api/products/category/[categoryId]/route.js
import dbConnect from '@/libs/models/dbConnect';
import Product from '@/libs/models/Product';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, context) {
  await dbConnect();
  const awaitedContext = await context;
  const { params } = await awaitedContext;
  const { categoryId } = params;

  // Get the specific product ID to exclude from the query parameters
  const searchParams = req.nextUrl.searchParams;
  const excludeProductId = searchParams.get('excludeId');

  try {
    const query = { category: categoryId };

    // If excludeProductId is provided and is a valid ObjectId, add it to the query
    if (excludeProductId && mongoose.Types.ObjectId.isValid(excludeProductId)) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeProductId) };
    }

    const products = await Product.find(query)
      .populate('category')
      .populate('brand');

    console.log(products);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products by category (excluding product):', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}