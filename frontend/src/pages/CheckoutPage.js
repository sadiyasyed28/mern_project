import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];
const DELIVERY_SLOTS = ['6:00 AM - 9:00 AM','9:00 AM - 12:00 PM','12:00 PM - 3:00 PM','3:00 PM - 6:00 PM','6:00 PM - 9:00 PM'];

const steps = ['Delivery Address', 'Delivery Slot', 'Payment', 'Review Order'];

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: ''
  });

  const [selectedSlot, setSelectedSlot] = useState(DELIVERY_SLOTS[1]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    document.title = 'Checkout - FreshMart';
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
    // Pre-fill from saved address
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setAddress({
        fullName: defaultAddr.fullName,
        phone: defaultAddr.phone,
        addressLine1: defaultAddr.addressLine1,
        addressLine2: defaultAddr.addressLine2 || '',
        city: defaultAddr.city,
        state: defaultAddr.state,
        pincode: defaultAddr.pincode
      });
    }
  }, [cart, navigate, user]);

  const deliveryCharge = cart.totalAmount >= 500 ? 0 : 40;
  const discount = cart.totalAmount >= 1000 ? Math.round(cart.totalAmount * 0.05) : 0;
  const finalTotal = cart.totalAmount + deliveryCharge - discount;

  const handleAddressChange = e => setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !validateAddress()) return;
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.create({
        shippingAddress: address,
        paymentMethod,
        deliverySlot: selectedSlot,
        notes
      });
      toast.success('🎉 Order placed successfully!');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
    { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm etc.' },
    { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'wallet', label: 'Digital Wallet', icon: '👛', desc: 'FreshMart Wallet' },
  ];

  return (
    <div className="checkout-page page-wrapper">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Stepper */}
        <div className="stepper">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`step ${i <= currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}>
                <div className="step-circle" aria-label={`Step ${i + 1}: ${step}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="step-label">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${i < currentStep ? 'done' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">

            {/* Step 0: Address */}
            {currentStep === 0 && (
              <div className="checkout-section animate-fadeInUp">
                <h2>📍 Delivery Address</h2>

                {user?.addresses?.length > 0 && (
                  <div className="saved-addresses">
                    <h4>Saved Addresses</h4>
                    <div className="saved-address-list">
                      {user.addresses.map(addr => (
                        <div
                          key={addr._id}
                          className={`saved-address ${address.pincode === addr.pincode && address.addressLine1 === addr.addressLine1 ? 'selected' : ''}`}
                          onClick={() => setAddress({
                            fullName: addr.fullName,
                            phone: addr.phone,
                            addressLine1: addr.addressLine1,
                            addressLine2: addr.addressLine2 || '',
                            city: addr.city,
                            state: addr.state,
                            pincode: addr.pincode
                          })}
                          id={`saved-address-${addr._id}`}
                        >
                          <div className="saved-addr-icon">📍</div>
                          <div>
                            <strong>{addr.fullName}</strong>
                            <p>{addr.addressLine1}, {addr.city} - {addr.pincode}</p>
                          </div>
                          {addr.isDefault && <span className="default-tag">Default</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-fullname">Full Name *</label>
                    <input id="checkout-fullname" type="text" name="fullName" className="form-input" value={address.fullName} onChange={handleAddressChange} placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-phone">Phone Number *</label>
                    <input id="checkout-phone" type="tel" name="phone" className="form-input" value={address.phone} onChange={handleAddressChange} placeholder="10-digit number" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-address1">Address Line 1 *</label>
                  <input id="checkout-address1" type="text" name="addressLine1" className="form-input" value={address.addressLine1} onChange={handleAddressChange} placeholder="House no., Building, Street" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-address2">Address Line 2</label>
                  <input id="checkout-address2" type="text" name="addressLine2" className="form-input" value={address.addressLine2} onChange={handleAddressChange} placeholder="Landmark, Area (optional)" />
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-city">City *</label>
                    <input id="checkout-city" type="text" name="city" className="form-input" value={address.city} onChange={handleAddressChange} placeholder="Mumbai" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-state">State *</label>
                    <select id="checkout-state" name="state" className="form-select" value={address.state} onChange={handleAddressChange}>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-pincode">Pincode *</label>
                    <input id="checkout-pincode" type="text" name="pincode" className="form-input" value={address.pincode} onChange={handleAddressChange} placeholder="400001" maxLength="6" required />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Delivery Slot */}
            {currentStep === 1 && (
              <div className="checkout-section animate-fadeInUp">
                <h2>⏰ Choose Delivery Slot</h2>
                <p className="section-hint">Select a time slot for delivery tomorrow</p>
                <div className="slots-grid">
                  {DELIVERY_SLOTS.map(slot => (
                    <button
                      key={slot}
                      className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                      id={`slot-${slot.replace(/[: ]/g, '-')}`}
                    >
                      <span className="slot-icon">🕐</span>
                      <span>{slot}</span>
                      {selectedSlot === slot && <span className="slot-check">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="form-group mt-2">
                  <label className="form-label" htmlFor="checkout-notes">Special Instructions (Optional)</label>
                  <textarea
                    id="checkout-notes"
                    className="form-textarea"
                    rows="3"
                    placeholder="Leave a note for the delivery person..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="checkout-section animate-fadeInUp">
                <h2>💳 Payment Method</h2>
                <div className="payment-methods">
                  {paymentMethods.map(m => (
                    <div
                      key={m.id}
                      className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(m.id)}
                      id={`payment-${m.id}`}
                    >
                      <div className="payment-radio">
                        <div className={`radio-dot ${paymentMethod === m.id ? 'checked' : ''}`}></div>
                      </div>
                      <span className="payment-icon">{m.icon}</span>
                      <div>
                        <strong>{m.label}</strong>
                        <p>{m.desc}</p>
                      </div>
                      {paymentMethod === m.id && <span className="payment-check">✓</span>}
                    </div>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-form animate-fadeInUp">
                    <div className="form-group">
                      <label className="form-label" htmlFor="card-number">Card Number</label>
                      <input id="card-number" type="text" className="form-input" placeholder="1234 5678 9012 3456" maxLength="19" />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="card-expiry">Expiry</label>
                        <input id="card-expiry" type="text" className="form-input" placeholder="MM/YY" maxLength="5" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="card-cvv">CVV</label>
                        <input id="card-cvv" type="password" className="form-input" placeholder="•••" maxLength="3" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="card-name">Cardholder Name</label>
                      <input id="card-name" type="text" className="form-input" placeholder="As on card" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="checkout-section animate-fadeInUp">
                <h2>📋 Review Your Order</h2>

                <div className="review-section">
                  <h4>📍 Delivery Address</h4>
                  <div className="review-card">
                    <p><strong>{address.fullName}</strong> | {address.phone}</p>
                    <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                </div>

                <div className="review-section">
                  <h4>⏰ Delivery Slot</h4>
                  <div className="review-card">
                    <p>🕐 {selectedSlot} (Tomorrow)</p>
                    {notes && <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Note: {notes}</p>}
                  </div>
                </div>

                <div className="review-section">
                  <h4>💳 Payment</h4>
                  <div className="review-card">
                    <p>{paymentMethods.find(m => m.id === paymentMethod)?.icon} {paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                  </div>
                </div>

                <div className="review-section">
                  <h4>🛍️ Items ({cart.items.length})</h4>
                  {cart.items.map(item => (
                    <div key={item._id} className="review-item">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }}
                      />
                      <div className="review-item-details">
                        <p>{item.product?.name}</p>
                        <small>{item.product?.unit} × {item.quantity}</small>
                      </div>
                      <span className="review-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="checkout-nav">
              {currentStep > 0 && (
                <button className="btn btn-secondary" onClick={() => setCurrentStep(prev => prev - 1)} id="checkout-back-btn">
                  ← Back
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button className="btn btn-primary" onClick={handleNextStep} id="checkout-next-btn">
                  Continue →
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  id="place-order-btn"
                >
                  {loading ? <><div className="btn-spinner"></div> Placing Order...</> : '🛒 Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="checkout-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.items.slice(0, 3).map(item => (
                  <div key={item._id} className="summary-item">
                    <span className="summary-item-name">{item.product?.name}</span>
                    <span>×{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <p className="more-items">+{cart.items.length - 3} more items</p>
                )}
              </div>
              <div className="divider"></div>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-success' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>
              <div className="divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
              <div className="checkout-trust">
                <div>🔒 Secure SSL Checkout</div>
                <div>🔄 Easy Returns</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
