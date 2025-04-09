// src/components/CategoryUpdateModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updateCategory } from '@/redux/features/categorySlice';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { makeToast } from '../../../utils/helpers';

const CategoryUpdateModal = ({ openPopup, setOpenPopup, setUpdateTable, categoryToUpdate, categories }) => {
  const filteredCategories = categories.filter(category => category.parent === null);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inputData, setInputData] = useState({
    name: '',
    description: '',
    parent: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageAltText, setImageAltText] = useState('');

  useEffect(() => {
    if (categoryToUpdate) {
      setInputData({
        name: categoryToUpdate.name,
        description: categoryToUpdate.description,
        parent: categoryToUpdate.parent || null,
      });
      setImageAltText(categoryToUpdate.image ? `Category Image for ${categoryToUpdate.name}` : '');
      if (categoryToUpdate.image) {
        setImagePreview(categoryToUpdate.image);
      }
    }
  }, [categoryToUpdate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        makeToast('Image size should be less than 2MB', 'warning');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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

      const response = await axios.put(
        `/api/category/updateCategory/${categoryToUpdate._id}`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      dispatch(updateCategory(response.data.category));
      makeToast('Category updated successfully!', 'success');
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error('Error updating category:', error);
      makeToast(error.response?.data?.message || 'Error updating category. Please try again.', 'error');
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

  if (!openPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">
        <button
          onClick={() => setOpenPopup(false)}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <IoIosCloseCircleOutline className="text-3xl" />
        </button>

        <div className="p-8">
          <header className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Update Category</h2>
            <p className="text-sm text-gray-500 mt-1">Edit the details for {categoryToUpdate?.name}</p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Category Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={inputData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Parent Category */}
              <div>
                <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  id="parent"
                  name="parent"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjQ3NDc1NyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                  value={inputData.parent || ''}
                  onChange={handleInputChange}
                >
                  <option value="">No parent category</option>
                  {filteredCategories.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
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
                    {(imagePreview || categoryToUpdate?.image) && (
                      <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                        <img 
                          // src={imagePreview || categoryToUpdate.image.url} 
                          src={`/images/categories/${categoryToUpdate.image}`}

                          alt={imageAltText}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="imageAltText" className="block text-sm font-medium text-gray-700 mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    id="imageAltText"
                    placeholder="Description for accessibility"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={imageAltText}
                    onChange={(e) => setImageAltText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
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
                {isSubmitting ? 'Updating...' : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdateModal;