import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, cartLoading, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = cart.totalAmount >= 500 ? 0 : 40;
  const discount = cart.totalAmount >= 1000 ? Math.round(cart.totalAmount * 0.05) : 0;
  const finalTotal = cart.totalAmount + deliveryCharge - discount;

  if (cartLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-cart animate-fadeInUp">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg" id="cart-empty-shop-btn">
              🛍️ Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <div className="cart-header">
          <h1>🛒 Shopping Cart</h1>
          <span className="cart-count-badge">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
          <button
            className="clear-cart-btn"
            onClick={() => { if (window.confirm('Clear your entire cart?')) clearCart(); }}
            id="clear-cart-btn"
          >
            🗑️ Clear All
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map(item => {
              const product = item.product;
              if (!product) return null;
              const itemTotal = item.price * item.quantity;
              return (
                <div key={item._id || product._id} className="cart-item animate-fadeInUp">
                  <Link to={`/products/${product._id}`} className="cart-item-image-wrapper" aria-label={product.name}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="cart-item-image"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'; }}
                    />
                  </Link>

                  <div className="cart-item-details">
                    <Link to={`/products/${product._id}`} className="cart-item-name" id={`cart-item-${product._id}`}>
                      {product.name}
                    </Link>
                    <p className="cart-item-unit">{product.unit}</p>
                    <p className="cart-item-price-unit">₹{item.price} each</p>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      aria-label="Decrease"
                      id={`cart-decrease-${product._id}`}
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      aria-label="Increase"
                      id={`cart-increase-${product._id}`}
                    >+</button>
                  </div>

                  <div className="cart-item-total">
                    <span className="item-total-price">₹{itemTotal}</span>
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(product._id)}
                    aria-label={`Remove ${product.name}`}
                    id={`cart-remove-${product._id}`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <aside className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>

              {cart.totalAmount >= 500 ? (
                <div className="free-delivery-badge">
                  🎉 You get free delivery!
                </div>
              ) : (
                <div className="delivery-progress">
                  <p>Add ₹{500 - cart.totalAmount} more for free delivery</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min((cart.totalAmount / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charge</span>
                  <span className={deliveryCharge === 0 ? 'text-success' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Loyalty Discount (5%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="divider"></div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="savings-badge">
                  🎁 You're saving ₹{discount + (deliveryCharge === 0 ? 40 : 0)} on this order!
                </div>
              )}

              <button
                className="btn btn-primary btn-lg w-full"
                onClick={() => navigate('/checkout')}
                id="proceed-to-checkout-btn"
              >
                Proceed to Checkout →
              </button>

              <Link to="/products" className="btn btn-secondary w-full mt-1" id="continue-shopping-btn">
                ← Continue Shopping
              </Link>

              <div className="summary-features">
                <div className="summary-feature">🔒 100% Secure Checkout</div>
                <div className="summary-feature">↩️ Easy 24hr Returns</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
