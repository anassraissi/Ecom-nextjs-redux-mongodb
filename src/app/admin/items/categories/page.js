// src/components/CategoryList.js
'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCategory } from '@/redux/features/categorySlice';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import CategoryInsertModal from '@/components/adminPanel/CategoryInsertModal';
import { makeToast } from '../../../../../utils/helpers';
import CategoryUpdateModal from '@/components/adminPanel/CategoryUpdateModal';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('/api/category/getCategories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        makeToast('Failed to load categories', 'error');
      }
    }
    fetchCategories();
  }, [updateTable]);

  const openModal = () => setOpenPopup(true);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/category/deleteCategory/${id}`);
      setUpdateTable((prev) => !prev);
      makeToast('Category deleted successfully', 'success');
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      makeToast('Failed to delete category', 'error');
    }
  };

  const handleUpdate = (category) => {
    setCategoryToUpdate(category);
    setUpdateModalIsOpen(true);
  };

  const filteredCategories = categories?.filter(category => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.name?.toLowerCase().includes(searchLower) ||
      category.description?.toLowerCase().includes(searchLower) ||
      (category.parent && categories.find(c => c._id === category.parent)?.name?.toLowerCase().includes(searchLower))
    );
  });

  if (error) return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="text-red-500 text-center py-10">
        <p className="text-xl font-medium">Error loading categories</p>
        <p className="text-sm mt-2">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
          <p className="text-sm text-gray-500">Organize your products with categories</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openModal}
            className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-4">
            <Skeleton height={50} count={5} className="mb-2" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories?.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 line-clamp-2">{category.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image ? (
                        <Image
                          src={`/images/categories/${category.image}`}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">
                        {category.parent ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {categories.find(c => c._id === category.parent)?.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleUpdate(category)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(category._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? 'No matching categories found' : 'No categories available'}
                    </div>
                    {!searchTerm && (
                      <button
                        onClick={openModal}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <FaPlus /> Create Your First Category
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
              <button onClick={() => setConfirmDeleteId(null)} className="text-gray-400 hover:text-gray-600">
                <IoMdClose className="text-xl" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <CategoryInsertModal
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setUpdateTable={setUpdateTable}
        categories={categories}
      />
      
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