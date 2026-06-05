const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public
router.post('/register', register);
router.post('/login',    login);

// Protected
router.get('/profile',              protect, getProfile);
router.put('/profile',              protect, updateProfile);
router.put('/change-password',      protect, changePassword);
router.post('/address',             protect, addAddress);
router.delete('/address/:id',       protect, deleteAddress);

module.exports = router;
