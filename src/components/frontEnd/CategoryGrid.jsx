'use client'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '@/redux/features/categorySlice'
import { useEffect } from 'react'

const ElectronicsSubcategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter electronics sub-categories based on the parent ID
  const electronicsSubCategories = categories.filter(
    (cat) => cat.parent === "67db60c662e1bb84e2b83aea"
  );

  if (loading) return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="py-12 bg-white text-center text-red-500">
      Failed to load categories
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">Explore specific areas within electronics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {electronicsSubCategories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${"67db60c662e1bb84e2b83aea"}/${category._id}`}
              className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all aspect-video"
              >
              <div className="relative w-full h-full">
                <Image
                  src={`/images/categories/${category.image}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1 flex items-center">
                    Shop now <FiArrowRight className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElectronicsSubcategories;