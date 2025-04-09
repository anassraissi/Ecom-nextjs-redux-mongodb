"use client";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import { makeToast } from "../../../utils/helpers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import {
  addImage,
  removeImage,
  updateProduct,
} from "@/redux/features/productSlice";

const PopupProductUpdate = ({
  setOpenPopup,
  setUpdateTable,
  productToUpdate,
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef(null);

  // Helper function to safely handle specifications
  const safeStringifySpecs = (specs) => {
    try {
      if (!specs) return "[]";
      
      // Handle case where specs might already be a string
      if (typeof specs === 'string') {
        // If it's a string but empty, return empty array
        if (specs.trim() === '') return "[]";
        // Try to parse it to verify it's valid JSON
        const parsed = JSON.parse(specs);
        return JSON.stringify(parsed, null, 2);
      }
      
      // Handle case where specs is already an array/object
      if (typeof specs === 'object') {
        return JSON.stringify(specs, null, 2);
      }
      
      return "[]";
    } catch (e) {
      console.error("Error formatting specifications:", e);
      return "[]";
    }
  };

  const updateVariantField = (index, field, value) => {
    const variants = JSON.parse(inputData.variants);
    variants[index][field] = value;
    
    // Auto-generate SKU if color and storage are filled
    if ((field === "color" || field === "storage") && 
        variants[index].color && 
        variants[index].storage) {
      variants[index].sku = `IP16-${variants[index].color.slice(0, 3).toUpperCase()}-${variants[index].storage}`;
    }
  
    setInputData({
      ...inputData,
      variants: JSON.stringify(variants, null, 2),
    });
  };


  // Helper to validate specifications format
  const isValidSpecs = (specs) => {
    try {
      const parsed = typeof specs === "string" ? JSON.parse(specs) : specs;
      return (
        Array.isArray(parsed) &&
        parsed.every(
          (item) =>
            item.key &&
            ["string", "number", "boolean", "array", "object"].includes(
              item.valueType
            )
        )
      );
    } catch {
      return false;
    }
  };

  // Initialize state with product data or empty values
  const [inputData, setInputData] = useState({
    name: productToUpdate?.name || "",
    description: productToUpdate?.description || "",
    price: productToUpdate?.price || "",
    discountPrice: productToUpdate?.discountPrice || "",
    stock: productToUpdate?.stock || "",
    category: productToUpdate?.category?._id || "",
    brand: productToUpdate?.brand?._id || "",
    manufactureYear: productToUpdate?.manufactureYear || "",
    tags: productToUpdate?.tags?.join(", ") || "",
    userID: productToUpdate?.userID?._id || "",
    images: productToUpdate?.images || [],
    specifications: productToUpdate?.specifications
    ? safeStringifySpecs(
        typeof productToUpdate.specifications === 'string' 
          ? JSON.parse(productToUpdate.specifications)
          : productToUpdate.specifications
      )
    : "[]",
    variants: productToUpdate?.variants
      ? JSON.stringify(productToUpdate.variants, null, 2)
      : "[]",
    slug: productToUpdate?.slug || "",
    weight: productToUpdate?.weight || "",
    dimensions: {
      length: productToUpdate?.dimensions?.length || "",
      width: productToUpdate?.dimensions?.width || "",
      height: productToUpdate?.dimensions?.height || "",
    },
    warranty: productToUpdate?.warranty || "1-year warranty",
  });
  useEffect(() => {
    console.log("Raw specs from DB:", productToUpdate?.specifications);
    console.log("Type of specs:", typeof productToUpdate?.specifications);
    console.log("Processed specs:", inputData.specifications);
  }, [productToUpdate]);


  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [imageColor, setImageColor] = useState("");
  const [showAddImage, setShowAddImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get("/api/category/getCategories"),
          axios.get("/api/brand/getBrands"),
        ]);
        setCategories(categoriesRes.data.filter((c) => c.parent !== null));
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        makeToast("Error loading categories/brands");
      }
    };
    fetchData();
  }, []);

  // Filter brands based on selected category
  useEffect(() => {
    if (inputData.category && categories.length) {
      const selectedCategory = categories.find(
        (c) => c._id === inputData.category
      );
      setFilteredBrands(
        selectedCategory
          ? brands.filter((b) =>
              b.categories.some((c) => c._id === selectedCategory._id)
            )
          : []
      );
    } else {
      setFilteredBrands([]);
    }
  }, [inputData.category, categories, brands]);

  const handleImageUpload = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleAddImage = async () => {
    if (!imageFiles.length || !imageColor) {
      makeToast("Please select images and enter a color");
      return;
    }

    try {
      const uploads = imageFiles.map((file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("productId", productToUpdate._id);
        formData.append("color", imageColor);
        return axios.post("/api/products/edit_product/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      const responses = await Promise.all(uploads);
      const newImages = responses.map((res) => res.data.image);

      dispatch(
        addImage({
          images: newImages,
          productId: productToUpdate._id,
        })
      );

      setInputData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setImageFiles([]);
      setImageColor("");
      makeToast("Images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      makeToast("Failed to upload images");
    }
  };

  const handleDeleteImage = async (index, imageUrl) => {
    try {
      await axios.delete(
        `/api/products/removeImageProduct/${productToUpdate._id}`,
        {
          data: { imageUrl },
        }
      );

      dispatch(
        removeImage({
          productId: productToUpdate._id,
          imageUrl,
        })
      );

      setInputData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));

      makeToast("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      makeToast("Failed to delete image");
    }
  };

  const isValidJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate JSON fields
    if (!isValidJson(inputData.specifications) || !isValidJson(inputData.variants)) {
      makeToast("Invalid JSON in specifications or variants");
      setIsSubmitting(false);
      return;
    }

    // Validate specifications format
    if (!isValidSpecs(inputData.specifications)) {
      makeToast("Invalid specifications format. Please check the structure.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Parse specifications to ensure proper format
      const specs = JSON.parse(inputData.specifications);
      const variants = JSON.parse(inputData.variants);

      // Add all fields to formData
      Object.entries({
        ...inputData,
        specifications: specs,
        variants: variants
      }).forEach(([key, value]) => {
        if (key === 'dimensions') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'specifications' || key === 'variants') {
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'images') {
          formData.append(key, value);
        }
      });

      // Add images
      inputData.images.forEach((img) => {
        formData.append("images", img.url);
        formData.append("imageColors", img.color);
      });

      const response = await axios.put(
        `/api/products/edit_product/${productToUpdate._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(updateProduct(response.data));
      makeToast("Product updated successfully");
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error("Update error:", error);
      makeToast(error.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-4xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Update Product
          </h2>
          <button
            onClick={() => setOpenPopup(false)}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <IoIosCloseCircleOutline className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputData.name}
                  onChange={(e) =>
                    setInputData({ ...inputData, name: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Manufacture Year
                </label>
                <input
                  type="number"
                  value={inputData.manufactureYear}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      manufactureYear: e.target.value,
                    })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={inputData.description}
                onChange={(e) =>
                  setInputData({ ...inputData, description: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Pricing Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Pricing Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={inputData.price}
                      onChange={(e) =>
                        setInputData({ ...inputData, price: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={inputData.discountPrice}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          discountPrice: e.target.value,
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={inputData.stock}
                    onChange={(e) =>
                      setInputData({ ...inputData, stock: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={inputData.category}
                  onChange={(e) =>
                    setInputData({ ...inputData, category: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <select
                  value={inputData.brand}
                  onChange={(e) =>
                    setInputData({ ...inputData, brand: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={!filteredBrands.length}
                >
                  <option value="">Select Brand</option>
                  {filteredBrands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={inputData.tags}
                onChange={(e) =>
                  setInputData({ ...inputData, tags: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., electronics, gadget, tech"
              />
            </div>
            {/* specifications */}

            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Technical Specifications</h3>
              <button
                type="button"
                onClick={() => {
                  const currentSpecs = JSON.parse(inputData.specifications || "[]");
                  setInputData({
                    ...inputData,
                    specifications: JSON.stringify(
                      [...currentSpecs, { key: "", value: "", valueType: "string" }],
                      null,
                      2
                    ),
                  });
                }}
                className="flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
              >
                <PlusIcon className="h-4 w-4" />
                Add Specification
              </button>
            </div>
          
            {JSON.parse(inputData.specifications || "[]").map((spec, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 rounded-lg border p-3">
                <div className="col-span-4">
                  <label className="mb-1 block text-sm font-medium">Key</label>
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => {
                      const specs = JSON.parse(inputData.specifications);
                      specs[index].key = e.target.value;
                      setInputData({
                        ...inputData,
                        specifications: JSON.stringify(specs, null, 2),
                      });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. Display"
                  />
                </div>
          
                <div className="col-span-5">
                  <label className="mb-1 block text-sm font-medium">Value</label>
                  {spec.valueType === "boolean" ? (
                    <select
                      value={spec.value}
                      onChange={(e) => {
                        const specs = JSON.parse(inputData.specifications);
                        specs[index].value = e.target.value === "true";
                        setInputData({
                          ...inputData,
                          specifications: JSON.stringify(specs, null, 2),
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <input
                      type={spec.valueType === "number" ? "number" : "text"}
                      value={spec.value}
                      onChange={(e) => {
                        const specs = JSON.parse(inputData.specifications);
                        specs[index].value =
                          spec.valueType === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                        setInputData({
                          ...inputData,
                          specifications: JSON.stringify(specs, null, 2),
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={
                        spec.valueType === "number" ? "e.g. 8" : "e.g. Super Retina XDR"
                      }
                    />
                  )}
                </div>
          
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <select
                    value={spec.valueType}
                    onChange={(e) => {
                      const specs = JSON.parse(inputData.specifications);
                      specs[index].valueType = e.target.value;
                      // Reset value when changing type
                      specs[index].value = "";
                      setInputData({
                        ...inputData,
                        specifications: JSON.stringify(specs, null, 2),
                      });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="string">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Yes/No</option>
                    <option value="array">Multiple</option>
                    <option value="object">Detailed</option>
                  </select>
                </div>
          
                <div className="col-span-1 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const specs = JSON.parse(inputData.specifications);
                      specs.splice(index, 1);
                      setInputData({
                        ...inputData,
                        specifications: JSON.stringify(specs, null, 2),
                      });
                    }}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

            {/* Variants */}
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Product Variants</h3>
              <button
                type="button"
                onClick={() => {
                  const currentVariants = JSON.parse(inputData.variants || "[]");
                  setInputData({
                    ...inputData,
                    variants: JSON.stringify(
                      [
                        ...currentVariants,
                        {
                          color: "",
                          storage: "",
                          price: 0,
                          stock: 0,
                          sku: "",
                        },
                      ],
                      null,
                      2
                    ),
                  });
                }}
                className="flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
              >
                <PlusIcon className="h-4 w-4" />
                Add Variant
              </button>
            </div>
          
            {JSON.parse(inputData.variants || "[]").map((variant, index) => (
              <div
                key={index}
                className="rounded-lg border p-4 transition-all hover:shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  {/* Color */}
                  <div className="md:col-span-3">
                    <label className="mb-1 block text-sm font-medium">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => updateVariantField(index, "color", e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Space Black"
                      />
                      {variant.color && (
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{
                            backgroundColor:
                              variant.color === "Space Black"
                                ? "#1a1a1a"
                                : variant.color === "Silver"
                                ? "#c0c0c0"
                                : variant.color.toLowerCase(),
                          }}
                        />
                      )}
                    </div>
                  </div>
          
                  {/* Storage */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Storage</label>
                    <select
                      value={variant.storage}
                      onChange={(e) => updateVariantField(index, "storage", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
          
                  {/* Price */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariantField(index, "price", Number(e.target.value))
                        }
                        className="block w-full rounded-md border-gray-300 pl-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
          
                  {/* Stock */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariantField(index, "stock", Number(e.target.value))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
          
                  {/* SKU */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">SKU</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariantField(index, "sku", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="IP16PM-BLK-256"
                    />
                  </div>
          
                  {/* Delete */}
                  <div className="flex items-end justify-end md:col-span-1">
                    <button
                      type="button"
                      onClick={() => {
                        const variants = JSON.parse(inputData.variants);
                        variants.splice(index, 1);
                        setInputData({
                          ...inputData,
                          variants: JSON.stringify(variants, null, 2),
                        });
                      }}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

            {/* SEO & Shipping */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SEO Slug
                </label>
                <input
                  type="text"
                  value={inputData.slug}
                  onChange={(e) =>
                    setInputData({ ...inputData, slug: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="product-name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Warranty
                </label>
                <input
                  type="text"
                  value={inputData.warranty}
                  onChange={(e) =>
                    setInputData({ ...inputData, warranty: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="1-year warranty"
                />
              </div>
            </div>

            {/* Shipping Info */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Shipping Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Weight (g)
                  </label>
                  <input
                    type="number"
                    value={inputData.weight}
                    onChange={(e) =>
                      setInputData({ ...inputData, weight: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    value={inputData.dimensions.length}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        dimensions: {
                          ...inputData.dimensions,
                          length: e.target.value,
                        },
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    value={inputData.dimensions.width}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        dimensions: {
                          ...inputData.dimensions,
                          width: e.target.value,
                        },
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={inputData.dimensions.height}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        dimensions: {
                          ...inputData.dimensions,
                          height: e.target.value,
                        },
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">
                  Product Images
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddImage(!showAddImage)}
                  className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  {showAddImage ? "Hide Upload" : "Add Images"}
                </button>
              </div>

              {showAddImage && (
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Upload Images
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Choose Files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          multiple
                          ref={fileInputRef}
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        {imageFiles.length > 0
                          ? `${imageFiles.length} files selected`
                          : "No files chosen"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Image Color
                    </label>
                    <input
                      type="text"
                      value={imageColor}
                      onChange={(e) => setImageColor(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Red, Blue, Black"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={!imageFiles.length || !imageColor}
                  >
                    Upload Images
                  </button>
                </div>
              )}

              {/* Existing Images */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-medium text-gray-700">
                  Existing Images
                </h4>
                {inputData.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {inputData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={
                            image.url.startsWith("/")
                              ? image.url
                              : `/images/products/${image.url}`
                          }
                          alt={`Product image ${index + 1}`}
                          className="h-24 w-full rounded-lg border border-gray-200 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                          <p className="truncate text-xs text-white">
                            {image.color}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index, image.url)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupProductUpdate;