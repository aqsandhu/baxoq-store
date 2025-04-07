import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';
import { getProducts } from '../slices/productSlice';
import { AppDispatch, RootState } from '../store';
import Loader from '../components/ui/Loader';

// Define types
interface FilterState {
  category: string;
  priceRange: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
  featured: boolean;
  collectible: boolean;
}

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterState>({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') === 'true',
    collectible: searchParams.get('collectible') === 'true'
  });

  const { products, loading, error, page, pages } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filter.category) params.category = filter.category;
    if (filter.priceRange) params.priceRange = filter.priceRange;
    if (filter.sortBy) params.sortBy = filter.sortBy;
    if (filter.minPrice) params.minPrice = filter.minPrice;
    if (filter.maxPrice) params.maxPrice = filter.maxPrice;
    if (filter.featured) params.featured = 'true';
    if (filter.collectible) params.collectible = 'true';
    
    setSearchParams(params);
    dispatch(getProducts(params));
  }, [dispatch, filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '/placeholder.jpg',
        price: product.price,
        countInStock: product.countInStock,
        quantity: 1,
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title text-4xl mb-12">Our Collection</h1>

      {/* Filters */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-12 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="input w-full"
            >
              <option value="">All Categories</option>
              <option value="sword">Swords</option>
              <option value="knife">Knives</option>
              <option value="dagger">Daggers</option>
              <option value="accessory">Accessories</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                value={filter.minPrice}
                onChange={handlePriceRangeChange}
                placeholder="Min"
                className="input w-1/2"
              />
              <input
                type="number"
                name="maxPrice"
                value={filter.maxPrice}
                onChange={handlePriceRangeChange}
                placeholder="Max"
                className="input w-1/2"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filter.sortBy}
              onChange={handleFilterChange}
              className="input w-full"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </div>

          {/* Special Filters */}
          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={filter.featured}
                onChange={handleFilterChange}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured Only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="collectible"
                checked={filter.collectible}
                onChange={handleFilterChange}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Collectible Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-gray-600 mt-2">Try changing your filter options</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="card group">
              <Link to={`/products/${product.slug}`} className="block relative">
                <div className="relative overflow-hidden">
                  <div className="bg-gray-200 h-56 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <p className="text-gray-500">Product Image</p>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    {product.isFeatured && (
                      <span className="bg-primary/80 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    {product.isCollectible && (
                      <span className="bg-secondary/80 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
                        Collectible
                      </span>
                    )}
                    <span className="bg-gray-800/80 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-cinzel font-bold mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex text-secondary mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm dark:text-gray-400">{product.rating}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-cinzel font-bold text-primary">${product.price.toFixed(2)}</span>
                    <button 
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center mt-16">
          <nav className="flex items-center space-x-2">
            <button 
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              onClick={() => {
                if (page > 1) {
                  dispatch(getProducts({ ...filter, pageNumber: page - 1 }));
                }
              }}
              disabled={page <= 1}
            >
              Previous
            </button>
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                className={`px-3 py-1 rounded ${
                  x + 1 === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => dispatch(getProducts({ ...filter, pageNumber: x + 1 }))}
              >
                {x + 1}
              </button>
            ))}
            <button 
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              onClick={() => {
                if (page < pages) {
                  dispatch(getProducts({ ...filter, pageNumber: page + 1 }));
                }
              }}
              disabled={page >= pages}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList;
