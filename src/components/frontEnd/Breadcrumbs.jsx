"use client";

const Breadcrumbs = ({ category, productName }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            Home
          </a>
        </li>
        {category && (
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <a href={`/category/${category.toLowerCase()}`} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                {category}
              </a>
            </div>
          </li>
        )}
        <li aria-current="page">
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-500">
              {productName}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;