import dbConnect from "@/libs/models/dbConnect";
import Product from "@/libs/models/Product";
import fs from "fs";  
import path from "path";  

export async function DELETE(req, { params }) {  
  await dbConnect(); // Connect to database  

  const { id } = params;  

  try {  
    const product = await Product.findById(id);  
    if (!product) {  
      return new Response(JSON.stringify({ success: false, message: "Product not found" }), { status: 404 });  
    }  

    // Delete product images
    if (product.images && product.images.length > 0) {  
      product.images.forEach((image) => {  
        const imagePath = path.join(process.cwd(), "public/images/products", image.url);  
        if (fs.existsSync(imagePath)) {  
          fs.unlinkSync(imagePath);  
        }  
      });  
    }  

    // Delete product from database
    await Product.findByIdAndDelete(id);  

    return new Response(JSON.stringify({ success: true, message: "Product deleted successfully" }), { status: 200 });  
  } catch (error) {  
    console.error("Error deleting product:", error);  
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });  
  }  
}
