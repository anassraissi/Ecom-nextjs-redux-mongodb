import Product from "./Product"; // Adjust import according to your file structure

export async function initializeDummyData() {
  try {
    console.log("Initializing dummy data for products...");

    // Check if there are any products in the collection
    const count = await Product.countDocuments();
    console.log(count);
    
    if (count > 0) {
      console.log("Products already exist. Skipping dummy data initialization.");
      return;
    }
    else{
   // Dummy products to insert if collection is empty
   const dummyProducts = [
    {
      name: "Samsung Galaxy S23", // Ensure 'name' is unique
      description: "High-end smartphone with cutting-edge features.",
      price: 999.99,
      discountPrice: 899.99,
      stock: 50,
      category: "Smartphones",
      brand: "Samsung",
      images: [
        {
          url: "samsung-galaxy-s23-red.png", // Relative URL in public/images
          altText: "Samsung Galaxy S23",
          color: "Red"
        },
        {
          url: "samsung-galaxy-s23-black.png",
          altText: "Samsung Galaxy S23 Phantom Black",
          color: "Phantom Black"
        },
        {
          url: "samsung-galaxy-s23-green.png",
          altText: "Samsung Galaxy S23 Green",
          color: "Green"
        }
      ],
      tags: ["smartphone", "electronics", "Samsung"]
    }
    // Add more dummy products if needed
  ];

  // Insert dummy products since the collection is empty
  for (const product of dummyProducts) {
    await Product.create(product);
  }

  console.log("Dummy data initialization complete.");
    }

 
  } catch (error) {
    console.error("Error initializing dummy data:", error);
  }
}
