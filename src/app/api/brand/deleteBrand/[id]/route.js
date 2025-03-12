// src/app/api/category/deleteCategory.js (or src/app/api/category/[id].js)
import Brand from '@/libs/models/Brand';
import dbConnect from '@/libs/models/dbConnect';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params; // Get the category ID from the URL

    // Find the category by ID and delete it
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}