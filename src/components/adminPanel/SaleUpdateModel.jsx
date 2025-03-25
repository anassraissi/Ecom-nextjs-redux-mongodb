"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { makeToast } from "../../../utils/helpers";
import { fetchCategories } from "@/redux/features/categorySlice";
import { fetchProducts } from "@/redux/features/productSlice";
import { updateSale } from "@/redux/features/saleSlice";
import axios from "axios";

const SaleUpdateModal = ({ setUpdateModalIsOpen, updateModalIsOpen, setUpdateTable, saleToUpdate }) => {
  const dispatch = useDispatch();
  console.log('====================================');
  console.log('saleToUpdate', saleToUpdate);
  console.log('====================================');

  const [inputData, setInputData] = useState({
    product: saleToUpdate?.product || null,
    category: saleToUpdate?.category || "",
    subCategory: saleToUpdate?.subCategory || "",
    originalPrice: saleToUpdate?.originalPrice || "",
    salePrice: saleToUpdate?.salePrice || "",
    saleStartDate: saleToUpdate?.saleStartDate
    ? (() => {
        const date = new Date(saleToUpdate.saleStartDate);
        if (isNaN(date.getTime())) {
          return ""; // Or null, depending on your needs
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })()
    : "",
  saleEndDate: saleToUpdate?.saleEndDate
    ? (() => {
        const date = new Date(saleToUpdate.saleEndDate);
        if (isNaN(date.getTime())) {
          return ""; // Or null, depending on your needs
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })()
    : "",
    image: saleToUpdate?.image || null,
    title: saleToUpdate?.title || "",
    description: saleToUpdate?.description || "",
    occasion: saleToUpdate?.occasion || "",
    type: saleToUpdate?.type || "sale",
    couponCode: saleToUpdate?.couponCode || "",
    discountPercentage:"",
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
    termsAndConditions: saleToUpdate?.termsAndConditions || [""],
  });
  console.log('====================================');
  console.log('saleEndDate', saleEndDate);
  console.log('====================================');

  const [imageFile, setImageFile] = useState(null);

  const { products, loading: productLoading, error: productError } = useSelector(
    (state) => state.products
  );
  const { categories, loading: categoryLoading, error: categoryError } = useSelector(
    (state) => state.categories
  );
  const parentlessCategories = categories
    ? categories.filter((category) => !category.parent)
    : [];
  const subCategories = categories
    ? categories.filter((category) => category.parent === inputData.category)
    : [];
  const filteredProducts = products
    ? products.filter((product) => product.category._id == inputData.subCategory)
    : [];
    useEffect(() => {
      dispatch(fetchCategories());
      dispatch(fetchProducts());
      // Calculate discountPercentage on load
      if (saleToUpdate && saleToUpdate.originalPrice && saleToUpdate.salePrice) {
        const originalPrice = parseFloat(saleToUpdate.originalPrice);
        const salePrice = parseFloat(saleToUpdate.salePrice);
        if (originalPrice > 0 && salePrice >= 0) {
          const discount = ((originalPrice - salePrice) / originalPrice) * 100;
          setInputData((prev) => ({ ...prev, discountPercentage: discount.toFixed(2)}));
        }
      }
    }, [dispatch, saleToUpdate]); // Run effect when saleToUpdate changes

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    const originalPrice = parseFloat(e.target.value) || 0;
    setInputData({ ...inputData, originalPrice: originalPrice.toFixed(2) });
    calculateDiscountPercentage(originalPrice, parseFloat(inputData.salePrice) || 0);
  }

  const handleSalePriceChange = (e) => {
      const salePrice = parseFloat(e.target.value) || 0;
      setInputData({ ...inputData, salePrice: salePrice.toFixed(2) });
      calculateDiscountPercentage(parseFloat(inputData.originalPrice) || 0, salePrice);
  }

  const calculateDiscountPercentage = (originalPrice, salePrice) => {
      if(originalPrice > 0 && salePrice >= 0){
          const discount = ((originalPrice - salePrice) / originalPrice) * 100;
          setInputData({...inputData, discountPercentage: discount.toFixed(2)});
      } else {
          setInputData({...inputData, discountPercentage: 0});
      }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !inputData.category ||
        !inputData.originalPrice ||
        !inputData.salePrice ||
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
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("title", inputData.title);
      formData.append("description", inputData.description);
      formData.append("occasion", inputData.occasion);
      formData.append("type", inputData.type);
      formData.append("couponCode", inputData.couponCode);
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
      formData.append("bonus[bonusDescription]", inputData.bonus.bonusDescription);
      inputData.termsAndConditions.forEach((term, index) => {
        formData.append(`termsAndConditions[${index}]`, term);
      });

      dispatch(updateSale({ id: saleToUpdate._id, saleData: formData }));
      makeToast("Sale updated successfully!");
      setUpdateTable((prev) => !prev);
      setUpdateModalIsOpen(false);
    } catch (error) {
      console.error("Error updating sale:", error);
      makeToast("Error updating sale. Please try again.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 ${
        updateModalIsOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-4 top-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setUpdateModalIsOpen(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Update Sale
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                parentlessCategories && parentlessCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>))
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
                  onChange={(e) =>
                    setInputData({ ...inputData, product: e.target.value || null })
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
              onChange={handleOriginalPriceChange}
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
              onChange={handleSalePriceChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="discountPercentage"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Percentage by %
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
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {inputData.image && !imageFile && (
                <div className="mt-2">
                  <img
                    src={inputData.image.startsWith("/") ? inputData.image : `/images/sales/${inputData.image}`}
                    alt="Current Sale"
                    className="max-w-xs max-h-40 object-cover rounded-md"
                  />
                </div>
              )}
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
              <label htmlFor="saleStartDate" className="block text-sm font-medium text-gray-700">
                Sale Start Date
              </label>
              <input
                type="date"
                id="saleStartDate"
                name="saleStartDate"
                value={inputData.saleStartDate}
                onChange={(e) => setInputData({ ...inputData, saleStartDate: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="saleEndDate" className="block text-sm font-medium text-gray-700">
                Sale End Date
              </label>
              <input
                type="date"
              id="saleEndDate"
              name="saleEndDate"
              value={inputData.saleEndDate}
              onChange={(e) => setInputData({ ...inputData, saleEndDate: e.target.value })}
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
            <label
              htmlFor="isActive"
              className="block text-sm font-medium text-gray-700"
            >
              Is Active
            </label>
            <select
              id="isActive"
              name="isActive"
              value={inputData.isActive}
              onChange={(e) =>
                setInputData({ ...inputData, isActive: e.target.value === "true" })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="isFeatured"
              className="block text-sm font-medium text-gray-700"
            >
              Is Featured
            </label>
            <select
              id="isFeatured"
              name="isFeatured"
              value={inputData.isFeatured}
              onChange={(e) =>
                setInputData({ ...inputData, isFeatured: e.target.value === "true" })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
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
              <option value="Coupon">Coupon</option>
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
          <div>
            <label
              htmlFor="bonusTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Bonus Title
            </label>
            <input
            type="text"
            id="bonusTitle"
            name="bonusTitle"
            value={inputData.bonus.bonusTitle}
            onChange={(e) =>
              setInputData({
                ...inputData,
                bonus: { ...inputData.bonus, bonusTitle: e.target.value },
              })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="bonusDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Bonus Description
          </label>
          <textarea
            id="bonusDescription"
            name="bonusDescription"
            value={inputData.bonus.bonusDescription}
            onChange={(e) =>
              setInputData({
                ...inputData,
                bonus: { ...inputData.bonus, bonusDescription: e.target.value },
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
            <div key={index} className="mt-1">
              <input
                type="text"
                value={term}
                onChange={(e) => handleTermsChange(index, e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTerm(index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTerm}
            className="mt-2 text-blue hover:text-blue-800"
          >
            Add Term
          </button>
        </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleUpdateModal;