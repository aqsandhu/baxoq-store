import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../slices/productSlice';
import { RootState, AppDispatch } from '../store';
import Loader from '../components/ui/Loader';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-primary-dark to-gray-900 text-white rounded-xl overflow-hidden shadow-xl mb-16 border border-gray-800">
        <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center bg-hero-pattern">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold leading-tight mb-6">
              <span className="text-secondary">Premium</span> Swords & Knives 
              <span className="text-primary"> Collection</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Discover our exquisite collection of traditional and modern blades crafted with precision and artistry.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products" className="btn btn-secondary">Explore Collection</Link>
              <Link to="/about" className="btn btn-outline text-white border-secondary">Our Legacy</Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-800 bg-opacity-50 h-80 rounded-lg flex items-center justify-center shadow-inner border border-gray-700 transform rotate-1">
              <p className="text-xl text-gray-400">Hero Image Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="text-secondary hover:text-secondary-light transition-colors font-cinzel">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product._id} className="card group">
                <div className="relative overflow-hidden">
                  <div className="bg-gray-200 h-56 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <p className="text-gray-500">Product Image</p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-primary/80 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-cinzel font-bold mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-gray-600 mb-4 dark:text-gray-400">{product.description?.substring(0, 80)}...</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-cinzel font-bold text-primary">${product.price.toFixed(2)}</span>
                    <Link to={`/products/${product.slug}`} className="btn btn-secondary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="section-title mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Swords', description: 'From medieval to fantasy designs' },
            { name: 'Knives', description: 'Tactical and collector\'s pieces' },
            { name: 'Daggers', description: 'Ornate and ceremonial blades' },
            { name: 'Accessories', description: 'Stands, care kits, and more' }
          ].map((category) => (
            <div key={category.name} className="relative overflow-hidden rounded-lg shadow-lg h-56 group">
              <div className="bg-gray-800 h-full w-full flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                <p className="text-gray-600">{category.name} Image</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex flex-col items-center justify-end p-6 text-center">
                <h3 className="text-white text-2xl font-cinzel font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 mb-4">{category.description}</p>
                <Link 
                  to={`/products?category=${category.name.toLowerCase()}`} 
                  className="btn btn-outline text-white border-secondary hover:bg-secondary hover:border-secondary transition-colors"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="section-title mb-8">What Our Collectors Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Alexander Wright', location: 'California', quote: "The craftsmanship is impeccable. These are more than just weapons - they're works of art that pay homage to historical techniques." },
            { name: 'Emily Chen', location: 'New York', quote: "Baxoq.Store has the best selection of traditional blades I've found. The attention to detail in each piece is remarkable." },
            { name: 'Michael Torres', location: 'Texas', quote: "As a collector for over 15 years, I can say with confidence that the quality of Baxoq's pieces exceeds my highest expectations." }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 relative">
              <div className="absolute -top-5 left-6 text-4xl text-secondary opacity-20">"</div>
              <div className="flex items-center mb-4 mt-2">
                <div className="h-14 w-14 rounded-full bg-gray-300 dark:bg-gray-700 mr-4 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-cinzel font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  <div className="flex text-secondary mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-gray-900 to-primary-dark text-white rounded-xl p-10 mb-12 border border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-cinzel font-bold mb-2">Join the Collector's Circle</h2>
            <p className="text-gray-300">Get early access to new arrivals, exclusive offers, and expert advice.</p>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary bg-gray-800 border-gray-700 text-gray-100"
              />
              <button className="bg-secondary hover:bg-secondary-light px-6 py-3 rounded-r-md font-cinzel uppercase tracking-wider transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
