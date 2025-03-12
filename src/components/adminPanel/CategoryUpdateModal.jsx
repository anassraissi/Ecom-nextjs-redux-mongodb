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
  const [inputData, setInputData] = useState({
    name: '',
    description: '',
    parent: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageAltText, setImageAltText] = useState('');

  useEffect(() => {
    if (categoryToUpdate) {
      setInputData({
        name: categoryToUpdate.name,
        description: categoryToUpdate.description,
        parent: categoryToUpdate.parent || null,
      });
      setImageAltText(categoryToUpdate.image ? `Category Image for ${categoryToUpdate.name}` : '');
    }
  }, [categoryToUpdate]);

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', inputData.name);
      formData.append('description', inputData.description);
      formData.append('parent', inputData.parent || '');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(`/api/category/updateCategory/${categoryToUpdate._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(updateCategory(response.data.category));
      makeToast('Category updated successfully!');
      setUpdateTable((prev) => !prev);
      setOpenPopup(false);
    } catch (error) {
      console.error('Error updating category:', error);
      makeToast('Error updating category. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 ${openPopup ? 'block' : 'hidden'}`}>
      <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
        <IoIosCloseCircleOutline
          className="absolute text-2xl right-4 top-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setOpenPopup(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Category</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              id="name"
              placeholder="Category Name"
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
            <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Parent Category</label>
            <select
              id="parent"
              value={inputData.parent || ''}
              onChange={(e) => setInputData({ ...inputData, parent: e.target.value || null })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">None</option>
              {filteredCategories.map((parent) => (
                <option key={parent._id} value={parent._id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Category Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue text-white py-2 px-4 rounded-md hover:bg-blue transition-colors"
          >
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryUpdateModal;