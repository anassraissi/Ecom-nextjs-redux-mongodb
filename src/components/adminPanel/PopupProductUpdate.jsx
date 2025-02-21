"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import { makeToast } from "../../../utils/helpers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  addImage,
  removeImage,
  setProduct,
  updateProduct,
} from "@/redux/features/productSlice";
import axios from "axios";

const PopupProductUpdate = ({ setOpenPopup, setUpdateTable }) => {
  const productData = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();  

  const [inputData, setInputData] = useState({
    name: productData.name,
    description:  productData.description,
    price:  productData.price,
    discountPrice: productData.discountPrice,
    stock: productData.stock,
    category: productData.category,
    brand: productData.brand,
    tags: productData.tags,
    images:productData.images
  });

  // State for new image upload
  const [imageFile, setImageFile] = useState(null);
  const [imageColor, setImageColor] = useState("");

  // Handle file selection (for image upload)
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  // Add new image (calls the API to upload image)
  const handleAddImage = async () => {
    if (!imageFile || !imageColor) {
      alert("Please select an image and enter a color.");
      return;
    }
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("productId", productData._id);
    formData.append("color", imageColor);

    try {
      const response = await axios.post(
        "/api/edit_product/uploadImage",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const newImage = response.data.image;

      // Update the images array in state
      setInputData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
      dispatch(addImage(newImage));
      makeToast("Image uploaded successfully!");

      // Clear file and color fields
      setImageFile(null);
      setImageColor("");
    } catch (error) {
      console.error("Error uploading image:", error);
      makeToast("Error uploading image. Please try again.");
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (index, imageUrl) => {
    try {
      const response = await axios.delete(
        `/api/edit_product/${productData._id}/deleteImage`,
        { data: { imageUrl } } // Send image URL in request body
      );

      if (response.status === 200) {
        const updatedImages = inputData.images.filter((_, i) => i !== index);
        setInputData({ ...inputData, images: updatedImages });
        dispatch(removeImage(index));
        makeToast("Image deleted successfully!");
      }                                                   
    } catch (error) {
      console.error(
        "Error deleting image:",
        error.response?.data || error.message
      );
      makeToast("Error deleting image. Please try again.");
    }
  };

  // Handle form submission (update product details without modifying images)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!productData?._id; // Check if editing or adding a new product
    
    
    try {
      const url = isEditing 
      ? `/api/edit_product/${productData._id}` 
      : `/api/add_product`;
      
      const method = isEditing ? "put" : "post";  
      
      if (inputData.images.length === 0) {
        // Assuming you have an input field where images are added
        const imageInputs = document.querySelectorAll('input[type="file"]');
        const selectedImages = Array.from(imageInputs).map(input => input.files[0]); 
        
        setInputData(prev => ({
          ...prev,
          images: selectedImages.length > 0 ? selectedImages : prev.images
        }));
      }
      
      isEditing ? dispatch(updateProduct(inputData)) : dispatch(setProduct(inputData));
      await axios[method](url, inputData);
      makeToast(isEditing ? "Product Updated Successfully!" : "Product Added Successfully!");
  
      setUpdateTable((prevState) => !prevState);
      setOpenPopup(false);
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} product:`, error);
    }
  };
  

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000070] flex justify-center items-center z-50">
      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto py-8 px-6 rounded-lg text-center relative">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-0 top-0 m-4 cursor-pointer hover:text-red-600"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-semibold mt-3">Edit Product</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block font-semibold text-left mb-1">
              Product Name:
            </label>
            <input
              className="border border-gray-500 px-4 py-2 rounded-lg w-full"
              type="text"
              placeholder="Enter product name"
              value={inputData.name}
              onChange={(e) =>
                setInputData({ ...inputData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-left mb-1">
              Description:
            </label>
            <textarea
              className="border border-gray-500 px-4 py-2 rounded-lg w-full"
              placeholder="Enter description"
              value={inputData.description}
              onChange={(e) =>
                setInputData({ ...inputData, description: e.target.value })
              }
            />
          </div>

          {/* Price & Discount Price */}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block font-semibold text-left mb-1">
                Price:
              </label>
              <input
                className="border border-gray-500 px-4 py-2 rounded-lg w-full"
                type="number"
                placeholder="Enter price"
                value={inputData.price}
                onChange={(e) =>
                  setInputData({ ...inputData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="w-full">
              <label className="block font-semibold text-left mb-1">
                Discount Price:
              </label>
              <input
                className="border border-gray-500 px-4 py-2 rounded-lg w-full"
                type="number"
                placeholder="Enter discount price"
                value={inputData.discountPrice}
                onChange={(e) =>
                  setInputData({ ...inputData, discountPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block font-semibold text-left mb-1">
              Stock:
            </label>
            <input
              className="border border-gray-500 px-4 py-2 rounded-lg w-full"
              type="number"
              placeholder="Enter stock quantity"
              value={inputData.stock}
              onChange={(e) =>
                setInputData({ ...inputData, stock: e.target.value })
              }
            />
          </div>

          {/* Category & Brand */}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block font-semibold text-left mb-1">
                Category:
              </label>
              <input
                className="border border-gray-500 px-4 py-2 rounded-lg w-full"
                type="text"
                placeholder="Enter category"
                value={inputData.category}
                onChange={(e) =>
                  setInputData({ ...inputData, category: e.target.value })
                }
                required
              />
            </div>
            <div className="w-full">
              <label className="block font-semibold text-left mb-1">
                Brand:
              </label>
              <input
                className="border border-gray-500 px-4 py-2 rounded-lg w-full"
                type="text"
                placeholder="Enter brand"
                value={inputData.brand}
                onChange={(e) =>
                  setInputData({ ...inputData, brand: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-left mb-1">
              Tags (comma separated):
            </label>
            <input
              className="border border-gray-500 px-4 py-2 rounded-lg w-full"
              type="text"
              placeholder="Enter tags"
              value={inputData.tags.join(", ")}
              onChange={(e) =>
                setInputData({ ...inputData, tags: e.target.value.split(",") })
              }
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block font-semibold text-left mb-4">
              Upload New Image:
            </label>
            <div className="flex flex-col">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full mb-2"
              />
              <input
                type="text"
                placeholder="Enter Image Color"
                value={imageColor}
                onChange={(e) => setImageColor(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              />
                <button
                type="button"
                onClick={handleAddImage}
                className="mt-2 bg-black-500 text-black py-2 px-4 rounded"
              >
                Add Image
              </button>
 
            </div>
          </div>

          {/* Existing Images List with Delete Option */}
            <div>
            <label className="block font-semibold text-left mb-1">
              Images:
            </label>
            <div className="flex flex-wrap gap-4">
              {inputData.images.map((image, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={
                      image.url.startsWith("/")
                        ? image.url
                        : `/images/products/${image.url}`
                    }
                    alt={image.altText}
                    className="w-16 h-16 object-cover border rounded mr-2"
                  />
                  <span className="inline-block">
                    {image.color}
                    <button
                      type="button"
                      className="bg-red-600 text-white text-xs px-1 rounded-full hover:bg-red-700"
                      onClick={() => handleDeleteImage(index, image.url)}
                    >
                      ✕
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Submit Button */} 
          <button
            type="submit"
            className="bg-black hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
              Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupProductUpdate;
