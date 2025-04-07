import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  saveShippingAddress, 
  savePaymentMethod,
  updateCartPrices 
} from '../slices/cartSlice';
import { createOrder } from '../slices/orderSlice';
import { RootState, AppDispatch } from '../store';

// Step components
const ShippingStep = ({ 
  shippingAddress, 
  onShippingSubmit 
}: { 
  shippingAddress: any, 
  onShippingSubmit: (data: any) => void 
}) => {
  const [formData, setFormData] = useState({
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || ''
  });
  const [formErrors, setFormErrors] = useState<{
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      address?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    } = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onShippingSubmit(formData);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`input ${formErrors.address ? 'border-red-500' : ''}`}
            placeholder="123 Main St"
          />
          {formErrors.address && (
            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`input ${formErrors.city ? 'border-red-500' : ''}`}
            placeholder="New York"
          />
          {formErrors.city && (
            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`input ${formErrors.postalCode ? 'border-red-500' : ''}`}
            placeholder="10001"
          />
          {formErrors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`input ${formErrors.country ? 'border-red-500' : ''}`}
            placeholder="United States"
          />
          {formErrors.country && (
            <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary w-full">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

const PaymentStep = ({ 
  paymentMethod, 
  onPaymentSubmit 
}: { 
  paymentMethod: string, 
  onPaymentSubmit: (method: string) => void 
}) => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'creditCard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSubmit(selectedMethod);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 space-y-4">
          <div className="flex items-center">
            <input
              id="creditCard"
              name="paymentMethod"
              type="radio"
              checked={selectedMethod === 'creditCard'}
              onChange={() => setSelectedMethod('creditCard')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="creditCard" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Credit Card
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="paypal"
              name="paymentMethod"
              type="radio"
              checked={selectedMethod === 'paypal'}
              onChange={() => setSelectedMethod('paypal')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              PayPal
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="stripe"
              name="paymentMethod"
              type="radio"
              checked={selectedMethod === 'stripe'}
              onChange={() => setSelectedMethod('stripe')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stripe
            </label>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary w-full">
          Continue to Review
        </button>
      </form>
    </div>
  );
};

const ReviewStep = ({ 
  cartItems, 
  shippingAddress, 
  paymentMethod, 
  itemsPrice, 
  shippingPrice, 
  taxPrice, 
  totalPrice, 
  onPlaceOrder 
}: { 
  cartItems: any[], 
  shippingAddress: any, 
  paymentMethod: string, 
  itemsPrice: number, 
  shippingPrice: number, 
  taxPrice: number, 
  totalPrice: number, 
  onPlaceOrder: () => void 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Review</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Shipping</h3>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
          {shippingAddress.postalCode}, {shippingAddress.country}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Payment</h3>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Method:</strong> {paymentMethod}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Items</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems.map((item) => (
              <li key={item.product} className="p-4 flex items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex-shrink-0 mr-4">
                  <p className="flex items-center justify-center h-full text-gray-500 text-xs">Image</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Items:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <button onClick={onPlaceOrder} className="btn btn-primary w-full">
        Place Order
      </button>
    </div>
  );
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { success, order } = useSelector((state: RootState) => state.orders);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Calculate prices
    dispatch(updateCartPrices());
    
    // Redirect to order page after successful order creation
    if (success && order) {
      navigate(`/order/${order._id}`);
    }
  }, [dispatch, navigate, user, cartItems, success, order]);
  
  const handleShippingSubmit = (data: any) => {
    dispatch(saveShippingAddress(data));
    setActiveStep(2);
  };
  
  const handlePaymentSubmit = (method: string) => {
    dispatch(savePaymentMethod(method));
    setActiveStep(3);
  };
  
  const handlePlaceOrder = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-center w-1/3">
              <span className={`text-sm ${activeStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                Shipping
              </span>
            </div>
            <div className="text-center w-1/3">
              <span className={`text-sm ${activeStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                Payment
              </span>
            </div>
            <div className="text-center w-1/3">
              <span className={`text-sm ${activeStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                Review
              </span>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {activeStep === 1 && (
            <ShippingStep 
              shippingAddress={shippingAddress} 
              onShippingSubmit={handleShippingSubmit} 
            />
          )}
          
          {activeStep === 2 && (
            <PaymentStep 
              paymentMethod={paymentMethod} 
              onPaymentSubmit={handlePaymentSubmit} 
            />
          )}
          
          {activeStep === 3 && (
            <ReviewStep 
              cartItems={cartItems}
              shippingAddress={shippingAddress}
              paymentMethod={paymentMethod}
              itemsPrice={itemsPrice}
              shippingPrice={shippingPrice}
              taxPrice={taxPrice}
              totalPrice={totalPrice}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
