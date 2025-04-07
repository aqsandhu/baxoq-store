import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getProductDetails, 
  createProduct, 
  updateProduct, 
  resetSuccess 
} from '../../slices/productSlice';
import { RootState, AppDispatch } from '../../store';

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    countInStock: '',
    brand: '',
    featured: false,
    images: [] as string[],
    videoUrl: ''
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { product, loading, error, success } = useSelector(
    (state: RootState) => state.products
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setAuthError('You need to be logged in to manage products');
        navigate('/login?redirect=admin');
        return false;
      }
      
      if (user && !user.isAdmin) {
        setAuthError('You need admin privileges to manage products');
        navigate('/');
        return false;
      }
      
      return true;
    };
    
    const initForm = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;
      
      // If editing, load the product data
      if (isEditMode && id) {
        dispatch(getProductDetails(id));
      }
    };
    
    initForm();
    
    // Redirect back to products list when operation is successful
    if (success) {
      navigate('/admin/products');
    }
    
    // Clear success state when component unmounts
    return () => {
      dispatch(resetSuccess());
    };
  }, [dispatch, isEditMode, id, success, navigate, user]);
  
  // Populate form with product data when product is loaded
  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description,
        countInStock: product.countInStock.toString(),
        brand: product.brand || '',
        featured: product.featured,
        images: product.images || [],
        videoUrl: product.videoUrl || ''
      });
    }
  }, [isEditMode, product]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Extract YouTube video ID from URL
  const getYoutubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : '';
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.countInStock.trim()) {
      errors.countInStock = 'Count in stock is required';
    } else if (isNaN(parseInt(formData.countInStock)) || parseInt(formData.countInStock) < 0) {
      errors.countInStock = 'Count in stock must be a non-negative number';
    }

    if (formData.videoUrl && !getYoutubeEmbedUrl(formData.videoUrl)) {
      errors.videoUrl = 'Please enter a valid YouTube URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Create a simplified product object with correct data types
        const productData: any = {
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description.trim(),
          countInStock: parseInt(formData.countInStock),
          brand: formData.brand.trim(),
          featured: formData.featured,
          images: formData.images.length > 0 ? formData.images : ['https://example.com/image1.jpg'],
          videoUrl: formData.videoUrl.trim() || ''
        };
        
        // Generate a slug from the product name for new products
        if (!isEditMode) {
          productData.slug = formData.name
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
        }
        
        // Set loading state before dispatching
        setFormErrors({});
        
        if (isEditMode && id) {
          console.log('Updating product:', productData);
          await dispatch(updateProduct({ id, productData })).unwrap();
          console.log('Product updated successfully');
        } else {
          console.log('Creating product:', productData);
          await dispatch(createProduct(productData)).unwrap();
          console.log('Product created successfully');
        }
        
        // Navigate will happen via useEffect when success state changes
      } catch (error: any) {
        console.error('Error submitting product form:', error);
        // Display error message to user
        setFormErrors(prev => ({
          ...prev,
          form: typeof error === 'string' ? error : error.message || 'Failed to save product. Please try again.'
        }));
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      {authError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {authError}
          <div className="mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login?redirect=admin')}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {formErrors.form && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {formErrors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${formErrors.name ? 'border-red-500' : ''}`}
              placeholder="Enter product name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price*
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`input ${formErrors.price ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
            )}
          </div>
          
          {/* Count in Stock */}
          <div>
            <label htmlFor="countInStock" className="block text-sm font-medium mb-1">
              Count in Stock*
            </label>
            <input
              type="text"
              id="countInStock"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className={`input ${formErrors.countInStock ? 'border-red-500' : ''}`}
              placeholder="0"
            />
            {formErrors.countInStock && (
              <p className="text-red-500 text-sm mt-1">{formErrors.countInStock}</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input ${formErrors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select Category</option>
              <option value="sword">Sword</option>
              <option value="knife">Knife</option>
              <option value="dagger">Dagger</option>
              <option value="accessory">Accessory</option>
            </select>
            {formErrors.category && (
              <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
            )}
          </div>
          
          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-1">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input"
              placeholder="Enter brand"
            />
          </div>
          
          {/* Featured */}
          <div>
            <div className="flex items-center h-full">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm font-medium">
                Featured Product
              </label>
            </div>
          </div>
          
          {/* Multiple Images Section */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Product Images
            </label>
            
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="h-24 w-24 border border-gray-300 rounded overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Product ${index}`} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="input flex-grow"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={addImage}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* YouTube Video URL */}
          <div className="col-span-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium mb-1">
              YouTube Video URL
            </label>
            <input
              type="text"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className={`input ${formErrors.videoUrl ? 'border-red-500' : ''}`}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {formErrors.videoUrl && (
              <p className="text-red-500 text-sm mt-1">{formErrors.videoUrl}</p>
            )}
            
            {formData.videoUrl && getYoutubeEmbedUrl(formData.videoUrl) && (
              <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="315"
                  src={getYoutubeEmbedUrl(formData.videoUrl)}
                  title="Product video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`input ${formErrors.description ? 'border-red-500' : ''}`}
              placeholder="Enter product description"
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center justify-center min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 