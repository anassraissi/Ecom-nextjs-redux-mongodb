'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { makeToast } from '../../../../../utils/helpers';
import { deleteSale, getSales } from '@/redux/features/saleSlice';
import SaleInsertModal from '@/components/adminPanel/SaleInsertModal';
import SaleUpdateModel from '@/components/adminPanel/SaleUpdateModel';
import Image from 'next/image';

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

  useEffect(() => {
    async function fetchSales() {
      try {
        dispatch(getSales());
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchSales();
  }, [dispatch, updateTable]);

  const openModal = () => setOpenPopup(true);

  if (loading) return <p>Loading sales...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/sales/${id}`);
      dispatch(deleteSale(id));
      setUpdateTable((prev) => !prev);
      makeToast('The sale successfully deleted ');
    } catch (err) {
      console.error('Error deleting sale:', err);
    }
  };

  const handleUpdate = (sale) => {
    setSaleToUpdate(sale);
    setUpdateModalIsOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg h-[calc(100vh-96px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Sales</h2>
        <button
          onClick={openModal}
          className="bg-blue hover:bg-blue text-white px-4 py-2 rounded"
        >
          Add Sale
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-500">
              <th>Title</th>
              <th>Product</th>
              <th>Category</th>
              <th>Original Price</th>
              <th>Sale Price</th>
              <th>Image</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Occasion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales?.map((sale) => (
              <tr key={sale._id} className="border-b border-gray-200">
                <td className="px-4 py-2">{sale.title}</td>
                <td className="px-4 py-2">{sale.product?.name}</td>
                <td className="px-4 py-2">{sale.category?.name}</td>
                <td className="px-4 py-2">${sale.originalPrice}</td>
                <td className="px-4 py-2">${sale.salePrice}</td>
                <td className="px-4 py-2">
                  {sale.image && (
                    <img
                      src={`/images/sales/${sale.image}`}
                      alt={sale.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-green-500 text-lg">
                  {sale.saleStartDate
                    ? new Date(sale.saleStartDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 text-red-800 text-lg">
                  {sale.saleEndDate
                    ? new Date(sale.saleEndDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-4 py-2">{sale.occasion || 'N/A'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleUpdate(sale)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(sale._id)}
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