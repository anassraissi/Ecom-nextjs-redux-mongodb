"use client";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { makeToast } from "../../../utils/helpers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { setProduct } from "@/redux/features/productSlice";

const PopupProductInsert = ({ setOpenPopup, setUpdateTable }) => {
  const dispatch = useAppDispatch();

  const [inputData, setInputData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    brand: "",
    manufactureYear: "",
    tags: "",
    userID: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageColor, setImageColor] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          axios.get("/api/category/getCategories"),
          axios.get("/api/brand/getBrands")
        ]);
        
        const filteredCategories = categoriesResponse.data.filter(
          (category) => category.parent !== null
        );
        setCategories(filteredCategories);
        setBrands(brandsResponse.data);
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
        makeToast("Error fetching categories and brands.", "error");
      }
    };
    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category._id === inputData.category
    );
    if (selectedCategory) {
      const relatedBrands = brands.filter((brand) => {
        return brand.categories.some(
          (category) => category._id === selectedCategory._id
        );
      });
      setFilteredBrands(relatedBrands);
      // Reset brand when category changes
      setInputData(prev => ({ ...prev, brand: "" }));
    } else {
      setFilteredBrands([]);
    }
  }, [inputData.category, categories, brands]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      makeToast("Image size should be less than 2MB", "warning");
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.entries(inputData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (imageFile) {
        formData.append("images", imageFile);
        if (imageColor) formData.append("imageColors", imageColor);
      }

      const response = await axios.post("/api/products/add_product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setProduct(response.data));
      makeToast("Product added successfully!", "success");
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error("Error adding product:", error);
      makeToast(error.response?.data?.message || "Error adding product. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative p-8">
        <button
          onClick={() => setOpenPopup(false)}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <IoIosCloseCircleOutline className="text-3xl" />
        </button>

        <div className="space-y-6">
          <header className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Add New Product</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new product</p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={inputData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={inputData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Price & Stock Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={inputData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={inputData.discountPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Enter quantity"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={inputData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Category & Brand Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjQ3NDc1NyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                  value={inputData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  id="brand"
                  name="brand"
                  className={`w-full px-4 py-2.5 border ${filteredBrands.length === 0 ? 'bg-gray-100' : 'bg-white'} border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjQ3NDc1NyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"`}
                  value={inputData.brand}
                  onChange={handleInputChange}
                  disabled={filteredBrands.length === 0}
                >
                  <option value="">{filteredBrands.length === 0 ? 'Select category first' : 'Select a brand'}</option>
                  {filteredBrands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manufacture Year & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="manufactureYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacture Year
                </label>
                <input
                  type="number"
                  id="manufactureYear"
                  name="manufactureYear"
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={inputData.manufactureYear}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={inputData.tags}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-10 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center">
                      <p className="text-sm text-gray-500">
                        {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="imageColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Color (Hex)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    id="imageColor"
                    placeholder="#FFFFFF"
                    className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={imageColor}
                    onChange={(e) => setImageColor(e.target.value)}
                  />
                  {imageColor && (
                    <div 
                      className="w-10 h-10 rounded-md border border-gray-300"
                      style={{ backgroundColor: imageColor }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setOpenPopup(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue rounded-lg text-white hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupProductInsert;