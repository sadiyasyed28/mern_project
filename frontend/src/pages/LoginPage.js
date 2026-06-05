import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

/* ─── Inline SVG icons ─── */
const EyeOn  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const Spinner = () => <div className="btn-spinner"/>;

const LoginPage = () => {
  const [form, setForm]           = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [showPwd, setShowPwd]     = useState(false);
  const [serverError, setServerError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.title = 'Login – FreshThingsOnly';
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  /* ── Field-level validation ── */
  const validate = () => {
    const errs = {};
    if (!form.email.trim())   errs.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              errs.email    = 'Enter a valid email address';
    if (!form.password)       errs.password = 'Password is required';
    else if (form.password.length < 6)
                              errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError)  setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo  = () => { setForm({ email: 'john@example.com',    password: 'john123'  }); setErrors({}); setServerError(''); };
  const fillAdmin = () => { setForm({ email: 'admin@grocery.com',   password: 'admin123' }); setErrors({}); setServerError(''); };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo-link" id="auth-logo-link">
            <span>🥬</span>
            <span>FreshThingsOnly</span>
          </Link>
          <h1>Everything<br />Fresh.<br /><span>Delivered.</span></h1>
          <p>Sign in to order fresh produce, dairy, and bakery items straight to your door.</p>
          <div className="auth-perks">
            <div className="perk-item"><span className="perk-icon">⚡</span><div><strong>Express 60-min</strong><small>Delivery available</small></div></div>
            <div className="perk-item"><span className="perk-icon">🛡️</span><div><strong>100% Secure</strong><small>Payments encrypted</small></div></div>
            <div className="perk-item"><span className="perk-icon">🔄</span><div><strong>Easy Returns</strong><small>Within 24 hours</small></div></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-head">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          {/* Server Error Banner */}
          {serverError && (
            <div className="server-error-banner" role="alert">
              <span>⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="login-form">
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                <span className="input-prefix"><MailIcon /></span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && <p className="form-error" id="email-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="label-row">
                <label className="form-label" htmlFor="login-password">Password</label>
                <a href="#forgot" className="forgot-link" id="forgot-password-link">Forgot password?</a>
              </div>
              <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
                <span className="input-prefix"><LockIcon /></span>
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="input-suffix"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  id="toggle-password-btn"
                >
                  {showPwd ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {errors.password && <p className="form-error" id="password-error">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? <><Spinner /> Signing in…</> : 'Sign In →'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="demo-section">
            <p className="demo-heading">Try with demo accounts</p>
            <div className="demo-row">
              <button className="demo-btn" onClick={fillDemo}  id="demo-user-btn">👤 User</button>
              <button className="demo-btn" onClick={fillAdmin} id="demo-admin-btn">⚡ Admin</button>
            </div>
          </div>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" id="goto-register-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
