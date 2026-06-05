import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Order Placed! - FreshMart';
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOne(id);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="success-page page-wrapper">
      <div className="container">
        <div className="success-content animate-fadeInUp">
          {/* Animated Checkmark */}
          <div className="success-icon-wrapper">
            <div className="success-circle">
              <svg className="success-checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>

          <h1>Order Placed Successfully! 🎉</h1>
          <p className="success-subtitle">
            Your order has been confirmed and will be delivered to you soon.
          </p>

          {order && (
            <div className="order-info-card">
              <div className="order-info-header">
                <div>
                  <p className="order-info-label">Order Number</p>
                  <h2 className="order-number">#{order.orderNumber}</h2>
                </div>
                <div className="order-status-badge">
                  <span>✅ {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                </div>
              </div>

              <div className="order-info-grid">
                <div className="order-info-item">
                  <span>📍 Delivering to</span>
                  <strong>{order.shippingAddress.fullName}</strong>
                  <small>{order.shippingAddress.city}, {order.shippingAddress.state}</small>
                </div>
                <div className="order-info-item">
                  <span>📅 Expected Delivery</span>
                  <strong>{order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }) : '2 days'}</strong>
                  {order.deliverySlot && <small>{order.deliverySlot}</small>}
                </div>
                <div className="order-info-item">
                  <span>💳 Payment</span>
                  <strong>{order.paymentMethod.toUpperCase()}</strong>
                  <small>{order.paymentStatus}</small>
                </div>
                <div className="order-info-item">
                  <span>💰 Total Paid</span>
                  <strong className="total-amount">₹{order.totalAmount}</strong>
                  <small>{order.items.length} items</small>
                </div>
              </div>

              {/* Items summary */}
              <div className="success-items">
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="success-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }}
                    />
                    <div>
                      <p>{item.name}</p>
                      <small>Qty: {item.quantity} × ₹{item.price}</small>
                    </div>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <p className="more-items-text">+{order.items.length - 4} more items</p>
                )}
              </div>
            </div>
          )}

          {/* Delivery Steps */}
          <div className="delivery-steps">
            <h3>What happens next?</h3>
            <div className="steps-timeline">
              {[
                { icon: '✅', title: 'Order Confirmed', desc: 'We\'ve received your order', done: true },
                { icon: '🔄', title: 'Being Prepared', desc: 'Your items are being packed', done: false },
                { icon: '🚚', title: 'Out for Delivery', desc: 'On the way to you', done: false },
                { icon: '📦', title: 'Delivered', desc: 'Enjoy your fresh groceries!', done: false },
              ].map((step, i) => (
                <div key={i} className={`timeline-step ${step.done ? 'done' : ''}`}>
                  <div className="timeline-icon">{step.icon}</div>
                  <div className="timeline-content">
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="success-actions">
            <Link to={`/orders/${id}`} className="btn btn-primary btn-lg" id="view-order-btn">
              📦 Track Order
            </Link>
            <Link to="/orders" className="btn btn-secondary btn-lg" id="view-all-orders-btn">
              📋 My Orders
            </Link>
            <Link to="/products" className="btn btn-secondary btn-lg" id="continue-shopping-success-btn">
              🛍️ Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
