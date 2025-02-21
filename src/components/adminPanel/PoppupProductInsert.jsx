"use client";
import { useAppDispatch } from "@/redux/hooks";
import React, { useState } from "react";
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
    tags: "",
  });

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imageColor, setImageColor] = useState("");
  const [images, setImages] = useState([]);

  // Handle file selection
  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

  // Add Image to state
  const handleAddImage = () => {
    if (!imageFile || !imageColor) {
      alert("Please select an image and enter a color.");
      return;
    }
    setImages([...images, { file: imageFile, color: imageColor }]);
    setImageFile(null);
    setImageColor("");
  };

  // Handle form submission
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
      formData.append("tags", inputData.tags);
  
      // Append images correctly
        formData.append(`images`, images[0].file); 
        formData.append(`imageColors`, images[0].color); // Use a different key for colors
  
      const response = await axios.post("/api/add_product", formData, {
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
    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000070] flex justify-center items-center z-50">
      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto py-8 px-6 rounded-lg text-center relative">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-0 top-0 m-4 cursor-pointer hover:text-red-600"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-semibold mt-3">Add New Product</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Product Name */}
          <input
            type="text"
            placeholder="Product Name"
            className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

            value={inputData.name}
            onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

            value={inputData.description}
            onChange={(e) => setInputData({ ...inputData, description: e.target.value })}
          />

          {/* Price & Discount Price */}
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price"
              className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

              value={inputData.price}
              onChange={(e) => setInputData({ ...inputData, price: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Discount Price"
              className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

              value={inputData.discountPrice}
              onChange={(e) => setInputData({ ...inputData, discountPrice: e.target.value })}
            />
          </div>

          {/* Stock, Category, Brand */}
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Stock"
              className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

              value={inputData.stock}
              onChange={(e) => setInputData({ ...inputData, stock: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

              value={inputData.category}
              onChange={(e) => setInputData({ ...inputData, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Brand"
              className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

              value={inputData.brand}
              onChange={(e) => setInputData({ ...inputData, brand: e.target.value })}
            />
          </div>

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

            value={inputData.tags}
            onChange={(e) => setInputData({ ...inputData, tags: e.target.value })}
          />

          {/* Image Upload */}
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
            <input
              type="text"
              placeholder="Image Color"
              value={imageColor}
              onChange={(e) => setImageColor(e.target.value)}
              className="border-2 border-gray-400 px-4 py-2 w-full rounded focus:border-blue-500"

            />
            <button type="button" onClick={handleAddImage} className="mt-2 bg-black text-white py-2 px-4 rounded">
              Add Image
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="mt-4 bg-blue text-black py-2 px-6 rounded">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupProductInsert;
