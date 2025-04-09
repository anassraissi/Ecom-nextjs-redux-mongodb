'use client';
import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setLoading } from "@/redux/features/loadingSlice";
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';
import axios from 'axios';
import { removeProduct } from '@/redux/features/productSlice';
import { makeToast } from '../../../utils/helpers';

const ProductRow = ({ product, srNo, setOpenPopup, setUpdateTable, setPopupType, setProductToUpdate }) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    setProductToUpdate(product);
    setPopupType('update');
    setOpenPopup(true);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmDelete) return;
  
    dispatch(setLoading(true));
  
    try {
      const res = await axios.delete(`/api/products/removeProduct/${product._id}`);
  
      if (res.status === 200 && res.data.success) {
        makeToast(`"${product.name}" has been deleted successfully!`);
        dispatch(removeProduct(product._id));
        setUpdateTable((prev) => !prev);
      } else {
        makeToast('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      makeToast(error.response?.data?.message || 'Failed to delete product. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {srNo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{product.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.category?.name || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.brand?.name || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {product.images?.length > 0 ? (
            product.images.slice(0, 3).map((image, index) => (
              <div key={index} className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={`/images/products/${image.url}`}
                  alt={image.altText || product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-400">No images</span>
          )}
          {product.images?.length > 3 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              +{product.images.length - 3} more
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Edit product"
          >
            <CiEdit className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Delete product"
          >
            <RiDeleteBin5Line className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;