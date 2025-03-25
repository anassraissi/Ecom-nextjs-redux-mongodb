// src/components/CategoryList.js
'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCategory } from '@/redux/features/categorySlice';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import CategoryInsertModal from '@/components/adminPanel/CategoryInsertModal';
import { makeToast } from '../../../../../utils/helpers';
import CategoryUpdateModal from '@/components/adminPanel/CategoryUpdateModal';

function CategoryList() {
  const dispatch = useDispatch();
  const category = useSelector((state) => state.categorySlice);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('/api/category/getCategories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchCategories();
  },[updateTable]);

  const openModal = () => setOpenPopup(true);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/category/deleteCategory/${id}`);
      setUpdateTable((prev) => !prev);
    makeToast('The category successfully deleted ');
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleUpdate = (category) => {
    setCategoryToUpdate(category);
    setUpdateModalIsOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg h-[calc(100vh-96px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Categories</h2>
        <button
          onClick={openModal}
          className="bg-blue hover:bg-blue text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-500">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Description</th>
              <th className="border border-gray-200 px-4 py-2">Image</th>
              <th className="border border-gray-200 px-4 py-2">Parent</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category._id} className="border-b border-gray-200">
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">{category.description}</td>
                <td className="px-4 py-2">
                  {category.image && (
                    <img
                      src={`/images/categories/${category.image}`}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {category.parent && categories.find((c) => c._id === category.parent)?.name}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleUpdate(category)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CategoryInsertModal
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setUpdateTable={setUpdateTable}
        categories={categories}
      />
            {/* Add the CategoryUpdateModal */}
            <CategoryUpdateModal
            openPopup={updateModalIsOpen}
            setOpenPopup={setUpdateModalIsOpen}
            setUpdateTable={setUpdateTable}
            categoryToUpdate={categoryToUpdate}
            categories={categories}
          />
    </div>
  );
}

export default CategoryList;