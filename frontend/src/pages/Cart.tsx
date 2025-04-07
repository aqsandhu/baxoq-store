import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  addToCart, 
  removeFromCart, 
  updateCartPrices 
} from '../slices/cartSlice';
import { RootState, AppDispatch } from '../store';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );
  
  useEffect(() => {
    // Calculate prices when component mounts
    dispatch(updateCartPrices());
  }, [dispatch]);
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    // Find the product in cart
    const existingItem = cartItems.find(item => item.product === productId);
    
    if (existingItem) {
      dispatch(
        addToCart({
          ...existingItem,
          quantity,
        })
      );
    }
  };
  
  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title text-3xl mb-10">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-10 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-xl mb-6 font-cinzel">Your cart is empty</p>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-cinzel font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-cinzel font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-cinzel font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-cinzel font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-cinzel font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <tr key={item.product}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 mr-4">
                            <p className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-xs">Image</p>
                          </div>
                          <div>
                            <Link 
                              to={`/products/${item.product}`} 
                              className="text-sm font-cinzel font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-secondary"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product, Number(e.target.value))}
                          className="input py-1 px-2 w-16 dark:bg-gray-700 dark:border-gray-600"
                        >
                          {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.product)}
                          className="text-primary hover:text-primary-light dark:text-secondary dark:hover:text-secondary-light transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <Link to="/products" className="text-primary hover:text-primary-light dark:text-secondary dark:hover:text-secondary-light flex items-center transition-colors font-cinzel">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-cinzel font-bold mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-cinzel font-semibold">Total</span>
                    <span className="font-cinzel font-bold text-lg text-primary dark:text-secondary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="btn btn-secondary w-full py-3"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Secure Checkout</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Multiple Payment Options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
