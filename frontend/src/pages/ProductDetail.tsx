import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, createProductReview, clearError } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { RootState, AppDispatch } from '../store';
import Loader from '../components/ui/Loader';

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { product, loading, error, success } = useSelector(
    (state: RootState) => state.products
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }
    
    if (success) {
      setRating(0);
      setComment('');
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, slug, success]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '/placeholder.jpg',
          price: product.price,
          countInStock: product.countInStock,
          quantity,
        })
      );
    }
  };

  const submitReviewHandler = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product && rating > 0) {
      dispatch(
        createProductReview({
          productId: product._id,
          review: { rating, comment },
        })
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
        <Link to="/products" className="btn btn-primary">
          Go Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-4">
          Product not found
        </div>
        <Link to="/products" className="btn btn-primary">
          Go Back to Products
        </Link>
      </div>
    );
  }

  // Get YouTube video ID if present
  const videoId = product.videoUrl ? getYouTubeVideoId(product.videoUrl) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/products" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-secondary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 h-96 mb-4 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={`${product.name} - Image ${activeImage + 1}`}
                className="object-contain h-full w-full"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No images available</p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`bg-gray-100 dark:bg-gray-800 h-24 rounded-md cursor-pointer transition-all overflow-hidden ${
                    activeImage === index 
                      ? 'ring-2 ring-primary border-2 border-primary scale-105' 
                      : 'border border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="object-cover h-full w-full"
                  />
                </div>
              ))
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 h-24 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">No images</p>
              </div>
            )}
          </div>
          
          {/* YouTube Video Section */}
          {videoId && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Product Video</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Product Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap items-center mb-3">
            <span className="bg-primary-light/10 text-primary text-xs uppercase tracking-wider px-2 py-1 rounded mr-2">
              {product.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{product.brand}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">{product.rating} ({product.numReviews} reviews)</span>
          </div>
          
          <div className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            <ul className="space-y-1">
              <li className="flex">
                <span className="font-medium w-24 capitalize">Brand:</span>
                <span>{product.brand}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-24 capitalize">Category:</span>
                <span>{product.category}</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="input py-1 px-2"
                  disabled={product.countInStock === 0}
                >
                  {[...Array(Math.max(product.countInStock, 1)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </span>
                {product.countInStock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="btn btn-primary w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {/* Review Form */}
        {user ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            {reviewSubmitted && (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                Review submitted successfully!
              </div>
            )}
            <form onSubmit={submitReviewHandler}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex text-gray-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 cursor-pointer ${
                        i < rating ? 'text-yellow-400' : ''
                      }`}
                      viewBox="0 0 20 20"
                      fill={i < rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      onClick={() => setRating(i + 1)}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={rating === 0}>
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-8">
            Please <Link to="/login" className="font-bold underline">sign in</Link> to write a review
          </div>
        )}
        
        {/* Review List */}
        <div className="space-y-6">
          {product.reviews && product.reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet</p>
          ) : (
            product.reviews && product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill={i < review.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
