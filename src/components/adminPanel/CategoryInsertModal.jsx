'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCategory } from '@/redux/features/categorySlice';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { makeToast } from '../../../utils/helpers';

const CategoryInsertModal = ({ openPopup, setOpenPopup, setUpdateTable, categories }) => {
  const filteredCategories = categories.filter((category) => category.parent === null);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [inputData, setInputData] = useState({
    name: '',
    description: '',
    parent: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageAltText, setImageAltText] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', inputData.name);
      formData.append('description', inputData.description);
      formData.append('parent', inputData.parent || '');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('/api/category/addCategory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(setCategory(response.data));
      makeToast('Category added successfully!');
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
      
      // Reset form
      setInputData({
        name: '',
        description: '',
        parent: null,
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding category:', error);
      makeToast(error.response?.data?.message || 'Error adding category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity ${
      openPopup ? 'opacity-100' : 'pointer-events-none opacity-0'
    }`}>
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl transition-all duration-300">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Category</h2>
          <button
            onClick={() => setOpenPopup(false)}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
          >
            <IoIosCloseCircleOutline className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Electronics, Clothing"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                value={inputData.name}
                onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Brief description of the category"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={inputData.description}
                onChange={(e) => setInputData({ ...inputData, description: e.target.value })}
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Parent Category
              </label>
              <select
                value={inputData.parent || ''}
                onChange={(e) => setInputData({ ...inputData, parent: e.target.value || null })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">None (Top-level category)</option>
                {filteredCategories?.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {imageFile ? imageFile.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">JPEG, PNG (Max 5MB)</p>
                </div>
                {imagePreview && (
                  <div className="flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-24 w-24 rounded-lg object-cover shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryInsertModal;