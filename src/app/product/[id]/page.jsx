// src/app/product/[id]/page.js
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import NavBar from "@/components/frontEnd/NavBar";
import Banner from "@/components/frontEnd/Banner";
import Footer from "@/components/frontEnd/Footer";
import Cart from "@/components/frontEnd/Cart";
import Image from "next/image";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDispatch } from "react-redux"; // Import useDispatch from react-redux
import { toast } from "react-toastify"; // Import react-toastify
import { addToCart } from "@/redux/features/cartSlice";
import ReviewForm from "@/components/frontEnd/reviewForm";
import ReviewsDisplay from "@/components/frontEnd/ReviewDisplay";

const ProductDetail = () => {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const dispatch = useDispatch(); // Get the dispatch function

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/products/get_products`);
          const foundProduct = response.data.find((p) => p._id === id);
          if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct?.images?.length > 0) {
              setMainImage(foundProduct.images[0].url);
            }
          } else {
            console.log("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const getCurrentImage = () => {
    if (selectedColor) {
      const selectedImage = product?.images?.find(
        (img) => img.color === selectedColor
      );
      return selectedImage ? selectedImage.url : product?.images[0]?.url;
    }
    return product?.images[0]?.url;
  };

// In your ProductDetail component (where you add to cart)
const addProductToCart = () => {
  if (quantity > 0) {
      const img = getCurrentImage();
      // Create a unique ID
      const cartItemId = `${product._id}-${selectedColor}`; // Unique ID
      const payload = {
          id: cartItemId, // Use the unique ID
          productId: product._id, // Store the original product ID (optional)
          img,
          category: product?.category?.name,
          title: product.name,
          price: product.discountPrice || product.price,
          quantity,
          color: selectedColor, // Include the selected color!
      };
      dispatch(addToCart(payload));
      toast.success("Added to Cart!");
  } else {
      toast.error("Quantity must be greater than 0.");
  }
};

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar setShowCart={setShowCart} />
      {showCart && <Cart setShowCart={setShowCart} />}

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="product-gallery md:w-1/2">
              <div className="main-image mb-6">
                {product?.images?.length > 0 ? (
                  <div className="relative w-full h-96 rounded-lg overflow-hidden">
                    <Image
                      src={`/images/products/${getCurrentImage()}`}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200 flex justify-center items-center">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}
              </div>

              <div className="thumbnail-gallery flex space-x-4 overflow-x-auto">
                {product?.images?.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg ${
                      selectedColor === image.color
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedColor(image.color);
                      setMainImage(image.url);
                    }}
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={`/images/products/${image.url}`}
                        alt={`Thumbnail ${index + 1}`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-info md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product?.name}
              </h1>

              <div className="rating flex items-center mb-4">
                {[...Array(4)].map((_, i) => (
                  <AiFillStar key={i} className="text-yellow-500 text-xl" />
                ))}
                <AiOutlineStar className="text-yellow-500 text-xl" />
                <span className="text-gray-600 ml-2">(20 Reviews)</span>
              </div>

              {/* Price */}
              <div className="price text-3xl font-bold text-blue-600 mb-6 flex items-center">
                {product?.discountPrice ? (
                  <>
                    <span className="line-through text-red-500 mr-2">
                      ${product?.price}
                    </span>
                    <span>${product?.discountPrice}</span>
                  </>
                ) : (
                  <span>${product?.price}</span>
                )}
              </div>

              <div className="description text-gray-700 mb-6">
                <p>{product?.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="quantity flex items-center mb-6">
                <button
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  className="w-16 h-10 text-center border-t border-b border-gray-300"
                  readOnly
                />
                <button
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>

              {/* Color Swatches (Moved to the bottom) */}
              <div className="color-swatches flex space-x-2 mb-6 items-center">
                <span className="mr-2">Colors</span>
                {product?.images?.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer w-8 h-8 rounded-md border ${
                      selectedColor === image.color
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: image.color }}
                    onClick={() => {
                      setSelectedColor(image.color);
                      // Update mainImage when color is selected
                      const selectedImage = product?.images?.find(
                        (img) => img.color === image.color
                      );
                      if (selectedImage) {
                        setMainImage(selectedImage.url);
                      }
                    }}
                  ></div>
                ))}
              </div>

              {/* Actions */}
              <div className="actions flex space-x-4 mb-6">
                <button
                  className="flex-1 bg-blue text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  // Replace the existing onClick with addProductToCart
                  onClick={addProductToCart}
                >
                  Add to Cart
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Buy Now
                </button>
              </div>

              {/* More Product Information */}
              <div className="additional-info grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand Information */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Brand</h4>
                  <p className="text-gray-600">
                    {product?.brand?.name || "N/A"}
                  </p>
                </div>

                {/* Category Information */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
                  <p className="text-gray-600">
                    {product?.category?.name || "N/A"}
                  </p>
                </div>

                {/* Availability (Stock) */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Availability
                  </h4>
                  <p className="text-gray-600">
                    {product?.stock > 0 ? "In Stock" : "Out of Stock"}(
                    {product?.stock} available)
                  </p>
                </div>

                {/* Manufacture Year */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Manufacture Year
                  </h4>
                  <p className="text-gray-600">
                    {product?.manufactureYear || "N/A"}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Tags</h4>
                  <p className="text-gray-600">
                    {product?.tags?.length > 0
                      ? product.tags.join(", ")
                      : "N/A"}
                  </p>
                </div>

                {/* Sold Count */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Sold</h4>
                  <p className="text-gray-600">{product?.sold || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReviewsDisplay productId={id} />
          <ReviewForm productId={id} />
      </div>

      <Banner />
      <Footer />
    </div>
  );
};

export default ProductDetail;
