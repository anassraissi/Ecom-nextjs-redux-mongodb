// src/app/api/users/[userId]/route.js
import dbConnect from '@/libs/models/dbConnect';
import User from '@/libs/models/User';
import { NextResponse } from 'next/server';


export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}