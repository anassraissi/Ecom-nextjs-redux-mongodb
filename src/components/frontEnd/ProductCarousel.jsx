"use client";
import React from "react";
import ProductCard from "./ProductCard"; // You'll need this component too

const ProductCarousel = ({ products }) => {
  // Mock data - replace with your actual data fetching logic
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id}
            img={item.images[0]?.url || ""}
            category={item.category?.name || "Uncategorized"}
            title={item.name}
            price={item.price}
            discountPrice={item.discountPrice}
            stock={item.stock}
            colors={item.images.map((image) => image.color)}
          />
        ))}
    </div>

  );
};

export default ProductCarousel;