'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setLoading } from "@/redux/features/loadingSlice";
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';
import axios from 'axios';
import { removeProduct, setProduct, updateProduct } from '@/redux/features/productSlice';
import { makeToast } from '../../../utils/helpers';

const ProductRow = ({ product, srNo, setOpenPopup,setUpdateTable,setPopupType,PopupType,setProductToUpdate}) => {
  const dispatch = useDispatch();
  const handleEdit = () => {
    setProductToUpdate(product)
    // Handle opening the edit popup/mod  al
    setPopupType('update')
    setOpenPopup(true);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmDelete) return;
  
    dispatch(setLoading(true)); // Set loading state
  
    try {
      const res = await axios.delete(`/api/products/removeProduct/${product._id}`);
  
      if (res.status === 200 && res.data.success) {
        makeToast(`"${product.name}" has been deleted successfully!`)
  
        dispatch(removeProduct());
  
        setUpdateTable((prev) => !prev); // Trigger table update
      } else {
        makeToast(`Failed to delete product. Please try again.`)

      }
    } catch (error) {
      console.error("Error deleting product:", error);

      makeToast("Failed to delete product. Please try again.")

    } finally {
      dispatch(setLoading(false)); // Set loading state to false
    }
  };
  return (
    <tr key={product._id} className="text-center border-b border-gray-200">
      <td className="px-4 py-2">{srNo}</td>
      <td className="px-4 py-2">{product.name}</td>
      <td className="px-4 py-2">${product.price.toFixed(2)}</td>
      <td className="px-4 py-2">{product.category?.name || 'N/A'}</td>
      <td className="px-4 py-2">{product.brand?.name || 'N/A'}</td>
      <td className="px-4 py-2">
      <div className="flex items-center gap-2">
        {product.images && product.images.length > 0 ? (
          product.images.map((image, index) => (
            <div
              key={index}
              className="relative w-16 h-16 overflow-hidden border border-gray-300"
            >
              <Image
                src={`/images/products/${image.url}`}
                alt={image.altText || product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))
        ) : (
          <span>No Images</span>
        )}
      </div>
    </td>
    
      <td className="px-4 py-2">
        <div className="flex justify-center items-center gap-4 text-xl">
          <CiEdit
            className="cursor-pointer text-gray-600 hover:text-black"
            onClick={handleEdit}

          />
          <RiDeleteBin5Line
            className="cursor-pointer text-red-600 hover:text-red-800"
            onClick={()=>handleDelete()}
          />
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
