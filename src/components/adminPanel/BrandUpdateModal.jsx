// src/components/adminPanel/BrandUpdateModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { makeToast } from '../../../utils/helpers';
import { updateBrand } from '@/redux/features/brandSlice';

const BrandUpdateModal = ({ openPopup, setOpenPopup, setUpdateTable, brandToUpdate }) => {
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    name: '',
    description: '',
    categories: '', // Comma-separated category IDs
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoAltText, setLogoAltText] = useState('');
  const [categories, setCategories] = useState([]); // State to store categories from the database

  useEffect(() => {
    if (brandToUpdate) {
      setInputData({
        name: brandToUpdate.name,
        description: brandToUpdate.description,
        categories: brandToUpdate.categories.map((category) => category._id).join(', '), // Pre-fill with existing category IDs
      });
      setLogoAltText(brandToUpdate.logoUrl ? `Logo for ${brandToUpdate.name}` : '');
    }
  }, [brandToUpdate]);

  const handleLogoUpload = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', inputData.name);
      formData.append('description', inputData.description);
      formData.append('categories', inputData.categories);

      if (logoFile) {
        formData.append('logoUrl', logoFile);
      }

      const response = await axios.put(`/api/brand/updateBrand/${brandToUpdate._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(updateBrand(response.data.brand));
      makeToast('Brand updated successfully!');
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error('Error updating brand:', error);
      makeToast('Error updating brand. Please try again.');
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('/api/category/getCategories');
        const filteredCategories = response.data.filter((category) => category.parent !== null);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        makeToast('Error fetching categories. Please try again.');
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 ${openPopup ? 'block' : 'hidden'}`}>
      <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-4 top-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Brand</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Brand Name</label>
            <input
              type="text"
              id="name"
              placeholder="Brand Name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={inputData.name}
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              required
            />
          </div>

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

          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
            <select
              id="categories"
              value={inputData.categories}
              onChange={(e) => setInputData({ ...inputData, categories: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Brand Logo</label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue text-white py-2 px-4 rounded-md hover:bg-blue transition-colors"
          >
            Update Brand
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandUpdateModal;