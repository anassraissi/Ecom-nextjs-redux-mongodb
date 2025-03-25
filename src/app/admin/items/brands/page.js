'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import BrandInsertModal from '@/components/adminPanel/BrandInsertModal';
import BrandUpdateModal from '@/components/adminPanel/BrandUpdateModal';
import { makeToast } from '../../../../../utils/helpers';
import { fetchBrands,removeBrand } from '@/redux/features/brandSlice';

function BrandList() {

  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.brands);

  const [openPopup, setOpenPopup] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [brandToUpdate, setBrandToUpdate] = useState(null);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch,updateTable]);
  
  const openModal = () => setOpenPopup(true);

  if (status === 'loading') return <p>Loading brands...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  const handleDelete = async (id) => {
    try {
      dispatch(removeBrand(id));
      setUpdateTable((prev) => !prev);
      makeToast('The brand successfully deleted ');
    } catch (err) {
      console.error('Error deleting brand:', err);
    }
  };
  const handleUpdate = (brand) => {
    setBrandToUpdate(brand);
    setUpdateModalIsOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg h-[calc(100vh-96px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Brands</h2>
        <button onClick={openModal} className="bg-blue hover:bg-blue text-white px-4 py-2 rounded">
          Add Brand
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-500">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Description</th>
              <th className="border border-gray-200 px-4 py-2">Logo</th>
              <th className="border border-gray-200 px-4 py-2">Categories</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands?.map((brand) => (
              <tr key={brand._id} className="border-b border-gray-200">
                <td className="px-4 py-2">{brand.name}</td>
                <td className="px-4 py-2">{brand.description}</td>
                <td className="px-4 py-2">
                  {brand.logoUrl && (
                    <img
                      src={`/images/brands/${brand.logoUrl}`}
                      alt={brand.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {brand.categories?.map((category) => category.name).join(', ')}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleUpdate(brand)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
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