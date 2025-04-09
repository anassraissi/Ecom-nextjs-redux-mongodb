// src/components/adminPanel/BrandInsertModal.js
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { FiUpload } from 'react-icons/fi';
import { makeToast } from '../../../utils/helpers';
import { setBrand } from '@/redux/features/brandSlice';

const BrandInsertModal = ({ openPopup, setOpenPopup, setUpdateTable }) => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    name: '',
    description: '',
    categories: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/getCategories');
        const filteredCategories = response.data.filter((category) => category.parent !== null);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        makeToast('Error fetching categories. Please try again.', 'error');
      }
    };
    fetchCategories();
  }, []);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', inputData.name.trim());
      formData.append('description', inputData.description.trim());
      formData.append('categories', inputData.categories);

      if (logoFile) {
        formData.append('logoUrl', logoFile);
      }

      const response = await axios.post('/api/brand/addBrand', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(setBrand(response.data.brand));
      makeToast('Brand added successfully!', 'success');
      setUpdateTable((prev) => !prev);
      resetForm();
      setOpenPopup(false);
    } catch (error) {
      console.error('Error adding brand:', error);
      makeToast(error.response?.data?.message || 'Error adding brand. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setInputData({
      name: '',
      description: '',
      categories: '',
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleClose = () => {
    resetForm();
    setOpenPopup(false);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/70 flex justify-center items-center z-50 transition-opacity duration-300 ${
        openPopup ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative p-6 transform transition-all duration-300 scale-[0.98] hover:scale-100">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Brand</h2>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="e.g. Nike, Apple, Samsung"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={inputData.name}
                onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categories"
                value={inputData.categories}
                onChange={(e) => setInputData({ ...inputData, categories: e.target.value })}
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Brief description about the brand..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={inputData.description}
              onChange={(e) => setInputData({ ...inputData, description: e.target.value })}
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
              Brand Logo {logoFile && <span className="text-green-500 ml-2">✓ Selected</span>}
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="logo"
                className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FiUpload className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {logoFile ? 'Change logo' : 'Click to upload logo'}
                  </span>
                  <span className="text-xs text-gray-500">(Recommended: 300×300 px)</span>
                </div>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              
              {logoPreview && (
                <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-contain"
                  />
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
              {isSubmitting ? 'Adding...' : 'Add Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandInsertModal;