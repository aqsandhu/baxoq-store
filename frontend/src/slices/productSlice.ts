import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import productService from '../services/productService';
import axios from 'axios';

// Define types
interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  isFeatured: boolean;
  isCollectible: boolean;
  videoUrl?: string;
  reviews: Review[];
  relatedProducts: Product[];
  specifications?: {
    bladeLength?: string;
    overallLength?: string;
    weight?: string;
    material?: string;
  };
}

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
  success: boolean;
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  success: false,
};

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params: {
    keyword?: string;
    category?: string;
    pageNumber?: number;
    sortBy?: string;
  } = {}, { rejectWithValue }) => {
    try {
      return await productService.getAllProducts(params);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error getting product details'
      );
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  'products/getBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await productService.getProductBySlug(slug);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch product details';
      return rejectWithValue(message);
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeatured',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getFeaturedProducts();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch featured products';
      return rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: any, { rejectWithValue, dispatch }) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      console.log('Creating product with data:', productData);
      const result = await productService.createProduct(productData);
      console.log('Product creation result:', result);
      
      // Refresh the product list after creating a new product
      setTimeout(() => {
        dispatch(getProducts({}));
      }, 500);
      
      return result;
    } catch (error: any) {
      console.error('Error in createProduct thunk:', error);
      
      // Handle authentication errors specifically to prevent automatic redirect
      if (error.message && (
        error.message.includes('session has expired') || 
        error.message.includes('Authentication failed') ||
        error.message.includes('must be logged in')
      )) {
        return rejectWithValue('Authentication error. Please log in again.');
      }
      
      const message = error.response?.data?.message || error.message || 'Failed to create product';
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }: { id: string; productData: any }, { rejectWithValue }) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }
      
      console.log('Updating product with data:', productData);
      const result = await productService.updateProduct(id, productData);
      console.log('Product update result:', result);
      return result;
    } catch (error: any) {
      console.error('Error in updateProduct thunk:', error);
      
      // Handle authentication errors specifically to prevent automatic redirect
      if (error.message && (
        error.message.includes('session has expired') || 
        error.message.includes('Authentication failed') ||
        error.message.includes('must be logged in')
      )) {
        return rejectWithValue('Authentication error. Please log in again.');
      }
      
      const message = error.response?.data?.message || error.message || 'Failed to update product';
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }
      
      console.log('Deleting product with id:', id);
      const result = await productService.deleteProduct(id);
      console.log('Product deletion result:', result);
      return { id };
    } catch (error: any) {
      console.error('Error in deleteProduct thunk:', error);
      
      // Handle authentication errors specifically
      if (error.message && (
        error.message.includes('session has expired') || 
        error.message.includes('Authentication failed') ||
        error.message.includes('must be logged in')
      )) {
        return rejectWithValue('Authentication error. Please log in again.');
      }
      
      const message = error.response?.data?.message || error.message || 'Failed to delete product';
      return rejectWithValue(message);
    }
  }
);

export const createProductReview = createAsyncThunk(
  'products/createProductReview',
  async (
    { productId, review }: { productId: string; review: { rating: number; comment: string } },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, review);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error creating review'
      );
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<{ products: Product[]; page: number; pages: number }>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.success = true;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get product by slug
      .addCase(getProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get featured products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter((product) => product._id !== action.payload.id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product review
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductDetails, clearError, resetSuccess } = productSlice.actions;
export default productSlice.reducer;
