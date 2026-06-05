import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

const Stars = ({ rating, interactive = false, onRate }) => {
  const [hover, setHover] = useState(0);
  const full = Math.floor(rating);
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className={`star ${i <= (interactive ? (hover || Math.ceil(rating)) : full) ? '' : 'star-empty'}`}
          style={{ cursor: interactive ? 'pointer' : 'default', fontSize: interactive ? '1.5rem' : '1rem' }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i)}
        >
          {i <= (interactive ? (hover || Math.ceil(rating)) : full) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const inCart = product ? isInCart(product._id) : false;
  const qty = product ? getItemQuantity(product._id) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getOne(id);
        setProduct(res.data.product);
        document.title = `${res.data.product.name} - FreshMart`;
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to cart');
      navigate('/login');
      return;
    }
    addToCart(product._id, 1);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const success = await addToCart(product._id, 1);
    if (success) navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to write a review');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    try {
      setReviewLoading(true);
      await productAPI.addReview(product._id, reviewForm);
      toast.success('Review submitted!');
      const res = await productAPI.getOne(id);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading product...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail-page page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-2">
          <Link to="/" id="detail-home-link">Home</Link> <span>›</span>
          <Link to="/products" id="detail-shop-link">Shop</Link> <span>›</span>
          <span>{product.name}</span>
        </div>

        {/* Main Section */}
        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-section">
            <div className="detail-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="detail-image"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'; }}
              />
              {product.badge && (
                <span className={`product-badge badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <div className="detail-discount-tag">
                  <span>{discount}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">
              {product.category?.icon} {product.category?.name}
            </div>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating">
              <Stars rating={product.rating} />
              <span className="detail-rating-text">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>

            <div className="detail-price-section">
              <span className="detail-price">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="detail-original-price">₹{product.originalPrice}</span>
                  <span className="detail-discount">{discount}% off</span>
                </>
              )}
            </div>

            <div className="detail-unit-info">
              <span>📦 Unit: </span>
              <strong>{product.unit}</strong>
            </div>

            <div className="detail-stock-info">
              {product.stock > 10 ? (
                <span className="stock-available">✅ In Stock ({product.stock} units)</span>
              ) : product.stock > 0 ? (
                <span className="stock-low">⚠️ Only {product.stock} left!</span>
              ) : (
                <span className="stock-out">❌ Out of Stock</span>
              )}
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Actions */}
            <div className="detail-actions">
              {product.stock === 0 ? (
                <button className="btn btn-secondary btn-lg w-full" disabled>Out of Stock</button>
              ) : inCart ? (
                <div className="detail-qty-controls">
                  <button
                    className="qty-btn-lg"
                    onClick={() => updateQuantity(product._id, qty - 1)}
                    aria-label="Decrease quantity"
                    id="detail-decrease-qty"
                  >−</button>
                  <span className="qty-display">{qty} in cart</span>
                  <button
                    className="qty-btn-lg"
                    onClick={() => updateQuantity(product._id, qty + 1)}
                    aria-label="Increase quantity"
                    id="detail-increase-qty"
                  >+</button>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  id="detail-add-to-cart-btn"
                >
                  🛒 Add to Cart
                </button>
              )}
              <button
                className="btn btn-secondary btn-lg"
                onClick={handleBuyNow}
                id="detail-buy-now-btn"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Delivery info */}
            <div className="delivery-info">
              <div className="delivery-item">⚡ <strong>2-Hour Express</strong> available</div>
              <div className="delivery-item">🚚 <strong>Free delivery</strong> on orders above ₹500</div>
              <div className="delivery-item">↩️ <strong>Easy returns</strong> within 24 hours</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav" role="tablist">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                id={`tab-${tab}`}
              >
                {tab === 'description' ? '📄 Description' : `⭐ Reviews (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel animate-fadeIn">
                <p>{product.description}</p>
                <div className="product-info-grid">
                  <div className="info-item"><span>Category</span><strong>{product.category?.name}</strong></div>
                  <div className="info-item"><span>Unit</span><strong>{product.unit}</strong></div>
                  <div className="info-item"><span>Stock</span><strong>{product.stock} units</strong></div>
                  <div className="info-item"><span>Rating</span><strong>{product.rating.toFixed(1)}/5</strong></div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel animate-fadeIn">
                {product.reviews?.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-state-icon">💬</div>
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this product</p>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {product.reviews?.map(review => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-avatar">{review.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <strong>{review.name}</strong>
                            <div className="review-meta">
                              <Stars rating={review.rating} />
                              <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add review form */}
                {isAuthenticated && (
                  <div className="review-form-section">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleReview} id="review-form">
                      <div className="form-group">
                        <label className="form-label">Your Rating</label>
                        <Stars
                          rating={reviewForm.rating}
                          interactive
                          onRate={r => setReviewForm(prev => ({ ...prev, rating: r }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="review-comment">Your Review</label>
                        <textarea
                          id="review-comment"
                          className="form-textarea"
                          rows="4"
                          placeholder="Tell others about this product..."
                          value={reviewForm.comment}
                          onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={reviewLoading}
                        id="submit-review-btn"
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Review →'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
