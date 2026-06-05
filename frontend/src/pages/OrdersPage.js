import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import './OrdersPage.css';

const statusConfig = {
  placed: { label: 'Placed', color: '#4ecdc4', emoji: '📋' },
  confirmed: { label: 'Confirmed', color: '#51cf66', emoji: '✅' },
  processing: { label: 'Processing', color: '#fcc419', emoji: '🔄' },
  shipped: { label: 'Shipped', color: '#74c0fc', emoji: '🚚' },
  delivered: { label: 'Delivered', color: '#51cf66', emoji: '📦' },
  cancelled: { label: 'Cancelled', color: '#ff6b6b', emoji: '❌' }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Orders - FreshMart';
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state animate-fadeInUp">
            <div className="empty-state-icon">📭</div>
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will appear here!</p>
            <Link to="/products" className="btn btn-primary mt-2" id="orders-empty-shop-btn">🛍️ Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const status = statusConfig[order.orderStatus] || statusConfig.placed;
              return (
                <div key={order._id} className="order-card animate-fadeInUp" id={`order-card-${order._id}`}>
                  <div className="order-card-header">
                    <div className="order-id-section">
                      <span className="order-id-label">Order</span>
                      <span className="order-id">#{order.orderNumber}</span>
                    </div>
                    <span
                      className="order-status-chip"
                      style={{ '--status-color': status.color }}
                    >
                      {status.emoji} {status.label}
                    </span>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="order-item-chip">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }}
                          />
                          <span>{item.name}</span>
                          <span className="qty-chip">×{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-chip">+{order.items.length - 3} more</div>
                      )}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-total">
                        <span>Total</span>
                        <strong>₹{order.totalAmount}</strong>
                      </div>
                      <div className="order-delivery">
                        <span>📍 {order.shippingAddress.city}</span>
                        {order.expectedDelivery && order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <span>📅 By {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                      <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm" id={`view-order-${order._id}`}>
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
