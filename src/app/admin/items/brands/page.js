'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
import BrandInsertModal from '@/components/adminPanel/BrandInsertModal';
import BrandUpdateModal from '@/components/adminPanel/BrandUpdateModal';
import { makeToast } from '../../../../../utils/helpers';
import { fetchBrands, removeBrand } from '@/redux/features/brandSlice';
import Image from 'next/image';

function BrandList() {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.brands);

  const [openPopup, setOpenPopup] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [brandToUpdate, setBrandToUpdate] = useState(null);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch, updateTable]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      setIsDeleting(id);
      try {
        await dispatch(removeBrand(id));
        setUpdateTable((prev) => !prev);
        makeToast('Brand deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting brand:', err);
        makeToast('Failed to delete brand', 'error');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUpdate = (brand) => {
    setBrandToUpdate(brand);
    setUpdateModalIsOpen(true);
  };

  const filteredBrands = brands?.filter(brand => {
    const searchLower = searchTerm.toLowerCase();
    return (
      brand.name?.toLowerCase().includes(searchLower) ||
      brand.description?.toLowerCase().includes(searchLower) ||
      brand.categories?.some(category => 
        category.name.toLowerCase().includes(searchLower)
    )
    );
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Brand Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your product brands and categories</p>
          </div>
          <button
            onClick={() => setOpenPopup(true)}
            className="flex items-center gap-2 bg-blue hover:bg-blue text-white px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaPlus className="text-sm" />
            <span>Add Brand</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search brands by name, description or category..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-red-700">Error loading brands: {error}</p>
              <button 
                onClick={() => dispatch(fetchBrands())}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrands?.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{brand.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {brand.logoUrl ? (
                        <div className="h-10 w-10">
                          <Image
                            src={`/images/brands/${brand.logoUrl}`}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="rounded object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                          No Logo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {brand.categories?.length > 0 ? (
                          brand.categories.map((category) => (
                            <span
                              key={category._id}
                              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                            >
                              {category.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No categories</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleUpdate(brand)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          disabled={isDeleting === brand._id}
                          title="Delete"
                        >
                          {isDeleting === brand._id ? (
                            <FiLoader className="animate-spin h-4 w-4" />
                          ) : (
                            <FaTrash className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? 'No matching brands found' : 'No brands available'}
                    </div>
                    {!searchTerm && (
                      <button
                        onClick={() => setOpenPopup(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <FaPlus /> Add Your First Brand
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <BrandInsertModal
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setUpdateTable={setUpdateTable}
      />
      <BrandUpdateModal
        openPopup={updateModalIsOpen}
        setOpenPopup={setUpdateModalIsOpen}
        setUpdateTable={setUpdateTable}
        brandToUpdate={brandToUpdate}
      />
    </div>
  );
}

export default BrandList;