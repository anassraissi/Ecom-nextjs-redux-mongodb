import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/features/productSlice";
import ProductCard from "./ProductCard";
import Link from "next/link";

const TrendingProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center py-8">Loading trending products...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
          Trending Products
        </h2>

        <div className="flex space-x-6 text-gray-600">
          <button
            className="text-black font-semibold hover:text-blue-600 transition-colors"
            aria-label="Filter by New products"
          >
            New
          </button>
          <button
            className="hover:text-blue-600 transition-colors"
            aria-label="Filter by Featured products"
          >
            Featured
          </button>
          <button
            className="hover:text-blue-600 transition-colors"
            aria-label="Filter by Top Sellers"
          >
            Top Sellers
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((item) => (
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

      {/* Optional: Add "View All" Link */}
      <div className="mt-8 text-center">
        <Link href="/products" className="text-blue-600 hover:underline">
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default TrendingProducts;