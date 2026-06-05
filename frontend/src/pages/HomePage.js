import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'FreshMart - Fresh Grocery Delivery';
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll()
        ]);
        setFeatured(featRes.data.products);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    { icon: '⚡', title: 'Express Delivery', desc: 'Get groceries delivered in as fast as 2 hours' },
    { icon: '🥬', title: 'Farm Fresh', desc: 'Sourced directly from local farms daily' },
    { icon: '🔒', title: 'Secure Payment', desc: 'Multiple safe payment options available' },
    { icon: '↩️', title: 'Easy Returns', desc: '100% satisfaction guaranteed or money back' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🚀 Free delivery on orders above ₹500</div>
            <h1 className="hero-title">
              Fresh Groceries<br />
              <span className="gradient-text">Delivered Fast</span>
            </h1>
            <p className="hero-subtitle">
              Shop premium quality fruits, vegetables, dairy & more. 
              Delivered fresh to your doorstep in just 2 hours!
            </p>

            <form className="hero-search" onSubmit={handleSearch} role="search">
              <span className="hero-search-icon">🔍</span>
              <input
                id="hero-search-input"
                type="text"
                placeholder="Search for tomatoes, milk, bread..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search grocery products"
              />
              <button type="submit" className="btn btn-primary" id="hero-search-btn">
                Search
              </button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">2hr</span>
                <span className="stat-label">Delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-container">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                alt="Fresh groceries basket"
                className="hero-main-image"
              />
              <div className="hero-float-card card-1">
                <span>🥬</span>
                <div>
                  <p>Fresh Today</p>
                  <strong>Vegetables</strong>
                </div>
              </div>
              <div className="hero-float-card card-2">
                <span>⭐</span>
                <div>
                  <strong>4.9/5</strong>
                  <p>Rating</p>
                </div>
              </div>
              <div className="hero-float-card card-3">
                <span>📦</span>
                <div>
                  <strong>Free</strong>
                  <p>Above ₹500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/products" className="btn btn-secondary btn-sm" id="view-all-categories-btn">
              View All →
            </Link>
          </div>
          <div className="categories-grid">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="category-skeleton skeleton"></div>
              ))
            ) : categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="category-card"
                id={`category-${cat.slug}`}
                aria-label={`Shop ${cat.name}`}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="banner-grid">
            <div className="banner-card banner-organic">
              <div className="banner-content">
                <span className="banner-tag">Certified Organic</span>
                <h3>Go Green, Eat Clean</h3>
                <p>Fresh organic produce from local farms</p>
                <Link to="/products?badge=Organic" className="btn btn-primary btn-sm" id="banner-organic-btn">
                  Shop Organic
                </Link>
              </div>
              <div className="banner-emoji">🌿</div>
            </div>
            <div className="banner-card banner-deals">
              <div className="banner-content">
                <span className="banner-tag">Weekend Deals</span>
                <h3>Up to 30% Off</h3>
                <p>On premium dairy & bakery items</p>
                <Link to="/products?category=dairy-eggs" className="btn btn-primary btn-sm" id="banner-deals-btn">
                  Grab Deals
                </Link>
              </div>
              <div className="banner-emoji">🎉</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">⭐ Top Rated Products</h2>
            <Link to="/products" className="btn btn-secondary btn-sm" id="view-all-products-btn">
              See All →
            </Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-skeleton skeleton"></div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>No products available</h3>
              <p>Check back soon for fresh arrivals!</p>
            </div>
          )}
        </div>
      </section>

      {/* App Download CTA */}
      <section className="app-cta-section">
        <div className="container">
          <div className="app-cta-content">
            <div className="app-cta-text">
              <h2>Get the FreshMart App</h2>
              <p>Enjoy exclusive discounts, track your orders in real-time, and schedule deliveries at your convenience.</p>
              <div className="app-cta-btns">
                <a href="#appstore" className="app-cta-btn" id="cta-appstore-btn">
                  <span>🍎</span>
                  <div>
                    <small>Download on the</small>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#playstore" className="app-cta-btn" id="cta-playstore-btn">
                  <span>🤖</span>
                  <div>
                    <small>Get it on</small>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>
            <div className="app-cta-emoji">📱</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
