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
    category: "", // Category ID
    brand: "",
    manufactureYear: "",
    tags: "",
    userID: "", // User ID
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageColor, setImageColor] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const categoriesResponse = await axios.get("/api/category/getCategories");
        const brandsResponse = await axios.get("/api/brand/getBrands");
        const filteredCategories = categoriesResponse.data.filter(
          (category) => category.parent !== null
        );
        setCategories(filteredCategories);
        setBrands(brandsResponse.data);
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
        makeToast("Error fetching categories and brands.");
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
    } else {
      setFilteredBrands([]);
    }
  }, [inputData.category, categories, brands]);

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", inputData.name);
      formData.append("description", inputData.description);
      formData.append("price", inputData.price);
      formData.append("discountPrice", inputData.discountPrice);
      formData.append("stock", inputData.stock);
      formData.append("category", inputData.category);
      formData.append("brand", inputData.brand);
      formData.append("manufactureYear", inputData.manufactureYear);
      formData.append("tags", inputData.tags);
      formData.append("userID", inputData.userID);

      if (imageFile) {
        formData.append("images", imageFile);
        formData.append("imageColors", imageColor);
      }

      const response = await axios.post("/api/products/add_product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setProduct(response.data));
      makeToast("Product added successfully!");
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error("Error adding product:", error);
      makeToast("Error adding product. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-4 top-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Product</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              placeholder="Product Name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={inputData.name}
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              placeholder="Description"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={inputData.description}
              onChange={(e) => setInputData({ ...inputData, description: e.target.value })}
            />
          </div>

          {/* Price & Discount Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                placeholder="Price"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={inputData.price}
                onChange={(e) => setInputData({ ...inputData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
              <input
                type="number"
                id="discountPrice"
                placeholder="Discount Price"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={inputData.discountPrice}
                onChange={(e) => setInputData({ ...inputData, discountPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Stock, Category, Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                id="stock"
                placeholder="Stock"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={inputData.stock}
                onChange={(e) => setInputData({ ...inputData, stock: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={inputData.category}
                onChange={(e) => setInputData({ ...inputData, category: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <select
                id="brand"
                value={inputData.brand}
                onChange={(e) => setInputData({ ...inputData, brand: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={filteredBrands?.length === 0}
              >
                <option value="">Select Brand</option>
                {filteredBrands?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Manufacture Year */}
          <div>
            <label htmlFor="manufactureYear" className="block text-sm font-medium text-gray-700">Manufacture Year</label>
            <input
              type="number"
              id="manufactureYear"
              placeholder="Manufacture Year"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={inputData.manufactureYear}
              onChange={(e) => setInputData({ ...inputData, manufactureYear: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              placeholder="Tags (comma separated)"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={inputData.tags}
              onChange={(e) => setInputData({ ...inputData, tags: e.target.value })}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Image Color"
              value={imageColor}
              onChange={(e) => setImageColor(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupProductInsert;