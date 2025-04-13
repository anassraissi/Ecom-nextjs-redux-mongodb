// app/api/products/getProductBySlug/[slug]/route.js
import dbConnect from '@/libs/models/dbConnect';
import Product from '@/libs/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
    await dbConnect();

    const awaitedContext = await context;
    const { params } = awaitedContext;
    const { slug } = params;

    try {
        if (!slug) {
            return NextResponse.json(
                { message: 'Product slug not provided' },
                { status: 400 }
            );
        }

        // Find the product by slug
        const product = await Product.findOne({ slug })
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
        console.log('API sending product with specs (by slug):', {
            slug: product.slug,
            specsLength: product.specifications?.length || 0
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}