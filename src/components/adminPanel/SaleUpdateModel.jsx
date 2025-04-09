"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { makeToast } from "../../../utils/helpers";
import { fetchCategories } from "@/redux/features/categorySlice";
import { fetchProducts } from "@/redux/features/productSlice";
import { updateSaleAsync } from "@/redux/features/saleSlice";

const SaleUpdateModal = ({
  setUpdateModalIsOpen,
  updateModalIsOpen,
  setUpdateTable,
  saleToUpdate,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [inputData, setInputData] = useState({
    product: saleToUpdate?.product || null,
    category: saleToUpdate?.category || "",
    subCategory: saleToUpdate?.subCategory || "",
    originalPrice: saleToUpdate?.originalPrice || "",
    salePrice: saleToUpdate?.salePrice || "",
    saleStartDate: saleToUpdate?.saleStartDate
      ? new Date(saleToUpdate.saleStartDate).toISOString().split("T")[0]
      : "",
    saleEndDate: saleToUpdate?.saleEndDate
      ? new Date(saleToUpdate.saleEndDate).toISOString().split("T")[0]
      : "",
    image: saleToUpdate?.image || null,
    title: saleToUpdate?.title || "",
    description: saleToUpdate?.description || "",
    occasion: saleToUpdate?.occasion || "",
    type: saleToUpdate?.type || "sale",
    couponCode: saleToUpdate?.couponCode || "",
    discountPercentage: "",
    isActive: saleToUpdate?.isActive || true,
    isFeatured: saleToUpdate?.isFeatured || false,
    tags: saleToUpdate?.tags || "",
    saleType: saleToUpdate?.saleType || "Discount",
    priority: saleToUpdate?.priority || 0,
    stockQuantity: saleToUpdate?.stockQuantity || "",
    usageLimit: saleToUpdate?.usageLimit || "",
    bonus: {
      bonusTitle: saleToUpdate?.bonus?.bonusTitle || "",
      bonusDescription: saleToUpdate?.bonus?.bonusDescription || "",
    },
    termsAndConditions:
      saleToUpdate?.termsAndConditions?.length > 0
        ? [...saleToUpdate.termsAndConditions]
        : [""],
  });

  const {
    products,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.products);
  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((state) => state.categories);

  const parentlessCategories = useMemo(
    () => categories?.filter((category) => !category.parent) || [],
    [categories]
  );

  const subCategories = useMemo(
    () =>
      categories?.filter(
        (category) => category.parent === inputData.category
      ) || [],
    [categories, inputData.category]
  );

  const filteredProducts = useMemo(() => {
    if (!products || !inputData.subCategory) return [];
    return products.filter(
      (product) => product.category?._id === inputData.subCategory
    );
  }, [products, inputData.subCategory]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());

    if (saleToUpdate?.originalPrice && saleToUpdate?.salePrice) {
      const originalPrice = parseFloat(saleToUpdate.originalPrice);
      const salePrice = parseFloat(saleToUpdate.salePrice);
      if (originalPrice > 0 && salePrice >= 0) {
        const discount = ((originalPrice - salePrice) / originalPrice) * 100;
        setInputData((prev) => ({
          ...prev,
          discountPercentage: discount.toFixed(2),
        }));
      }
    }
  }, [dispatch, saleToUpdate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        makeToast("Please select an image file (JPEG, PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        makeToast("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleDiscountChange = (e) => {
    const discount = parseFloat(e.target.value) || 0;
    const originalPrice = parseFloat(inputData.originalPrice) || 0;
    const salePrice = originalPrice - originalPrice * (discount / 100);
    setInputData({
      ...inputData,
      discountPercentage: discount,
      salePrice: salePrice.toFixed(2),
    });
  };

  const handleOriginalPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) return;
    const originalPrice = value || 0;
    setInputData({
      ...inputData,
      originalPrice: originalPrice.toFixed(2),
    });
    calculateDiscountPercentage(
      originalPrice,
      parseFloat(inputData.salePrice) || 0
    );
  };

  const handleSalePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) return;
    const salePrice = value || 0;
    setInputData({
      ...inputData,
      salePrice: salePrice.toFixed(2),
    });
    calculateDiscountPercentage(
      parseFloat(inputData.originalPrice) || 0,
      salePrice
    );
  };

  const calculateDiscountPercentage = (originalPrice, salePrice) => {
    if (originalPrice > 0 && salePrice >= 0) {
      const discount = ((originalPrice - salePrice) / originalPrice) * 100;
      setInputData({
        ...inputData,
        discountPercentage: discount.toFixed(2),
      });
    } else {
      setInputData({
        ...inputData,
        discountPercentage: "0",
      });
    }
  };

  const handleTermsChange = (index, value) => {
    const newTerms = [...inputData.termsAndConditions];
    newTerms[index] = value;
    setInputData({
      ...inputData,
      termsAndConditions: newTerms,
    });
  };

  const addTerm = () => {
    if (inputData.termsAndConditions.length >= 10) {
      makeToast("Maximum 10 terms allowed");
      return;
    }
    setInputData({
      ...inputData,
      termsAndConditions: [...inputData.termsAndConditions, ""],
    });
  };

  const removeTerm = (index) => {
    if (inputData.termsAndConditions.length <= 1) {
      makeToast("At least one term is required");
      return;
    }
    const newTerms = inputData.termsAndConditions.filter((_, i) => i !== index);
    setInputData({
      ...inputData,
      termsAndConditions: newTerms,
    });
  };

  const appendFormData = (formData, key, value) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !inputData.originalPrice ||
        !inputData.salePrice ||
        !inputData.title ||
        !inputData.type ||
        !inputData.saleStartDate ||
        !inputData.saleEndDate
      ) {
        makeToast("Please fill in all required fields.");
        return;
      }

      // Validate dates
      if (
        new Date(inputData.saleEndDate) <= new Date(inputData.saleStartDate)
      ) {
        makeToast("End date must be after start date");
        return;
      }

      // Validate prices
      if (
        parseFloat(inputData.salePrice) >= parseFloat(inputData.originalPrice)
      ) {
        makeToast("Sale price must be less than original price");
        return;
      }

      const formData = new FormData();

      // Append all fields
      appendFormData(formData, "product", inputData.product);
      appendFormData(formData, "category", inputData.category);
      appendFormData(formData, "subCategory", inputData.subCategory);
      appendFormData(formData, "originalPrice", inputData.originalPrice);
      appendFormData(formData, "salePrice", inputData.salePrice);

      // Handle image upload
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (inputData.image) {
        formData.append("oldImage", inputData.image);
      }

      // Append other fields
      appendFormData(formData, "title", inputData.title);
      appendFormData(formData, "description", inputData.description);
      appendFormData(formData, "occasion", inputData.occasion);
      appendFormData(formData, "type", inputData.type);
      appendFormData(formData, "couponCode", inputData.couponCode);
      appendFormData(formData, "isActive", inputData.isActive);
      appendFormData(formData, "isFeatured", inputData.isFeatured);
      appendFormData(formData, "tags", inputData.tags);
      appendFormData(formData, "saleType", inputData.saleType);
      appendFormData(formData, "priority", inputData.priority);
      appendFormData(formData, "stockQuantity", inputData.stockQuantity);
      appendFormData(formData, "usageLimit", inputData.usageLimit);
      appendFormData(formData, "saleStartDate", inputData.saleStartDate);
      appendFormData(formData, "saleEndDate", inputData.saleEndDate);
      appendFormData(formData, "bonus[bonusTitle]", inputData.bonus.bonusTitle);
      appendFormData(
        formData,
        "bonus[bonusDescription]",
        inputData.bonus.bonusDescription
      );

      // Handle terms and conditions
      inputData.termsAndConditions
        .filter((term) => term.trim() !== "")
        .forEach((term, index) => {
          formData.append(`termsAndConditions[${index}]`, term);
        });

      dispatch(
        updateSaleAsync({
          id: saleToUpdate._id,
          saleData: formData,
        })
      );
      setUpdateTable((prev) => !prev);
      setUpdateModalIsOpen(false);
      makeToast("Sale updated successfully!");
    } catch (error) {
      console.error("Error updating sale:", error);
      makeToast(error.message || "Error updating sale. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUpdateModalIsOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity ${
        updateModalIsOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative mx-4 w-full max-w-4xl rounded-xl bg-white shadow-2xl transition-all duration-300">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Update Sale</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
          >
            <IoIosCloseCircleOutline className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputData.category}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      category: e.target.value,
                      subCategory: "",
                      product: null,
                    })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  {categoryLoading ? (
                    <option disabled>Loading categories...</option>
                  ) : categoryError ? (
                    <option disabled>Error: {categoryError}</option>
                  ) : (
                    parentlessCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {inputData.category && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <select
                    value={inputData.subCategory}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        subCategory: e.target.value,
                        product: null,
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories.map((subCategory) => (
                      <option key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Product
              </label>
              <select
                value={inputData.product || ""}
                onChange={(e) =>
                  setInputData({
                    ...inputData,
                    product: e.target.value || null,
                  })
                }
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                disabled={!inputData.subCategory || isSubmitting}
              >
                <option value="">Select Product</option>
                {productLoading ? (
                  <option disabled>Loading products...</option>
                ) : productError ? (
                  <option disabled>Error: {productError}</option>
                ) : (
                  filteredProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Pricing Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Pricing Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Original Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={inputData.originalPrice}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setInputData((prev) => ({
                          ...prev,
                          originalPrice: value.toFixed(2),
                          // Recalculate discount when original price changes
                          discountPercentage:
                            value > 0
                              ? (
                                  ((value - parseFloat(prev.salePrice || 0)) /
                                    value) *
                                  100
                                ).toFixed(2)
                              : "0",
                        }));
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Sale Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={inputData.salePrice}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setInputData((prev) => ({
                          ...prev,
                          salePrice: value.toFixed(2),
                          // Recalculate discount when sale price changes
                          discountPercentage:
                            parseFloat(prev.originalPrice || 0) > 0
                              ? (
                                  ((parseFloat(prev.originalPrice) - value) /
                                    parseFloat(prev.originalPrice)) *
                                  100
                                ).toFixed(2)
                              : "0",
                        }));
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Discount %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputData.discountPercentage}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        const originalPrice =
                          parseFloat(inputData.originalPrice) || 0;
                        setInputData((prev) => ({
                          ...prev,
                          discountPercentage: discount.toFixed(2),
                          // Recalculate sale price when discount changes
                          salePrice: (
                            originalPrice -
                            originalPrice * (discount / 100)
                          ).toFixed(2),
                        }));
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sale Image
              </label>
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Choose File
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                        disabled={isSubmitting}
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {imageFile ? imageFile.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG (Max 2MB)
                  </p>
                </div>
                {(imagePreview || inputData.image) && (
                  <div className="flex-shrink-0">
                    <img
                      src={
                        imagePreview ||
                        (inputData.image.startsWith("/")
                          ? inputData.image
                          : `/images/sales/${inputData.image}`)
                      }
                      alt="Sale Preview"
                      className="h-24 w-24 rounded-lg object-cover shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData({ ...inputData, title: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sale Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputData.type}
                  onChange={(e) =>
                    setInputData({ ...inputData, type: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="sale">Sale</option>
                  <option value="banner">Banner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={inputData.description}
                onChange={(e) =>
                  setInputData({ ...inputData, description: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Occasion Field - Small Input */}
            <div className="w-full md:w-1/2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Occasion
              </label>
              <input
                type="text"
                value={inputData.occasion}
                onChange={(e) =>
                  setInputData({ ...inputData, occasion: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Christmas, New Year"
                disabled={isSubmitting}
              />
            </div>

            {/* Date Range */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Date Range
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={inputData.saleStartDate}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        saleStartDate: e.target.value,
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={inputData.saleEndDate}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        saleEndDate: e.target.value,
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Status & Options */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Active Status
                    </label>
                    <select
                      value={inputData.isActive}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Featured Status
                    </label>
                    <select
                      value={inputData.isFeatured}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          isFeatured: e.target.value === "true",
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="true">Featured</option>
                      <option value="false">Not Featured</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Additional Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Sale Type
                    </label>
                    <select
                      value={inputData.saleType}
                      onChange={(e) =>
                        setInputData({ ...inputData, saleType: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="Discount">Discount</option>
                      <option value="Coupon">Coupon</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={inputData.couponCode}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          couponCode: e.target.value,
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus Information */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Bonus Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bonus Title
                  </label>
                  <input
                    type="text"
                    value={inputData.bonus.bonusTitle}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        bonus: {
                          ...inputData.bonus,
                          bonusTitle: e.target.value,
                        },
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bonus Description
                  </label>
                  <textarea
                    value={inputData.bonus.bonusDescription}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        bonus: {
                          ...inputData.bonus,
                          bonusDescription: e.target.value,
                        },
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">
                  Terms and Conditions
                </h3>
                <button
                  type="button"
                  onClick={addTerm}
                  className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                  disabled={
                    isSubmitting || inputData.termsAndConditions.length >= 10
                  }
                >
                  Add Term
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {inputData.termsAndConditions.map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={term}
                        onChange={(e) =>
                          handleTermsChange(index, e.target.value)
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder={`Term ${index + 1}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTerm(index)}
                        className="rounded-full p-1 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="rounded-lg bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
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
                  "Update Sale"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaleUpdateModal;
