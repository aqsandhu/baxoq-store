import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductDetails, createProductReview} from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { RootState, AppDispatch } from '../store';
import ImageGallery from '../components/ImageGallery';
import Rating from '../components/Rating';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import ProductCard from '../components/ProductCard';

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 0,
    comment: ''
  });

  const { user } = useSelector((state: RootState) => state.auth);
  const { product, loading, error } = useSelector((state: RootState) => state.products);
  const { success: successReview } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, successReview]);

  const addToCartHandler = () => {
    if (product) {
      dispatch(addToCart({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        countInStock: product.countInStock,
        quantity: qty
      }));
      navigate('/cart');
    }
  };

  const submitReviewHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(createProductReview({ 
        productId: id, 
        review: {
          rating: reviewForm.rating,
          comment: reviewForm.comment
        }
      }));
      setReviewForm({ rating: 0, comment: '' });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product) return <Message variant="danger">Product not found</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="sticky top-4">
          <ImageGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Specifications */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Blade Length</p>
                <p className="font-medium">{product.specifications?.bladeLength || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Overall Length</p>
                <p className="font-medium">{product.specifications?.overallLength || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Weight</p>
                <p className="font-medium">{product.specifications?.weight || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Material</p>
                <p className="font-medium">{product.specifications?.material || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="mr-4">Quantity:</span>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border rounded px-3 py-2"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className={`w-full py-2 px-4 rounded ${
                product.countInStock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white font-semibold`}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {product.reviews.length === 0 && <Message>No reviews yet</Message>}
            {product.reviews.map((review: Review) => (
              <div key={review._id} className="border-b py-4">
                <div className="flex items-center mb-2">
                  <Rating value={review.rating} />
                  <span className="ml-2 text-sm text-gray-600">
                    by {review.name} on {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}

            {/* Review Form */}
            {user ? (
              <form onSubmit={submitReviewHandler} className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="border rounded px-3 py-2 w-full"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                    rows={4}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <Message>
                Please <Link to="/login">sign in</Link> to write a review
              </Message>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {product.relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
