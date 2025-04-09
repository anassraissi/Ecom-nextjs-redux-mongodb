// app/api/products/getProductById/[productId]/route.js
import dbConnect from '@/libs/models/dbConnect';
import Product from '@/libs/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
    await dbConnect();

    const awaitedContext = await context;
    const { params } = awaitedContext;
    const { productId } = params;

    try {
        if (!productId) {
            return NextResponse.json(
                { message: 'Product ID not provided' }, 
                { status: 400 }
            );
        }

        // Explicitly select all fields including specifications
        const product = await Product.findById(productId)
            .select('+specifications +variants') // Ensure these fields are included
            .populate('category')
            .populate('brand')
            .lean(); // Convert to plain JavaScript object

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' }, 
                { status: 404 }
            );
        }

        // Ensure specifications exists in the response
        if (!product.specifications) {
            product.specifications = [];
        }

        // Debug log to verify what's being sent
        console.log('API sending product with specs:', {
            id: product._id,
            specsLength: product.specifications?.length || 0
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}