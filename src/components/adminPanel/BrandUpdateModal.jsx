// src/components/adminPanel/BrandUpdateModal.js
"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiUpload, FiImage } from "react-icons/fi";
import { makeToast } from "../../../utils/helpers";
import { updateBrand } from "@/redux/features/brandSlice";

const BrandUpdateModal = ({
  openPopup,
  setOpenPopup,
  setUpdateTable,
  brandToUpdate,
}) => {
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    name: "",
    description: "",
    categories: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/getCategories");
        const filteredCategories = response.data.filter(
          (category) => category.parent !== null
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        makeToast("Error fetching categories. Please try again.", "error");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (brandToUpdate) {
      setInputData({
        name: brandToUpdate.name || "",
        description: brandToUpdate.description || "",
        categories: brandToUpdate.categories?.[0]?._id || "",
      });
      setLogoPreview(brandToUpdate.logoUrl || null);
    }
  }, [brandToUpdate]);

  const handleLogoUpload = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      makeToast("No file selected", "error");
      return;
    }

    const file = event.target.files[0];

    // Add file validation
    if (!file.type.match("image.*")) {
      makeToast("Please select an image file (JPEG/PNG)", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      makeToast("File size should be less than 2MB", "error");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", inputData.name.trim());
  //     formData.append("description", inputData.description.trim());
  //     formData.append("categories", inputData.categories);

  //     if (logoFile) {
  //       formData.append("logoUrl", logoFile); // Change this to 'logo' to match common conventions
  //     } else if (!logoPreview) {
  //       formData.append("removeLogo", "true");
  //     }

  //     const response = await axios.put(
  //       `/api/brand/updateBrand/${brandToUpdate._id}`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     dispatch(updateBrand(response.data.brand));
  //     makeToast("Brand updated successfully!", "success");
  //     setUpdateTable((prev) => !prev);
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error updating brand:", error);
  //     makeToast(
  //       error.response?.data?.message ||
  //         "Error updating brand. Please try again.",
  //       "error"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug log
    console.log("Logo file before submit:", logoFile);
    console.log("Logo preview:", logoPreview);

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all fields
      formData.append("name", inputData.name.trim());
      formData.append("description", inputData.description.trim());
      formData.append("categories", inputData.categories);

      // Debug form data before sending
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Handle file upload
      if (logoFile) {
        formData.append("logo", logoFile); // Changed from logoUrl to logo
        console.log("Appended logo file to formData");
      } else if (!logoPreview) {
        formData.append("removeLogo", "true");
      }

      const response = await axios.put(
        `/api/brand/updateBrand/${brandToUpdate._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(updateBrand(response.data.brand));
      makeToast("Brand updated successfully!", "success");
      setUpdateTable((prev) => !prev);
      handleClose();
    } catch (error) {
      console.error("Error updating brand:", error);
      // More detailed error logging
      console.error("Error response:", error.response);
      makeToast(
        error.response?.data?.message ||
          "Error updating brand. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpenPopup(false);
    setLogoFile(null);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex justify-center items-center z-50 transition-opacity duration-300 ${
        openPopup
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative p-6 transform transition-all duration-300 scale-[0.98] hover:scale-100">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Update Brand</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Close modal"
          >
            <IoIosCloseCircleOutline className="text-3xl" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="e.g. Nike, Apple, Samsung"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.name}
                onChange={(e) =>
                  setInputData({ ...inputData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categories"
                value={inputData.categories}
                onChange={(e) =>
                  setInputData({ ...inputData, categories: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Brief description about the brand..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputData.description}
              onChange={(e) =>
                setInputData({ ...inputData, description: e.target.value })
              }
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Logo
              {logoFile ? (
                <span className="text-green-500 ml-2">✓ {logoFile.name}</span>
              ) : logoPreview ? (
                <span className="text-gray-500 ml-2">
                  (Current logo will be kept)
                </span>
              ) : null}
            </label>

            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FiUpload className="text-2xl text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {logoFile ? "Change logo" : "Upload new logo"}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG/JPG, max 2MB
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleLogoUpload}
                  className="hidden"
                  key={logoFile ? `file-${Date.now()}` : "no-file"}
                />
              </label>

              {logoPreview && (
                <div className="w-20 h-20 flex-shrink-0">
                  <div className="relative w-full h-full rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={logoPreview}
                      alt="Brand logo preview"
                      className="w-full h-full object-contain"
                    />
                    {logoFile && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandUpdateModal;
