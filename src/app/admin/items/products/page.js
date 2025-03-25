'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from "@/redux/features/loadingSlice";
import axios from 'axios';
import ProductRow from '@/components/adminPanel/ProductRow';
import PopupProductUpdate from '@/components/adminPanel/PopupProductUpdate';
import PoppupProductInsert from '@/components/adminPanel/PoppupProductInsert';

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // Store products
  const [openPopup, setOpenPopup] = useState(false); // Handle modal visibility
  const [popupType, setPopupType] = useState('');
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [updateTable, setUpdateTable] = useState(false); // Refresh table state

  const dispatch = useDispatch();

  useEffect(() => {

    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get("/api/products/get_products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProducts();
  }, [updateTable, dispatch]);
  console.log('products',products);

  return (
    <div className="bg-white h-[calc(100vh-96px)] rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Products</h2>
        <button
          className="bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            setPopupType('insert');
            setOpenPopup(true);
          }}
        >
          Add Product
        </button>
      </div>

      <div className="h-[calc(100vh-180px)] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border border-gray-200 px-4 py-3 text-left">SR No.</th>
              <th className="border border-gray-200 px-4 py-3 text-left">Name</th>
              <th className="border border-gray-200 px-4 py-3 text-left">Price</th>
              <th className="border border-gray-200 px-4 py-3 text-left">Category</th>
              <th className="border border-gray-200 px-4 py-3 text-left">Brand</th>
              <th className="border border-gray-200 px-4 py-3 text-left">Picture</th>
              <th className="border border-gray-200 px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductRow
                key={product._id}
                srNo={index + 1}
                setOpenPopup={setOpenPopup}
                popupType={popupType}
                setUpdateTable={setUpdateTable}
                product={product}
                setPopupType={setPopupType}
                setProductToUpdate={setProductToUpdate}
                productToUpdate={productToUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {openPopup && popupType === 'update' && (
        <PopupProductUpdate
          setOpenPopup={setOpenPopup}
          setUpdateTable={setUpdateTable}
          setPopupType={setPopupType}
          popupType={popupType}
          productToUpdate={productToUpdate}
        />
      )}

      {openPopup && popupType === 'insert' && (
        <PoppupProductInsert
          setOpenPopup={setOpenPopup}
          setUpdateTable={setUpdateTable}
          setPopupType={setPopupType}
          popupType={popupType}
        />
      )}
    </div>
  );
};

export default ProductsPage;