import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">404</h1>
        <div className="h-1 w-20 bg-primary-600 mx-auto mb-8"></div>
        
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <div className="mb-8">
          <Link 
            to="/" 
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Return to Homepage
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Looking for something specific?</h3>
          <p className="text-gray-600 mb-4">
            Try one of these popular links:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/products" className="text-primary-600 hover:underline">All Products</Link>
            <Link to="/contact" className="text-primary-600 hover:underline">Contact Us</Link>
            <Link to="/about" className="text-primary-600 hover:underline">About Us</Link>
            <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
