"use client";
import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-hot-toast'; // Import from react-hot-toast
import { addToCart } from "@/redux/features/cartSlice";
import NavBar from "@/components/frontEnd/NavBar";
import Footer from "@/components/frontEnd/Footer";
import Cart from "@/components/frontEnd/Cart";
import ReviewForm from "@/components/frontEnd/reviewForm";
import ReviewsDisplay from "@/components/frontEnd/ReviewDisplay";
import ProductCarousel from "@/components/frontEnd/ProductCarousel";
import Breadcrumbs from "@/components/frontEnd/Breadcrumbs";
import SizeGuideModal from "@/components/frontEnd/SizeGuideModal";
import DeliveryInfo from "@/components/frontEnd/DeliveryInfo";
import ReturnPolicy from "@/components/frontEnd/ReturnPolicy";
import { fetchProductById, fetchProductsByCategory } from "@/redux/features/productSlice";

const ProductDetail = () => {
  const params = useParams();
  const { id } = params;
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const dispatch = useDispatch();
    const { selectedProduct: product, loading, error } = useSelector((state) => state.products);
    const { relatedProducts, loading: loadingRelated, error: errorRelated } = useSelector((state) => state.products);
    useEffect(() => {
      dispatch(fetchProductById(id));
    }, [dispatch, id]);
  
    useEffect(() => {
      if (product?.category && product?._id) {
        dispatch(fetchProductsByCategory({ categoryId: product.category._id, excludeId: product._id }));
      }
    }, [dispatch, product?.category, product?._id]);

  // Set initial image and color when product is available
  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0].url);
      setSelectedColor(product.images[0].color);
    }
  }, [product]);

  const handleWishlistToggle = () => {
    setWishlist(!wishlist);
    toast(wishlist ? "Removed from wishlist" : "Added to wishlist"); // Example with a simple toast
  };

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

  const addProductToCart = () => {
    if (quantity > 0) {
      const img = getCurrentImage();
      const cartItemId = `${product._id}-${selectedColor}`;
      const payload = {
        id: cartItemId,
        productId: product._id,
        img,
        category: product?.category?.name,
        title: product.name,
        price: product.discountPrice || product.price,
        quantity,
        color: selectedColor,
      };
      dispatch(addToCart(payload));
      toast.success("Added to Cart!"); // Use toast from react-hot-toast
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar setShowCart={setShowCart} />
      {showCart && <Cart setShowCart={setShowCart} />}

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs 
          category={product.category?.name} 
          productName={product.name} 
        />
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 p-6">
            {/* Product Gallery */}
            <div className="lg:w-1/2">
              <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 mb-4">
                {mainImage ? (
                  <Image
                    src={`/images/products/${mainImage}`}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}
              </div>

              <div className="thumbnail-gallery flex space-x-3 overflow-x-auto py-2">
                {product?.images?.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg transition-all ${
                      selectedColor === image.color
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedColor(image.color);
                      setMainImage(image.url);
                    }}
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={`/images/products/${image.url}`}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <button 
                  onClick={() => handleWishlistToggle ()}
                  className={`p-2 rounded-full ${wishlist ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <FiHeart className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) =>
                    i < 4 ? (
                      <AiFillStar key={i} className="text-yellow-400 text-xl" />
                    ) : (
                      <AiOutlineStar key={i} className="text-yellow-400 text-xl" />
                    )
                  )}
                </div>
                <span className="text-gray-600 ml-2 text-sm">
                  (20 Reviews) | {product.sold || 0} sold
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.discountPrice ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-900">
                      ${product.discountPrice}
                    </span>
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      ${product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                        {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.images?.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedColor(image.color);
                        setMainImage(image.url);
                      }}
                      className={`rounded-full w-10 h-10 flex items-center justify-center border-2 transition-all ${
                        selectedColor === image.color
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: image.color }}
                      aria-label={`Select color ${image.color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <button 
                      type="button" 
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className="border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={addProductToCart}
                  className="flex-1 bg-green-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-md font-medium transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Category:</span>
                    <span className="font-medium">{product.category?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Brand:</span>
                    <span className="font-medium">{product.brand?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Availability:</span>
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">SKU:</span>
                    <span className="font-medium">
                    {product?._id?.slice(-6) || 'Loading...'}
                  </span>                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="mt-6">
                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                  <FiShare2 className="w-4 h-4" />
                  Share this product
                </button>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "description"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "shipping"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Shipping & Returns
              </button>
            </nav>

            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                  <p className="text-gray-700">{product.fullDescription || product.description}</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                <ReviewForm productId={id} />
                  <ReviewsDisplay productId={id} />
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-6">
                  <DeliveryInfo />
                  <ReturnPolicy />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
       <div className="mt-12">
           <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
           <ProductCarousel relatedProducts={relatedProducts} currentProductId={id} />
         </div>
       </div>


      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;