import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const EyeOn  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon= () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const Spinner = () => <div className="btn-spinner"/>;

const RegisterPage = () => {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account – FreshThingsOnly';
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  /* ── Password strength ── */
  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6)  score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    return score; // 0–3
  };
  const strength = getStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#16a34a'];

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
                              errs.name     = 'Name must be at least 2 characters';
    if (!form.email.trim())   errs.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              errs.email    = 'Enter a valid email address';
    if (form.phone && !/^\d{10}$/.test(form.phone))
                              errs.phone    = 'Phone must be exactly 10 digits';
    if (!form.password)       errs.password = 'Password is required';
    else if (form.password.length < 6)
                              errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword)        errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
                                      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError)  setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.phone);
      toast.success('Account created! Welcome to FreshThingsOnly 🎉');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo-link" id="auth-logo-link">
            <span>🥬</span>
            <span>FreshThingsOnly</span>
          </Link>
          <h1>Join the<br /><span>Fresh</span><br />Revolution.</h1>
          <p>Create your account and enjoy same-day delivery of fresh, local groceries.</p>
          <div className="auth-perks">
            <div className="perk-item"><span className="perk-icon">🎁</span><div><strong>₹50 off</strong><small>First order discount</small></div></div>
            <div className="perk-item"><span className="perk-icon">📍</span><div><strong>Hyper-local</strong><small>From nearby stores</small></div></div>
            <div className="perk-item"><span className="perk-icon">🌱</span><div><strong>Organic options</strong><small>Always available</small></div></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-head">
            <h2>Create account</h2>
            <p>Free forever. No credit card required.</p>
          </div>

          {serverError && (
            <div className="server-error-banner" role="alert">
              <span>⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="register-form">
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name *</label>
              <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
                <span className="input-prefix"><UserIcon /></span>
                <input id="register-name" type="text" name="name" className="form-input"
                  placeholder="John Doe" value={form.name} onChange={handleChange}
                  autoComplete="name" aria-describedby={errors.name ? 'name-error' : undefined} />
              </div>
              {errors.name && <p className="form-error" id="name-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email Address *</label>
              <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                <span className="input-prefix"><MailIcon /></span>
                <input id="register-email" type="email" name="email" className="form-input"
                  placeholder="you@example.com" value={form.email} onChange={handleChange}
                  autoComplete="email" aria-describedby={errors.email ? 'email-error' : undefined} />
              </div>
              {errors.email && <p className="form-error" id="email-error">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-phone">Phone <span className="optional">(optional)</span></label>
              <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
                <span className="input-prefix"><PhoneIcon /></span>
                <input id="register-phone" type="tel" name="phone" className="form-input"
                  placeholder="10-digit mobile number" value={form.phone} onChange={handleChange}
                  autoComplete="tel" maxLength="10" />
              </div>
              {errors.phone && <p className="form-error" id="phone-error">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password *</label>
              <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
                <span className="input-prefix"><LockIcon /></span>
                <input id="register-password" type={showPwd ? 'text' : 'password'} name="password" className="form-input"
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                  autoComplete="new-password" />
                <button type="button" className="input-suffix" onClick={() => setShowPwd(v => !v)}
                  aria-label="Toggle password" id="register-toggle-password">
                  {showPwd ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
              {/* Strength bar */}
              {form.password && (
                <div className="strength-wrap">
                  <div className="strength-bars">
                    {[1,2,3].map(l => (
                      <div key={l} className="strength-bar"
                        style={{ background: strength >= l ? strengthColors[strength] : 'var(--border)' }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm-password">Confirm Password *</label>
              <div className={`input-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <span className="input-prefix"><LockIcon /></span>
                <input id="register-confirm-password" type="password" name="confirmPassword" className="form-input"
                  placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange}
                  autoComplete="new-password" />
              </div>
              {errors.confirmPassword && <p className="form-error" id="confirm-password-error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full submit-btn"
              disabled={loading} id="register-submit-btn">
              {loading ? <><Spinner /> Creating account…</> : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" id="goto-login-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
