import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

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
  console.log(products);

  return (
    <div className="container relative"> {/* Added relative positioning */}
      <div className="sm:flex justify-between items-center mt-3">
        <h2 className="text-center text-4xl font-medium mb-5">Trending Products</h2>

        <div className="text-gray-500 flex gap-3 text-xl mt-4 sm:mt-0">
          <div className="text-black">New</div>
          <div>Featured</div>
          <div>Top Sellers</div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-screen-xl mx-auto">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id}
            img={item.images[0]?.url || ''}
            category={item.category.name}
            title={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;