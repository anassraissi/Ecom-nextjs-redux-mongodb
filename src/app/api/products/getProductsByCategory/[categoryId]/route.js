// src/app/api/products/getProductsByCategory/[categoryId]/route.js
import dbConnect from '@/libs/models/dbConnect'
import Product from '@/libs/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    // Properly destructure params (no need for extra await)
    const { categoryId } = params
    
    // Handle query parameters
    const { searchParams } = new URL(request.url)
    const excludeId = searchParams.get('excludeId')
    
    // Build query
    const query = { category: categoryId }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }
    
    // Fetch products
    const products = await Product.find(query)
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}