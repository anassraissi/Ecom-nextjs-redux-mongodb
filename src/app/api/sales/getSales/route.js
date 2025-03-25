// app/api/sales/route.js (GET, POST)
import Category from '@/libs/models/Category';
import dbConnect from '@/libs/models/dbConnect';
import Sale from '@/libs/models/Sale';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    await dbConnect();
    const sales = await Sale.find().populate('product').populate('category');
    return NextResponse.json({ sales }, { status: 200 });
  } catch (error) {
    console.log('Error getting sales:', error);
    return NextResponse.json({ message: 'Failed to get sales' }, { status: 500 });
  }
}