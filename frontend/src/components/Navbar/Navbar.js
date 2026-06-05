import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

// SVG Icon components
const SearchIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CartIcon    = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
const OrdersIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogoutIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const LocationIcon= () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const SunIcon     = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon    = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const loc = useLocation();

  const [menuOpen, setMenuOpen]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled]       = useState(false);
  const [location, setLocation]       = useState(null);
  const [locLoading, setLocLoading]   = useState(false);
  const userMenuRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close menus on route change
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [loc]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Geolocation handler
  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            'Your Location';
          setLocation(city);
        } catch {
          setLocation('Location found');
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setLocLoading(false);
        alert('Unable to get location. Please allow location access.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* ── Location bar ── */}
        <div className="navbar-topbar">
          <div className="topbar-container">
            <button
              className="location-btn"
              onClick={handleLocation}
              id="location-btn"
              title="Enable location"
            >
              <LocationIcon />
              {locLoading
                ? 'Detecting...'
                : location
                ? <><span className="loc-label">Delivering to</span> <strong>{location}</strong></>
                : 'Enable Location'}
            </button>
            <span className="topbar-tagline">🚀 Free delivery on orders ₹500+</span>
          </div>
        </div>

        {/* ── Main Navbar ── */}
        <div className="navbar-main">
          <div className="navbar-container">

            {/* Logo */}
            <Link to="/" className="navbar-logo" id="navbar-logo" aria-label="FreshThingsOnly Home">
              <span className="logo-icon">🥬</span>
              <span className="logo-text">
                Fresh<span className="logo-accent">Things</span><span className="logo-only">Only</span>
              </span>
            </Link>

            {/* Search */}
            <form className="navbar-search" onSubmit={handleSearch} role="search">
              <input
                id="navbar-search-input"
                type="text"
                placeholder="Search fresh groceries..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" aria-label="Search" id="navbar-search-btn">
                <SearchIcon />
              </button>
            </form>

            {/* Desktop Actions */}
            <div className="navbar-actions">

              {/* Theme toggle */}
              <button
                className="icon-btn theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                id="theme-toggle-btn"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              <Link to="/products" className="nav-link" id="nav-shop-link">Shop</Link>

              {isAuthenticated ? (
                <>
                  {/* Cart */}
                  <Link to="/cart" className="nav-cart-btn" id="nav-cart-btn" aria-label={`Cart (${cartCount} items)`}>
                    <CartIcon />
                    {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
                  </Link>

                  {/* User Menu */}
                  <div className="user-menu-wrapper" ref={userMenuRef}>
                    <button
                      className="user-avatar-btn"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-expanded={userMenuOpen}
                      id="user-menu-btn"
                    >
                      <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                      <span className="user-name-short">{user?.name?.split(' ')[0]}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`chevron ${userMenuOpen ? 'open' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                    </button>

                    {userMenuOpen && (
                      <div className="user-dropdown" id="user-dropdown-menu">
                        <div className="dropdown-header">
                          <span className="dropdown-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                          <div>
                            <p className="dropdown-name">{user?.name}</p>
                            <p className="dropdown-email">{user?.email}</p>
                          </div>
                        </div>
                        <div className="dropdown-divider" />
                        <Link to="/orders"  className="dropdown-item" id="dropdown-orders-link"><OrdersIcon /> My Orders</Link>
                        <Link to="/profile" className="dropdown-item" id="dropdown-profile-link"><ProfileIcon /> Profile</Link>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item logout" onClick={handleLogout} id="logout-btn"><LogoutIcon /> Logout</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login"    className="btn btn-secondary btn-sm" id="nav-login-btn">Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm"   id="nav-register-btn">Sign Up</Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-btn"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="mobile-menu" id="mobile-menu">
            <form className="mobile-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit">Go</button>
            </form>

            <button className="mobile-nav-link location-mobile" onClick={handleLocation}>
              <LocationIcon /> {locLoading ? 'Detecting...' : location ? location : 'Enable Location'}
            </button>

            <Link to="/products" className="mobile-nav-link">🛒 Shop All</Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart"    className="mobile-nav-link">🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
                <Link to="/orders"  className="mobile-nav-link">📦 My Orders</Link>
                <Link to="/profile" className="mobile-nav-link">👤 Profile</Link>
                <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="mobile-nav-link">🔑 Login</Link>
                <Link to="/register" className="mobile-nav-link">✨ Sign Up</Link>
              </>
            )}

            <div className="mobile-theme-row">
              <span>Theme</span>
              <button className="theme-toggle mobile-theme-btn" onClick={toggleTheme}>
                {isDark ? <><SunIcon /> Light</> : <><MoonIcon /> Dark</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
