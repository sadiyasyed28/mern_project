const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Helper: User response object (exclude password)
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  avatar: user.avatar,
  addresses: user.addresses,
  createdAt: user.createdAt
});

// ─────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // --- Field validation ---
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    // --- Check duplicate email ---
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // --- Create user ---
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to FreshMart.',
      token,
      user: userResponse(user)
    });
  } catch (error) {
    console.error('Register error:', error.message);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Field validation ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // --- Find user (include password for comparison) ---
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // --- Check if account is active ---
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.'
      });
    }

    // --- Compare password ---
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse(user)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────
// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
// @access  Private
// ─────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: userResponse(user) });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────
// @desc    Update user profile (name, phone)
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters'
      });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), phone: phone || '' },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: userResponse(user)
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
// ─────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save(); // triggers the pre-save bcrypt hook

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────
// @desc    Add a delivery address
// @route   POST /api/auth/address
// @access  Private
// ─────────────────────────────────────
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine1, city, state, pincode, isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All address fields are required'
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ success: false, message: 'Pincode must be 6 digits' });
    }

    const user = await User.findById(req.user._id);

    // If this is being set as default, unset others
    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    // If first address, make it default automatically
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully!',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────
// @desc    Delete a delivery address
// @route   DELETE /api/auth/address/:id
// @access  Private
// ─────────────────────────────────────
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addressExists = user.addresses.id(req.params.id);

    if (!addressExists) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.id
    );

    // If we deleted the default, make the first remaining one the default
    if (addressExists.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully!',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress
};
