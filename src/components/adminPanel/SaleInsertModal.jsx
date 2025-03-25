"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { makeToast } from "../../../utils/helpers";
import { fetchCategories } from "@/redux/features/categorySlice";
import { fetchProducts } from "@/redux/features/productSlice";
import { createSale } from "@/redux/features/saleSlice";

const SaleInsertModal = ({ openPopup, setOpenPopup, setUpdateTable, updateTable }) => {
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
      makeToast("Sale added successfully!");
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
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
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 ${
        openPopup ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-4 top-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add Sale
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Category Select */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={inputData.category}
              onChange={(e) =>
                setInputData({ ...inputData, category: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            <div>
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          {/* Product Select */}
          {inputData.subCategory && (
            <div>
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
                onChange={
                  (e) =>
                    setInputData({
                      ...inputData,
                      product: e.target.value || null,
                    }) // Send null if empty
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

          {/* Input fields for other saleData properties */}
          <div>
            <label
              htmlFor="originalPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Original Price
            </label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={inputData.originalPrice}
              onChange={(e) =>
                setInputData({ ...inputData, originalPrice: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="discountPercentage"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Percentage
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={inputData.discountPercentage}
              onChange={handleDiscountChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="salePrice"
              className="block text-sm font-medium text-gray-700"
            >
              Sale Price
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={inputData.salePrice}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></input>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={inputData.title}
              onChange={(e) =>
                setInputData({ ...inputData, title: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={inputData.type}
              onChange={(e) =>
                setInputData({ ...inputData, type: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="sale">Sale</option>
              <option value="banner">Banner</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="saleStartDate"
              className="block text-sm font-medium text-gray-700"
            >
              Sale Start Date
            </label>
            <input
              type="date" // Change to datetime-local
              id="saleStartDate"
              name="saleStartDate"
              value={inputData.saleStartDate}
              onChange={(e) =>
                setInputData({ ...inputData, saleStartDate: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="saleEndDate"
              className="block text-sm font-medium text-gray-700"
            >
              Sale End Date
            </label>
            <input
              type="date" // Change to datetime-local
              id="saleEndDate"
              name="saleEndDate"
              value={inputData.saleEndDate}
              onChange={(e) =>
                setInputData({ ...inputData, saleEndDate: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700">
            Bonus
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
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
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
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Terms and Conditions
            </label>
            {inputData.termsAndConditions.map((term, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleTermsChange(index, e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTerm(index)}
                    className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTerm}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Term
            </button>
          </div>

          <div>
            <label
              htmlFor="isActive"
              className="block text-sm font-medium text-gray-700"
            >
              Is Active
            </label>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={inputData.isActive}
              onChange={(e) =>
                setInputData({ ...inputData, isActive: e.target.checked })
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label
              htmlFor="isFeatured"
              className="block text-sm font-medium text-gray-700"
            >
              Is Featured
            </label>
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={inputData.isFeatured}
              onChange={(e) =>
                setInputData({ ...inputData, isFeatured: e.target.checked })
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={inputData.tags}
              onChange={(e) =>
                setInputData({ ...inputData, tags: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Discount">Discount</option>
              <option value="Pre-Order">Pre-Order</option>
              <option value="Bundle">Bundle</option>
              <option value="Flash Sale">Flash Sale</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="stockQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Quantity
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={inputData.stockQuantity}
              onChange={(e) =>
                setInputData({ ...inputData, stockQuantity: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="usageLimit"
              className="block text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default SaleInsertModal;
