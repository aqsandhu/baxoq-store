const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

// @desc    Fetch all products with filtering & pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  // Build filter object
  const filter = {};
  
  // Keyword search
  if (req.query.keyword) {
    filter.name = {
      $regex: req.query.keyword,
      $options: 'i'
    };
  }
  
  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Featured filter
  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }
  
  // Collectible filter
  if (req.query.collectible === 'true') {
    filter.isCollectible = true;
  }
  
  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  
  // Get total count for pagination
  const count = await Product.countDocuments(filter);
  
  // Build sort object
  const sort = {};
  if (req.query.sort) {
    const sortFields = req.query.sort.split(',');
    sortFields.forEach(field => {
      const [key, value] = field.split(':');
      sort[key] = value === 'desc' ? -1 : 1;
    });
  } else {
    sort.createdAt = -1; // Default sort by newest
  }
  
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('user', 'name email');
  
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count
  });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'name email');
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Fetch single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('user', 'name email');
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const {
    name,
    category,
    subCategory,
    description,
    price,
    countInStock,
    images,
    details,
    isFeatured,
    isCollectible,
    metaTitle,
    metaDescription,
    metaKeywords,
    videoUrl
  } = req.body;

  // Check if product with same name exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(400);
    throw new Error('Product with this name already exists');
  }

  const product = new Product({
    user: req.user._id,
    name,
    category,
    subCategory,
    description,
    price,
    countInStock,
    images: images || [],
    details: details || {},
    isFeatured: isFeatured || false,
    isCollectible: isCollectible || false,
    metaTitle: metaTitle || name,
    metaDescription: metaDescription || description.substring(0, 160),
    metaKeywords: metaKeywords || '',
    videoUrl: videoUrl || ''
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const {
    name,
    category,
    subCategory,
    description,
    price,
    countInStock,
    images,
    details,
    isFeatured,
    isCollectible,
    metaTitle,
    metaDescription,
    metaKeywords,
    videoUrl
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if new name conflicts with existing product
  if (name && name !== product.name) {
    const productExists = await Product.findOne({ name });
    if (productExists) {
      res.status(400);
      throw new Error('Product with this name already exists');
    }
  }

  // Update product fields
  product.name = name || product.name;
  product.category = category || product.category;
  product.subCategory = subCategory || product.subCategory;
  product.description = description || product.description;
  product.price = price || product.price;
  product.countInStock = countInStock || product.countInStock;
  product.images = images || product.images;
  product.details = details || product.details;
  product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
  product.isCollectible = isCollectible !== undefined ? isCollectible : product.isCollectible;
  product.metaTitle = metaTitle || product.metaTitle;
  product.metaDescription = metaDescription || product.metaDescription;
  product.metaKeywords = metaKeywords || product.metaKeywords;
  product.videoUrl = videoUrl || product.videoUrl;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide both rating and comment');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(5);

  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(8);

  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
};
