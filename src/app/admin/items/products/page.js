'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from "@/redux/features/loadingSlice";
import axios from 'axios';
import ProductRow from '@/components/adminPanel/ProductRow';
import PopupProductUpdate from '@/components/adminPanel/PopupProductUpdate';
import PoppupProductInsert from '@/components/adminPanel/PoppupProductInsert';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
            onClick={() => {
              setPopupType('insert');
              setOpenPopup(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found {searchQuery && `matching "${searchQuery}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openPopup && popupType === 'update' && (
        <PopupProductUpdate
          setOpenPopup={setOpenPopup}
          setUpdateTable={setUpdateTable}
          productToUpdate={productToUpdate}
        />
      )}

      {openPopup && popupType === 'insert' && (
        <PoppupProductInsert
          setOpenPopup={setOpenPopup}
          setUpdateTable={setUpdateTable}
        />
      )}
    </div>
  );
};

export default ProductsPage;