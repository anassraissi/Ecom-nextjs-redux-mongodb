"use client";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import { makeToast } from "../../../utils/helpers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import {
  addImage,
  removeImage,
  updateProduct
} from "@/redux/features/productSlice";

const PopupProductUpdate = ({
  setOpenPopup,
  setUpdateTable,
  productToUpdate,
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef(null);

  const [inputData, setInputData] = useState({
    name: productToUpdate?.name || "",
    description: productToUpdate?.description || "",
    price: productToUpdate?.price || "",
    discountPrice: productToUpdate?.discountPrice || "",
    stock: productToUpdate?.stock || "",
    category: productToUpdate?.category?._id || "",
    brand: productToUpdate?.brand?._id || '', // Correct initialization
    manufactureYear: productToUpdate?.manufactureYear || "",
    tags: productToUpdate?.tags?.join(", ") || "",
    userID: productToUpdate?.userID?._id || "",
    images: productToUpdate?.images || [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); 
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [imageColor, setImageColor] = useState("");
  const [showAddImage, setShowAddImage] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const categoriesResponse = await axios.get(
          "/api/category/getCategories"
        );
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
    const selectedCategory = categories?.find(
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
    const files = Array.from(event.target.files);
    setImageFiles(files);
  };

  const handleAddImage = async () => {
    if (imageFiles.length > 0 && imageColor) {
      try {
        const uploadedImages = [];
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("productId", productToUpdate._id);
          formData.append("color", imageColor);

          const response = await axios.post(
            "/api/products/edit_product/uploadImage",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          const newImage = response.data.image;
          uploadedImages.push(newImage);
          dispatch(addImage({ ...newImage, productId: productToUpdate._id }));
        }
        setInputData({
          ...inputData,
          images: [...inputData.images, ...uploadedImages],
        });
        setImageFiles([]);
        setImageColor("");
        makeToast("Images uploaded successfully!");
      } catch (error) {
        console.error("Error uploading images:", error);
        makeToast("Error uploading images. Please try again.");
      }
    } else {
      makeToast("Please select images and enter a color.");
    }
  };

  const handleDeleteImage = async (indexToDelete, imageUrl) => {
    try {
      await axios.delete(
        `/api/products/removeImageProduct/${productToUpdate._id}`,
        {
          data: { imageUrl },
        }
      );
      dispatch(removeImage({ productId: productToUpdate._id, imageUrl }));
      setInputData({
        ...inputData,
        images: inputData.images.filter((_, index) => index !== indexToDelete),
      });
      makeToast("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      makeToast("Error deleting image. Please try again.");
    }
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

      inputData.images.forEach((image) => {
        formData.append("images", image.url);
        formData.append("imageColors", image.color);
      });

      const response = await axios.put(
        `/api/products/edit_product/${productToUpdate._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(updateProduct(response.data));
      makeToast("Product updated successfully!");
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error("Error updating product:", error);
      makeToast("Error updating product. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-8">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-4 top-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Update Product
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputData.name}
              onChange={(e) =>
                setInputData({ ...inputData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputData.description}
              onChange={(e) =>
                setInputData({ ...inputData, description: e.target.value })
              }
            />
          </div>

          {/* Price & Discount Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                placeholder="Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.price}
                onChange={(e) =>
                  setInputData({ ...inputData, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price
              </label>
              <input
                type="number"
                placeholder="Discount Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.discountPrice}
                onChange={(e) =>
                  setInputData({ ...inputData, discountPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Stock, Category, Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                placeholder="Stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.stock}
                onChange={(e) =>
                  setInputData({ ...inputData, stock: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.category}
                onChange={(e) =>
                  setInputData({ ...inputData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.brand}
                onChange={(e) =>
                  setInputData({ ...inputData, brand: e.target.value })
                }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacture Year
            </label>
            <input
              type="number"
              placeholder="Manufacture Year"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputData.manufactureYear}
              onChange={(e) =>
                setInputData({ ...inputData, manufactureYear: e.target.value })
              }
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputData.tags}
              onChange={(e) =>
                setInputData({ ...inputData, tags: e.target.value })
              }
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <p className="text-gray-500 text-sm mb-2 hover:underline"  style={{ cursor: 'pointer' }} onClick={() => setShowAddImage(!showAddImage)}>Add new images</p>
            {showAddImage && (
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  multiple
                  ref={fileInputRef}
                />
                <input
                  type="text"
                  placeholder="Enter Image Color"
                  value={imageColor}
                  onChange={(e) => setImageColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="w-full bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Image
                </button>
              </div>
            )}
          </div>

          {/* Existing Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Images
            </label>
            <div className="flex flex-wrap gap-4">
              {inputData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={
                      image.url.startsWith("/")
                        ? image.url
                        : `/images/products/${image.url}`
                    }
                    alt={image.altText}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index, image.url)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                  <span className="block text-xs text-gray-600 mt-1">
                    {image.color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupProductUpdate;
