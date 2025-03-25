// pages/api/reviews/[productId].js (or app/api/reviews/[productId]/route.js)
import dbConnect from '@/libs/models/dbConnect';
import Review from '@/libs/models/Review';
import { NextResponse } from 'next/server';

//pages directory
export default async function handler(req, res) {
    await dbConnect();

    const { productId } = req.query;

    if (req.method === 'GET') {
        try {
            const reviews = await Review.find({ product: productId }).populate('user', 'name'); // Populate user's name
            res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }   
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

//app directory
export async function GET(req, context) {
    await dbConnect();

    const { params } = context;
    const { productId } = params;

    try {
        const reviews = await Review.find({ product: productId }).populate('user', 'name');
        return NextResponse.json(reviews, {status: 200});
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, {status: 500});
    }

}