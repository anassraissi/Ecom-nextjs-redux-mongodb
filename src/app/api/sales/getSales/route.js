// app/api/sales/route.js (GET, POST)
import Category from '@/libs/models/Category';
import dbConnect from '@/libs/models/dbConnect';
import Sale from '@/libs/models/Sale';
import { NextResponse } from 'next/server';


export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.getAll('type') || ["sale"]; // Get all 'type' values, default to ["sale"]
    const isActive = searchParams.get('isActive');

    let query = {};

    if (type && type.length > 0) {
      query.type = { $in: type }; // MongoDB $in operator for multiple values
    }

    if (isActive) {
      query.isActive = isActive === 'true';
    }

    const sales = await Sale.find(query)
      .populate('product')
      .populate('category');

    return NextResponse.json({ sales }, { status: 200 });
  } catch (error) {
    console.error('Error getting sales:', error);
    return NextResponse.json(
      { message: 'Failed to get sales' },
      { status: 500 }
    );
  }
}