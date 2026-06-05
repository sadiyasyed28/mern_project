import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';

const statusSteps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusConfig = {
  placed: { label: 'Placed', emoji: '📋', color: '#4ecdc4' },
  confirmed: { label: 'Confirmed', emoji: '✅', color: '#51cf66' },
  processing: { label: 'Processing', emoji: '🔄', color: '#fcc419' },
  shipped: { label: 'Shipped', emoji: '🚚', color: '#74c0fc' },
  delivered: { label: 'Delivered', emoji: '📦', color: '#51cf66' },
  cancelled: { label: 'Cancelled', emoji: '❌', color: '#ff6b6b' }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    document.title = 'Order Details - FreshMart';
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOne(id);
        setOrder(res.data.order);
      } catch (err) {
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      const res = await orderAPI.cancel(id);
      setOrder(res.data.order);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!order) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Order not found</h3>
            <Link to="/orders" className="btn btn-primary mt-2">Back to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.orderStatus];
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/orders" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>← Back to Orders</Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Order #{order.orderNumber}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{
              background: `${status.color}20`,
              border: `1px solid ${status.color}50`,
              color: status.color,
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: '700',
              fontSize: '0.875rem'
            }}>
              {status.emoji} {status.label}
            </span>
            {['placed', 'confirmed'].includes(order.orderStatus) && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleCancel}
                disabled={cancelling}
                id="cancel-order-btn"
              >
                {cancelling ? 'Cancelling...' : '× Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {order.orderStatus !== 'cancelled' && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Order Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              {statusSteps.map((step, i) => {
                const s = statusConfig[step];
                const isDone = i <= currentStepIndex;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: isDone ? s.color : 'var(--bg-700)',
                        border: `2px solid ${isDone ? s.color : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isDone ? '1rem' : '0.875rem',
                        color: isDone ? '#0a0a0f' : 'var(--text-muted)',
                        fontWeight: '700', transition: 'all 0.3s'
                      }}>
                        {isDone ? s.emoji : i + 1}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: isDone ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: isDone ? '600' : '400' }}>
                        {s.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div style={{
                        flex: 1, height: '2px',
                        background: i < currentStepIndex ? s.color : 'var(--border)',
                        margin: '0 0.25rem', marginBottom: '1.5rem',
                        transition: 'background 0.3s'
                      }}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
          {/* Left: Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Order Items */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>🛍️ Items Ordered ({order.items.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--bg-700)' }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.unit}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price} each</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1rem' }}>₹{item.price * item.quantity}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>📍 Delivery Address</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{order.shippingAddress.fullName}</p>
                <p>📞 {order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>
              {order.deliverySlot && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--primary)' }}>
                  ⏰ Slot: {order.deliverySlot}
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>💰 Price Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Items ({order.items.length})</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Delivery</span>
                  <span style={{ color: order.deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                    {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--success)' }}>
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div style={{ height: '1px', background: 'var(--border)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-glass)', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  💳 {order.paymentMethod.toUpperCase()} | {order.paymentStatus}
                </div>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📅 Order Timeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.statusHistory.map((h, i) => {
                    const s = statusConfig[h.status] || statusConfig.placed;
                    return (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.emoji}</span>
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '0.875rem', color: s.color }}>{s.label}</p>
                          {h.note && <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{h.note}</p>}
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(h.timestamp).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
