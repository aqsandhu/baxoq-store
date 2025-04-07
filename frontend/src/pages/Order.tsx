import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../slices/orderSlice';
import { RootState, AppDispatch } from '../store';
import type { Order as OrderType } from '../types/order';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

const Order = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { order, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order) return <Message>Order not found</Message>;

  const typedOrder = order as unknown as OrderType;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order {typedOrder._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping</h2>
          <p><strong>Name:</strong> {typedOrder.user.name}</p>
          <p><strong>Email:</strong> {typedOrder.user.email}</p>
          <p><strong>Address:</strong> {typedOrder.shippingAddress.address}</p>
          <p><strong>City:</strong> {typedOrder.shippingAddress.city}</p>
          <p><strong>Postal Code:</strong> {typedOrder.shippingAddress.postalCode}</p>
          <p><strong>Country:</strong> {typedOrder.shippingAddress.country}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p><strong>Payment Method:</strong> {typedOrder.paymentMethod}</p>
          <p><strong>Items Price:</strong> ${typedOrder.itemsPrice}</p>
          <p><strong>Shipping Price:</strong> ${typedOrder.shippingPrice}</p>
          <p><strong>Tax Price:</strong> ${typedOrder.taxPrice}</p>
          <p><strong>Total Price:</strong> ${typedOrder.totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default Order; 