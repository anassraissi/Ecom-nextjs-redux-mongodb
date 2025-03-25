// src/app/api/reviews/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/libs/models/dbConnect';
import Review from '@/libs/models/Review';
export async function POST(req, res) { // Named export for POST
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { product, rating, comment } = await req.json();
        const userId = session.user.id;

        const newReview = new Review({
            user: userId,
            product,
            rating,
            comment,
        });

        await newReview.save();
        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}