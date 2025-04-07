import API from './api';

// Import the MOCK_TOKEN constant
const MOCK_TOKEN = 'mock-jwt-token-for-development-only';

// Initialize mock products if needed
const initializeMockProducts = () => {
  if (!localStorage.getItem('mockProducts')) {
    const seedProducts = [
      {
        _id: 'product_seed1',
        name: 'Damascus Steel Knife',
        slug: 'damascus-steel-knife',
        price: 199.99,
        description: 'Handcrafted Damascus steel knife with a beautiful pattern and sharp edge.',
        countInStock: 15,
        category: 'knife',
        brand: 'Damascus Forge',
        rating: 4.8,
        numReviews: 12,
        image: 'https://images.unsplash.com/photo-1678149834200-1883e00c1835',
        images: [
          'https://images.unsplash.com/photo-1678149834200-1883e00c1835',
          'https://images.unsplash.com/photo-1591643908583-c53ba42aa1d7'
        ],
        featured: true,
        reviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'product_seed2',
        name: 'Medieval Longsword',
        slug: 'medieval-longsword',
        price: 349.99,
        description: 'Authentic replica of a medieval longsword with leather grip and steel blade.',
        countInStock: 8,
        category: 'sword',
        brand: 'Historical Arms',
        rating: 4.5,
        numReviews: 8,
        image: 'https://images.unsplash.com/photo-1591643908583-c53ba42aa1d7',
        images: [
          'https://images.unsplash.com/photo-1591643908583-c53ba42aa1d7',
          'https://images.unsplash.com/photo-1678149834200-1883e00c1835'
        ],
        featured: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        reviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('mockProducts', JSON.stringify(seedProducts));
    console.log('Initialized mock products database with seed data');
  }
};

// Try to initialize mock products
initializeMockProducts();

// Product service functions
const getAllProducts = async (params?: {
  keyword?: string;
  category?: string;
  pageNumber?: number;
  sortBy?: string;
}) => {
  try {
    // Check if using mock token for development
    const token = localStorage.getItem('token');
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Getting mock products');
      
      // Get mock products from localStorage
      let mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      
      // Apply filtering if needed
      if (params?.category) {
        mockProducts = mockProducts.filter((p: any) => 
          p.category.toLowerCase() === params.category?.toLowerCase()
        );
      }
      
      if (params?.keyword) {
        const keyword = params.keyword.toLowerCase();
        mockProducts = mockProducts.filter((p: any) => 
          p.name.toLowerCase().includes(keyword) || 
          p.description.toLowerCase().includes(keyword)
        );
      }
      
      // Handle pagination
      const page = params?.pageNumber || 1;
      const pageSize = 8;
      const startIndex = (page - 1) * pageSize;
      const paginatedProducts = mockProducts.slice(startIndex, startIndex + pageSize);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        products: paginatedProducts,
        page,
        pages: Math.ceil(mockProducts.length / pageSize)
      };
    }
    
    // For production with real API
    const response = await API.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const getProductById = async (id: string) => {
  try {
    // Check if using mock token for development
    const token = localStorage.getItem('token');
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Getting mock product by ID');
      
      // Get mock products from localStorage
      const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      const product = mockProducts.find((p: any) => p._id === id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return product;
    }
    
    // For production with real API
    const response = await API.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    // Check if using mock token for development
    const token = localStorage.getItem('token');
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Getting mock product by slug');
      
      // Get mock products from localStorage
      const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      const product = mockProducts.find((p: any) => p.slug === slug);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return product;
    }
    
    // For production with real API
    const response = await API.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

const getFeaturedProducts = async () => {
  try {
    // Check if using mock token for development
    const token = localStorage.getItem('token');
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Getting mock featured products');
      
      // Get mock products from localStorage
      const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      const featuredProducts = mockProducts.filter((p: any) => p.featured);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return featuredProducts;
    }
    
    // For production with real API
    const response = await API.get('/products/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

const createProduct = async (productData: any) => {
  // Get token
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in to create a product');
  }

  try {
    // Check if using mock token for development
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Creating mock product');
      
      // Ensure we have a default image if none provided
      if (!productData.images || productData.images.length === 0) {
        productData.images = [
          'https://images.unsplash.com/photo-1678149834200-1883e00c1835',
          'https://images.unsplash.com/photo-1591643908583-c53ba42aa1d7'
        ];
      }
      
      // Generate a proper YouTube embed URL if videoUrl is provided
      if (productData.videoUrl) {
        const videoUrl = productData.videoUrl;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        
        if (match && match[2].length === 11) {
          productData.videoEmbedUrl = `https://www.youtube.com/embed/${match[2]}`;
        }
      }
      
      // Create a complete mock product response
      const mockProduct = {
        ...productData,
        _id: 'product_' + Math.random().toString(36).substring(2, 11),
        rating: 0,
        numReviews: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add image if not present
        image: productData.images[0] || 'https://images.unsplash.com/photo-1678149834200-1883e00c1835'
      };
      
      // In development mode, add the product to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      existingProducts.push(mockProduct);
      localStorage.setItem('mockProducts', JSON.stringify(existingProducts));
      
      console.log('Mock product created:', mockProduct);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockProduct;
    }
    
    // For production with real API
    const response = await API.post('/products', productData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw error;
  }
};

const updateProduct = async (id: string, productData: any) => {
  // Ensure user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in to update a product');
  }

  try {
    // Check if using mock token for development
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Updating mock product');
      
      // Get mock products from localStorage
      const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      const existingProductIndex = mockProducts.findIndex((p: any) => p._id === id);
      
      if (existingProductIndex === -1) {
        throw new Error('Product not found');
      }
      
      // Generate a proper YouTube embed URL if videoUrl is provided
      if (productData.videoUrl) {
        const videoUrl = productData.videoUrl;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        
        if (match && match[2].length === 11) {
          productData.videoEmbedUrl = `https://www.youtube.com/embed/${match[2]}`;
        }
      }
      
      // Create updated product
      const updatedProduct = {
        ...mockProducts[existingProductIndex],
        ...productData,
        updatedAt: new Date().toISOString(),
        // Update main image if images array changed
        image: productData.images?.[0] || mockProducts[existingProductIndex].image
      };
      
      // Update in the array
      mockProducts[existingProductIndex] = updatedProduct;
      
      // Save back to localStorage
      localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
      
      console.log('Mock product updated:', updatedProduct);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return updatedProduct;
    }
    
    // For production with real API
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating product:', error);
    // If the error is authentication-related, handle it specifically
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication failed. Please log in again.');
    }
    throw error;
  }
};

const deleteProduct = async (id: string) => {
  // Ensure user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in to delete a product');
  }

  try {
    // Check if using mock token for development
    if (token === MOCK_TOKEN) {
      console.log('Development mode: Deleting mock product');
      
      // Get mock products from localStorage
      const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      const filteredProducts = mockProducts.filter((p: any) => p._id !== id);
      
      // If no products were removed, the ID wasn't found
      if (filteredProducts.length === mockProducts.length) {
        throw new Error('Product not found');
      }
      
      // Save back to localStorage
      localStorage.setItem('mockProducts', JSON.stringify(filteredProducts));
      
      console.log('Mock product deleted');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { message: 'Product removed' };
    }
    
    // For production with real API
    const response = await API.delete(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting product:', error);
    // If the error is authentication-related, handle it specifically
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication failed. Please log in again.');
    }
    throw error;
  }
};

const createProductReview = async (productId: string, reviewData: {
  rating: number;
  comment: string;
}) => {
  const response = await API.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};

export default productService;
