// Order service functions
const createOrder = async (orderData: {
  orderItems: Array<{
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}) => {
  try {
    // For development/demo purposes - mock order creation
    const mockOrder = {
      _id: 'order_' + Math.random().toString(36).substring(2, 11),
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}')._id : 'guest',
      orderItems: orderData.orderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      itemsPrice: orderData.itemsPrice,
      shippingPrice: orderData.shippingPrice,
      taxPrice: orderData.taxPrice,
      totalPrice: orderData.totalPrice,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString()
    };
    
    // Save the order to localStorage for persistence
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(mockOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return mockOrder;
    
    // In a real app with backend, you would use this code:
    // const response = await API.post('/orders', orderData);
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id: string) => {
  try {
    // For development/demo purposes - get order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find((o: any) => o._id === id);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
    
    // In a real app with backend, you would use this code:
    // const response = await API.get(`/orders/${id}`);
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyOrders = async () => {
  try {
    // For development/demo purposes - get user orders from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const myOrders = orders.filter((o: any) => o.user === user._id);
    
    return myOrders;
    
    // In a real app with backend, you would use this code:
    // const response = await API.get('/orders/myorders');
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    // For development/demo purposes - get all orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders;
    
    // In a real app with backend, you would use this code:
    // const response = await API.get('/orders');
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const updateOrderToPaid = async (orderId: string, paymentResult: {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}) => {
  try {
    // For development/demo purposes - update order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex((o: any) => o._id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      isPaid: true,
      paidAt: new Date().toISOString(),
      paymentResult: paymentResult
    };
    
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return orders[orderIndex];
    
    // In a real app with backend, you would use this code:
    // const response = await API.put(`/orders/${orderId}/pay`, paymentResult);
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const updateOrderToDelivered = async (orderId: string) => {
  try {
    // For development/demo purposes - update order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex((o: any) => o._id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      isDelivered: true,
      deliveredAt: new Date().toISOString()
    };
    
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return orders[orderIndex];
    
    // In a real app with backend, you would use this code:
    // const response = await API.put(`/orders/${orderId}/deliver`);
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const orderService = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};

export default orderService;
