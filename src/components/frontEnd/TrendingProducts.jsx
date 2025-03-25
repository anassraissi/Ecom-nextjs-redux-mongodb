import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/get_products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
          Trending Products
        </h2>

        {/* Filter Tabs */}
        <div className="flex space-x-6 text-gray-600">
          <button className="text-black font-semibold hover:text-blue-600 transition-colors">
            New
          </button>
          <button className="hover:text-blue-600 transition-colors">
            Featured
          </button>
          <button className="hover:text-blue-600 transition-colors">
            Top Sellers
          </button>
        </div>
      </div>

      {/* Product Grid */}
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
              />
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;