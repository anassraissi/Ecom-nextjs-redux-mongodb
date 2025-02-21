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
  const [popupType, setPopupType] = useState('')
  const [updateTable, setUpdateTable] = useState(false); // Refresh table state
  
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get("/api/get_products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProducts();
  }, [updateTable]); 

  return (
    <div className="bg-white h-[calc(100vh-96px)] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">All Products</h2>
        <button 
          className="bg-blue-500 text-blue px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setPopupType('insert')
            setOpenPopup(true);
          }}
        >
          Add Product
        </button>
      </div>
      
      <div className="h-[calc(100vh-180px)] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-500 bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">SR No.</th>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Price</th>
              <th className="border border-gray-200 px-4 py-2">Category</th>
              <th className="border border-gray-200 px-4 py-2">Brand</th>
              <th className="border border-gray-200 px-4 py-2">Picture</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
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
              />
            ))} 
          </tbody>
        </table>
      </div>

      {openPopup && popupType=='update'  && (
        <PopupProductUpdate 
          setOpenPopup={setOpenPopup} 
          setUpdateTable={setUpdateTable}
          setPopupType={setPopupType}
          popupType={popupType}

        />
      )}
      {openPopup && popupType=='insert'  && (
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
