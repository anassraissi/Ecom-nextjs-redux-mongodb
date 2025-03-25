// pages/api/get_brands.js

import dbConnect from '@/libs/models/dbConnect';
import Brand from '@/libs/models/Brand';
import { NextResponse } from 'next/server';
import Category from '@/libs/models/Category';

export async function GET(request) {
  try {
    await dbConnect();
    const brands = await Brand.find({}).populate('categories'); // Populate categories if needed
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}