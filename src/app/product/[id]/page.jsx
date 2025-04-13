"use client";
import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { addToCart } from "@/redux/features/cartSlice";
import { addToRecentlyViewed } from "@/redux/features/recentlyViewedSlice";
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
import {
  fetchProductById,
  fetchProductsByCategory,
} from "@/redux/features/productSlice";
import { fetchReviews } from "@/redux/features/reviewSlice";
import { calculateAverageRating,renderStars } from "../../../../utils/reviewHelpers";
import { set } from "mongoose";
import { Title } from "chart.js";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  
  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { relatedProducts, loading: loadingRelated, error: errorRelated } = useSelector((state) => state.products);
  const { items: recentlyViewed } = useSelector((state) => state.recentlyViewed);

useEffect(() => {
  // Fetch product and reviews together
  const fetchData = async () => {
     dispatch(fetchProductById(id));
     dispatch(fetchReviews(id));
  };
  fetchData();
}, [dispatch, id]); // Only depend on id  
  
// reviews
const { reviews, loading: reviewsLoading, error: reviewsError } = useSelector(
  (state) => state.reviews
);
  const [stars, setStars] = useState(null); 
  const [reviewslength, setReviewsLength] = useState(0); 

   useEffect(() => {
     if (reviews && !reviewsLoading && !reviewsError) {
       const productReviews = reviews.filter((review) => review.product === id);
       setReviewsLength(productReviews.length);
       if (productReviews.length > 0) {
         const totalRating = productReviews.reduce(
           (sum, review) => sum + review.rating,
           0
         );
         const avgRating = totalRating / productReviews.length;
         setStars(renderStars(avgRating));
       }
     }
   }, [reviews, id, reviewsLoading, reviewsError]);
   console.log(reviewslength);
 // end of reviews
  useEffect(() => {
    if (product) {
      dispatch(addToRecentlyViewed(product));
      if (product?.category?._id) {
        dispatch(
          fetchProductsByCategory({
            categoryId: product.category._id,
            excludeId: product._id,
          })
        );
      }
    }
  }, [dispatch, product]);

  useEffect(() => {
    // Reset states when product is loading or unavailable
    if (!product || !product.images) {
      setMainImage(null);
      setSelectedColor(null);
      return;
    }
  
    // Only update if we have images and the current values are different
    if (product.images.length > 0) {
      const firstImage = product.images[0];
      setMainImage(prev => prev !== firstImage.url ? firstImage.url : prev);
      setSelectedColor(prev => prev !== firstImage.color ? firstImage.color : prev);
    } else {
      setMainImage(null);
      setSelectedColor(null);
    }
  }, [product]); // Only runs when product reference changes

  const handleWishlistToggle = () => {
    setWishlist(!wishlist);
    toast.success(wishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const imageIndex = product.images.findIndex((img) => img.color === color);
    if (imageIndex >= 0) handleImageChange(imageIndex);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setMainImage(product.images[index].url);
    setSelectedColor(product.images[index].color);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const addProductToCart = () => {
    if (quantity > 0) {
      const variant =
        product.variants?.find((v) => v.color === selectedColor) || {};
      const payload = {
        id: `${product._id}-${selectedColor || "default"}`,
        productId: product._id,
        img: mainImage,
        name: product.name,
        price: variant.price || product.discountPrice || product.price,
        quantity,
        color: selectedColor,
        maxQuantity: product.stock,
        title: product.name
      };
      dispatch(addToCart(payload));
      toast.success("Added to Cart!");
    }
  };

  const renderSpecValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {Object.entries(value).map(([key, val]) => (
            <li key={key} className="text-gray-700">
              <span className="font-medium">{key}:</span> {val}
            </li>
          ))}
        </ul>
      );
    }
    return value;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>Failed to load product details. Please try again later.</p>
          <button
            onClick={() => dispatch(fetchProductById(id))}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar setShowCart={setShowCart} />
      {showCart && <Cart setShowCart={setShowCart} />}

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          category={product.category?.name}
          productName={product.name}
        />
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row gap-6 p-4">
            {/* Image Gallery */}
            <div className="lg:w-1/2">
              <div
                className={`relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 cursor-${
                  isZoomed ? "zoom-out" : "zoom-in"
                }`}
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={`/images/products/${mainImage}`}
                  alt={product.name}
                  fill
                  className="object-contain"
                  style={{
                    transform: isZoomed
                      ? `scale(2) translate(${zoomPosition.x * 50}%, ${
                          zoomPosition.y * 50
                        }%)`
                      : "none",
                    transformOrigin: `${zoomPosition.x * 100}% ${
                      zoomPosition.y * 100
                    }%`,
                  }}
                  priority
                />

                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white"
                    >
                      <FiChevronLeft className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white"
                    >
                      <FiChevronRight className="w-4 h-4 text-gray-800" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto py-1">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${
                      currentImageIndex === index
                        ? "border-blue-500 ring-1 ring-blue-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={`/images/products/${image.url}`}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-1.5 rounded-full ${
                    wishlist ? "text-red-500" : "text-gray-400"
                  } hover:text-red-500`}
                >
                  <FiHeart
                    className={`w-5 h-5 ${wishlist ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <div className="flex items-center mb-2">
              {stars}
            </div>

              {/* Price */}
              <div className="py-2">
                {product.discountPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded">
                      {Math.round(
                        (1 - product.discountPrice / product.price) * 100
                      )}
                      % OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-sm">
                {product.shortDescription || product.description}
              </p>

              {/* Color Selection */}
              {product.images?.length > 1 && (
                <div className="pt-1">
                  <h3 className="text-xs font-medium text-gray-900 mb-1">
                    Color:{" "}
                    <span className="font-normal capitalize">
                      {selectedColor}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {product.images?.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`rounded-full w-8 h-8 border-2 ${
                          currentImageIndex === index
                            ? "border-blue-500 ring-1 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{
                          backgroundColor:
                            image.color === "black"
                              ? "#111"
                              : image.color === "white"
                              ? "#eee"
                              : image.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Variants */}
              {product.variants?.some((v) => v.storage) && (
                <div className="pt-1">
                  <h3 className="text-xs font-medium text-gray-900 mb-1">
                    Storage Options
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(product.variants.map((v) => v.storage))].map(
                      (storage, index) => (
                        <button
                          key={index}
                          className={`px-3 py-1 text-xs border rounded-md ${
                            selectedColor &&
                            product.variants.find(
                              (v) =>
                                v.color === selectedColor &&
                                v.storage === storage
                            )
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {storage}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="pt-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-medium text-gray-900">Size</h3>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className="border border-gray-300 rounded-sm py-1 px-2 text-xs text-center hover:bg-gray-50"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="pt-2">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Quantity
                </h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-sm hover:bg-gray-100"
                  >
                    -
                  </button>
                  <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3">
                <button
                  onClick={addProductToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-2 px-4 rounded-sm text-sm font-medium flex items-center justify-center gap-1 ${
                    product.stock > 0
                      ? "bg-green-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-sm text-sm font-medium"
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">Category:</span>
                    <span className="font-medium">
                      {product.category?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">Brand:</span>
                    <span className="font-medium">
                      {product.brand?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">Warranty:</span>
                    <span className="font-medium">
                      {product.warranty || "1 year"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">SKU:</span>
                    <span className="font-medium">
                      {product._id?.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-2">
                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs">
                  <FiShare2 className="w-3 h-3" />
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
                className={`py-3 px-4 text-center border-b-2 text-xs font-medium ${
                  activeTab === "description"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              {product.specifications?.length > 0 && (
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`py-3 px-4 text-center border-b-2 text-xs font-medium ${
                    activeTab === "specs"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                </button>
              )}
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-3 px-4 text-center border-b-2 text-xs font-medium ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({reviewslength?.length})
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-3 px-4 text-center border-b-2 text-xs font-medium ${
                  activeTab === "shipping"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Shipping & Returns
              </button>
            </nav>

            <div className="p-4">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-700 space-y-3">
                    {product.fullDescription
                      ?.split("\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      )) || product.description}
                  </div>

                  {product.features?.length > 0 && (
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        Key Features
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        Included in the Box
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li>{product.name}</li>
                        <li>Power Adapter</li>
                        <li>User Manual</li>
                        <li>Warranty Card</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        Product Highlights
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {product.highlights?.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        )) ||
                          [
                            "Premium quality materials",
                            "Advanced technology",
                            "User-friendly design",
                            "Long-lasting performance",
                          ].map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && product.specifications?.length > 0 && (
                <div className="overflow-hidden border border-gray-200 rounded-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-500 bg-gray-50 w-1/3">
                            {spec.key}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-900">
                            {renderSpecValue(spec.value)}
                            {spec.unit && ` ${spec.unit}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <ReviewForm productId={id} />
                  <ReviewsDisplay productId={id} />
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <DeliveryInfo />
                  <ReturnPolicy />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              You May Also Like
            </h2>
            <ProductCarousel products={relatedProducts} />
          </div>
        )}
      {/* Recently Viewed Section */}
      {recentlyViewed?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
          <ProductCarousel 
          products={recentlyViewed.filter(p => p._id !== product?._id)} 
          />
        </div>
      )}
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
