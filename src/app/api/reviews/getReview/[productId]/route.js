// app/api/reviews/getReview/[productId]/route.js
import dbConnect from '@/libs/models/dbConnect';
import Review from '@/libs/models/Review';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  await dbConnect();

  // Await the context
  const awaitedContext = await context;

  // Await the params Promise
  const params = await awaitedContext.params;

  const { productId } = params;

  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}