import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: 'Maharashtra', pincode: '', isDefault: false });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  useEffect(() => {
    document.title = 'My Profile - FreshMart';
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authAPI.updateProfile(profile);
      updateUserData(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const res = await authAPI.addAddress(newAddress);
      setAddresses(res.data.addresses);
      setShowAddAddress(false);
      setNewAddress({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: 'Maharashtra', pincode: '', isDefault: false });
      toast.success('Address added!');
    } catch (err) {
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await authAPI.deleteAddress(addrId);
      setAddresses(res.data.addresses);
      toast.success('Address deleted');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

  const tabs = [
    { id: 'profile', label: '👤 Profile', emoji: '👤' },
    { id: 'addresses', label: '📍 Addresses', emoji: '📍' },
    { id: 'security', label: '🔒 Security', emoji: '🔒' },
  ];

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        {/* Profile Hero */}
        <div className="profile-hero card">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-hero-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            {user?.phone && <p>📞 {user.phone}</p>}
            {user?.role === 'admin' && <span className="admin-badge">⚡ Admin</span>}
          </div>
        </div>

        <div className="profile-layout">
          {/* Sidebar Tabs */}
          <nav className="profile-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                id={`profile-tab-${tab.id}`}
              >
                {tab.emoji} {tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="profile-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-section animate-fadeInUp">
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileUpdate} id="profile-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      type="text"
                      className="form-input"
                      value={profile.name}
                      onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">Email Address</label>
                    <input
                      id="profile-email"
                      type="email"
                      className="form-input"
                      value={user?.email}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                    <input
                      id="profile-phone"
                      type="tel"
                      className="form-input"
                      value={profile.phone}
                      onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="10-digit number"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} id="save-profile-btn">
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="profile-section animate-fadeInUp">
                <div className="section-header">
                  <h2>Saved Addresses</h2>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    id="add-address-toggle-btn"
                  >
                    {showAddAddress ? '× Close' : '+ Add Address'}
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="add-address-form" id="add-address-form">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="addr-fullname">Full Name *</label>
                        <input id="addr-fullname" type="text" className="form-input" value={newAddress.fullName} onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="addr-phone">Phone *</label>
                        <input id="addr-phone" type="tel" className="form-input" value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="addr-line1">Address Line 1 *</label>
                      <input id="addr-line1" type="text" className="form-input" value={newAddress.addressLine1} onChange={e => setNewAddress(p => ({ ...p, addressLine1: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="addr-line2">Address Line 2</label>
                      <input id="addr-line2" type="text" className="form-input" value={newAddress.addressLine2} onChange={e => setNewAddress(p => ({ ...p, addressLine2: e.target.value }))} />
                    </div>
                    <div className="form-grid-3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="addr-city">City *</label>
                        <input id="addr-city" type="text" className="form-input" value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="addr-state">State</label>
                        <select id="addr-state" className="form-select" value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))}>
                          {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="addr-pincode">Pincode *</label>
                        <input id="addr-pincode" type="text" className="form-input" value={newAddress.pincode} onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))} maxLength="6" required />
                      </div>
                    </div>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress(p => ({ ...p, isDefault: e.target.checked }))} id="addr-default" />
                      Set as default address
                    </label>
                    <button type="submit" className="btn btn-primary" disabled={loading} id="save-address-btn">
                      {loading ? 'Saving...' : '💾 Save Address'}
                    </button>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2.5rem' }}>
                    <div className="empty-state-icon">📍</div>
                    <h3>No addresses saved</h3>
                    <p>Add a delivery address to checkout faster</p>
                  </div>
                ) : (
                  <div className="addresses-grid">
                    {addresses.map(addr => (
                      <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`} id={`address-${addr._id}`}>
                        {addr.isDefault && <div className="default-badge">Default</div>}
                        <div className="address-icon">📍</div>
                        <p className="address-name">{addr.fullName}</p>
                        <p className="address-phone">📞 {addr.phone}</p>
                        <p className="address-text">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="address-text">{addr.addressLine2}</p>}
                        <p className="address-text">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAddress(addr._id)}
                          style={{ marginTop: '0.75rem' }}
                          id={`delete-addr-${addr._id}`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="profile-section animate-fadeInUp">
                <h2>Security Settings</h2>
                <div className="security-notice">
                  🔒 Keep your account secure by using a strong password
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    className="form-input"
                    placeholder="Your current password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="form-input"
                    placeholder="Min. 6 characters"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => toast.info('Password change coming soon!')}
                  id="change-password-btn"
                >
                  🔑 Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
