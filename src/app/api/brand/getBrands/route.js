// src/app/api/brand/getBrands.js
import dbConnect from '@/libs/models/dbConnect';
import Brand from '@/libs/models/Brand';
import Category from '@/libs/models/Category'; // Import the Category model
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const brands = await Brand.find({}).populate('categories'); // Populate categories

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ message: 'Error fetching brands' }, { status: 500 });
  }
}