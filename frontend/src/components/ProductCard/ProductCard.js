import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const badgeClass = {
  'Fresh': 'badge-fresh',
  'Organic': 'badge-organic',
  'Best Seller': 'badge-best-seller',
  'Premium': 'badge-premium',
  'Artisan': 'badge-artisan',
  'New': 'badge-organic'
};

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < full ? 'star' : (i === full && half ? 'star half' : 'star-empty')}>
          {i < full ? '★' : (i === full && half ? '★' : '☆')}
        </span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const inCart = isInCart(product._id);
  const qty = getItemQuantity(product._id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    updateQuantity(product._id, qty + 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    updateQuantity(product._id, qty - 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrapper" aria-label={`View ${product.name}`}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'; }}
        />
        {product.badge && (
          <span className={`product-badge badge ${badgeClass[product.badge] || 'badge-fresh'}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="discount-tag">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </Link>

      <div className="product-body">
        <Link to={`/products/${product._id}`} className="product-name" aria-label={product.name}>
          {product.name}
        </Link>
        <p className="product-unit">{product.unit}</p>

        <div className="product-rating">
          <Stars rating={product.rating} />
          <span className="rating-text">({product.reviewCount})</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-current">₹{product.price}</span>
            {product.originalPrice && (
              <span className="price-original">₹{product.originalPrice}</span>
            )}
          </div>

          {product.stock === 0 ? (
            <button className="btn btn-secondary btn-sm" disabled>Out of Stock</button>
          ) : inCart ? (
            <div className="qty-controls">
              <button className="qty-btn" onClick={handleDecrease} aria-label="Decrease quantity" id={`decrease-${product._id}`}>−</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={handleIncrease} aria-label="Increase quantity" id={`increase-${product._id}`}>+</button>
            </div>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              id={`add-cart-${product._id}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
