'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { makeToast } from '../../../../../utils/helpers';
import { deleteSale, getSales } from '@/redux/features/saleSlice';
import SaleInsertModal from '@/components/adminPanel/SaleInsertModal';
import SaleUpdateModel from '@/components/adminPanel/SaleUpdateModel';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SaleList() {
  const dispatch = useDispatch();
  const salesData = useSelector((state) => state.sales);
  const sales = salesData.sales;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [saleToUpdate, setSaleToUpdate] = useState(null);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSales() {
      try {
         dispatch(getSales());
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        makeToast('Failed to load sales', 'error');
      }
    }
    fetchSales();
  }, [dispatch, updateTable]);

  const openModal = () => setOpenPopup(true);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`/api/sales/${id}`);
        dispatch(deleteSale(id));
        setUpdateTable((prev) => !prev);
        makeToast('Sale deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting sale:', err);
        makeToast('Failed to delete sale', 'error');
      }
    }
  };

  const handleUpdate = (sale) => {
    setSaleToUpdate(sale);
    setUpdateModalIsOpen(true);
  };

  const filteredSales = sales?.filter(sale => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sale.title?.toLowerCase().includes(searchLower) ||
      sale.product?.name?.toLowerCase().includes(searchLower) ||
      sale.category?.name?.toLowerCase().includes(searchLower) ||
      sale.occasion?.toLowerCase().includes(searchLower)
    );
  });

  if (error) return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="text-red-500 text-center py-10">
        <p className="text-xl font-medium">Error loading sales data</p>
        <p className="text-sm mt-2">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
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
          <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
          <p className="text-sm text-gray-500">Manage current and upcoming sales promotions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search sales..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openModal}
            className="bg-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FaPlus /> Add Sale
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
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prices
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occasion
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales?.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{sale.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{sale.product?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{sale.category?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-through">${sale.originalPrice}</span>
                        <span className="font-bold text-green-600">${sale.salePrice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.image ? (
                        <Image
                          src={`/images/sales/${sale.image}`}
                          alt={sale.title}
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
                      <div className="flex flex-col">
                        <span className="text-sm text-green-600">
                          {sale.saleStartDate ? new Date(sale.saleStartDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="text-sm text-red-600">
                          {sale.saleEndDate ? new Date(sale.saleEndDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {sale.occasion || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleUpdate(sale)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id)}
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
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? 'No matching sales found' : 'No sales available'}
                    </div>
                    {!searchTerm && (
                      <button
                        onClick={openModal}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <FaPlus /> Create Your First Sale
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <SaleInsertModal
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setUpdateTable={setUpdateTable}
      />
      
      {updateModalIsOpen && (
        <SaleUpdateModel
          saleToUpdate={saleToUpdate}
          updateModalIsOpen={updateModalIsOpen}
          setUpdateModalIsOpen={setUpdateModalIsOpen}
          setUpdateTable={setUpdateTable}
          updateTable={updateTable}
        />
      )}
    </div>
  );
}

export default SaleList;