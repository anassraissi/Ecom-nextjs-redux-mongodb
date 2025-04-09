"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { makeToast } from "../../../utils/helpers";
import { fetchCategories } from "@/redux/features/categorySlice";
import { fetchProducts } from "@/redux/features/productSlice";
import { createSale } from "@/redux/features/saleSlice";

const SaleInsertModal = ({
  openPopup,
  setOpenPopup,
  setUpdateTable,
  updateTable,
}) => {
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    product: "",
    category: "",
    subCategory: "",
    originalPrice: "",
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    image: null,
    title: "",
    description: "",
    occasion: "",
    type: "sale",
    couponCode: "",
    discountPercentage: "",
    isActive: true,
    isFeatured: false,
    tags: "",
    saleType: "Discount",
    priority: 0,
    stockQuantity: "",
    usageLimit: "",
    bonus: {
      bonusTitle: "",
      bonusDescription: "",
    },
    termsAndConditions: [""],
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
  const parentlessCategories = categories
    ? categories.filter((category) => !category.parent)
    : [];
  const subCategories = categories
    ? categories.filter((category) => category.parent === inputData.category)
    : [];
  const filteredProducts = products
    ? products.filter(
        (product) => product.category._id == inputData.subCategory
      )
    : [];

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData({ ...inputData, image: file });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !inputData.category ||
        !inputData.originalPrice ||
        !inputData.salePrice ||
        !inputData.image ||
        !inputData.title ||
        !inputData.type
      ) {
        makeToast("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("product", inputData.product);
      formData.append("category", inputData.category);
      formData.append("subCategory", inputData.subCategory);
      formData.append("originalPrice", inputData.originalPrice);
      formData.append("salePrice", inputData.salePrice);
      formData.append("image", inputData.image);
      formData.append("title", inputData.title);
      formData.append("description", inputData.description);
      formData.append("occasion", inputData.occasion);
      formData.append("type", inputData.type);
      formData.append("couponCode", inputData.couponCode);
      formData.append("discountPercentage", inputData.discountPercentage);
      formData.append("isActive", inputData.isActive.toString());
      formData.append("isFeatured", inputData.isFeatured.toString());
      formData.append("tags", inputData.tags);
      formData.append("saleType", inputData.saleType);
      formData.append("priority", inputData.priority);
      formData.append("stockQuantity", inputData.stockQuantity);
      formData.append("usageLimit", inputData.usageLimit);
      formData.append("saleStartDate", inputData.saleStartDate);
      formData.append("saleEndDate", inputData.saleEndDate);
      formData.append("bonus[bonusTitle]", inputData.bonus.bonusTitle);
      formData.append(
        "bonus[bonusDescription]",
        inputData.bonus.bonusDescription
      );
      inputData.termsAndConditions.forEach((term, index) => {
        formData.append(`termsAndConditions[${index}]`, term);
      });

      dispatch(createSale(formData));
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
      makeToast("Sale added successfully!");
    } catch (error) {
      console.error("Error adding sale:", error);
      makeToast("Error adding sale. Please try again.");
    }
  };

  const handleTermsChange = (index, value) => {
    const newTerms = [...inputData.termsAndConditions];
    newTerms[index] = value;
    setInputData({ ...inputData, termsAndConditions: newTerms });
  };

  const addTerm = () => {
    setInputData({
      ...inputData,
      termsAndConditions: [...inputData.termsAndConditions, ""],
    });
  };

  const removeTerm = (index) => {
    const newTerms = inputData.termsAndConditions.filter((_, i) => i !== index);
    setInputData({ ...inputData, termsAndConditions: newTerms });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        openPopup
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative p-8 transform transition-all duration-300 scale-100">
        <button
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setOpenPopup(false)}
          aria-label="Close modal"
        >
          <IoIosCloseCircleOutline className="text-2xl" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Create New Sale
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          {/* Left Column */}
          <div className="space-y-4">
            {/* Category Select */}
            <div className="space-y-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={inputData.category}
                onChange={(e) =>
                  setInputData({ ...inputData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categoryLoading ? (
                  <option disabled>Loading categories...</option>
                ) : categoryError ? (
                  <option disabled>Error: {categoryError}</option>
                ) : (
                  parentlessCategories &&
                  parentlessCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {inputData.category && (
              <div className="space-y-1">
                <label
                  htmlFor="subCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subcategory
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={inputData.subCategory}
                  onChange={(e) =>
                    setInputData({ ...inputData, subCategory: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Product Select */}
            {inputData.subCategory && (
              <div className="space-y-1">
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product
                </label>
                <select
                  id="product"
                  name="product"
                  value={inputData.product}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      product: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            )}

            {/* Pricing Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800">Pricing</h3>

              <div className="space-y-1">
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Original Price *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={inputData.originalPrice}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        originalPrice: e.target.value,
                      })
                    }
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount Percentage
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    value={inputData.discountPercentage}
                    onChange={handleDiscountChange}
                    className="block w-full pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="salePrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sale Price *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={inputData.salePrice}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Sale Dates */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800">Sale Period</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="saleStartDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    id="saleStartDate"
                    name="saleStartDate"
                    value={inputData.saleStartDate}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        saleStartDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="saleEndDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    id="saleEndDate"
                    name="saleEndDate"
                    value={inputData.saleEndDate}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        saleEndDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Sale Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Sale Details
              </h3>

              <div className="space-y-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData({ ...inputData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={inputData.description}
                  onChange={(e) =>
                    setInputData({ ...inputData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={inputData.type}
                  onChange={(e) =>
                    setInputData({ ...inputData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="sale">Sale</option>
                  <option value="banner">Banner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="saleType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sale Type
                </label>
                <select
                  id="saleType"
                  name="saleType"
                  value={inputData.saleType}
                  onChange={(e) =>
                    setInputData({ ...inputData, saleType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Discount">Discount</option>
                  <option value="Pre-Order">Pre-Order</option>
                  <option value="Bundle">Bundle</option>
                  <option value="Flash Sale">Flash Sale</option>
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="couponCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  value={inputData.couponCode}
                  onChange={(e) =>
                    setInputData({ ...inputData, couponCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {/* Occasion Input */}
            <div className="space-y-1">
              <label
                htmlFor="occasion"
                className="block text-sm font-medium text-gray-700"
              >
                Occasion
              </label>
              <input
                type="text"
                id="occasion"
                name="occasion"
                value={inputData.occasion}
                onChange={(e) =>
                  setInputData({ ...inputData, occasion: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4 border-t pt-2">
              <h3 className="text-lg font-medium text-gray-800">Media</h3>

              <div className="space-y-1">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800">Bonus Offer</h3>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Bonus Title
                </label>
                <input
                  type="text"
                  placeholder="Bonus Title"
                  value={inputData.bonus.bonusTitle}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      bonus: { ...inputData.bonus, bonusTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Bonus Description
                </label>
                <textarea
                  placeholder="Bonus Description"
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
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Full Width Bottom Section */}
          <div className="md:col-span-2 space-y-4 border-t pt-4">
            {/* Terms and Conditions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Terms and Conditions
              </label>
              {inputData.termsAndConditions.map((term, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleTermsChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Term ${index + 1}`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeTerm(index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTerm}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                + Add Term
              </button>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Inventory
                </label>
                <div className="space-y-1">
                  <label
                    htmlFor="stockQuantity"
                    className="block text-xs text-gray-500"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={inputData.stockQuantity}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        stockQuantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="usageLimit"
                    className="block text-xs text-gray-500"
                  >
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={inputData.usageLimit}
                    onChange={(e) =>
                      setInputData({ ...inputData, usageLimit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Settings
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={inputData.isActive}
                    onChange={(e) =>
                      setInputData({ ...inputData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Is Active
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={inputData.isFeatured}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="text-sm text-gray-700">
                    Is Featured
                  </label>
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="priority"
                    className="block text-xs text-gray-500"
                  >
                    Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={inputData.priority}
                    onChange={(e) =>
                      setInputData({ ...inputData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={inputData.tags}
                  onChange={(e) =>
                    setInputData({ ...inputData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Comma separated tags"
                />
                <p className="text-xs text-gray-500">
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue hover:bg-blue text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Sale
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleInsertModal;
