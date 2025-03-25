// pages/api/get_products.js

import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";
import Brand from "@/libs/models/Brand";
import Category from "@/libs/models/Category"; // Import Category model
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();

        const products = await Product.find({})
            .populate("category")
            .populate("userID");

        // Manually fetch brands
        const productsWithBrands = await Promise.all(products.map(async (product) => {
            if (product.brand) {
                const brand = await Brand.findById(product.brand).populate('categories');
                return { ...product.toObject(), brand }; // Add brand to product
            }
            return product.toObject();
        }));
        return NextResponse.json(productsWithBrands);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}