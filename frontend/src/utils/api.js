import axios from 'axios';

// Use REACT_APP_API_URL env var in production, proxy in development
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// ── Attach JWT token to every request ──
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('grocery_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401 globally (token expired / invalid) ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('grocery_token');
      localStorage.removeItem('grocery_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ──────────────── Auth ────────────────
export const authAPI = {
  register:       (data) => API.post('/auth/register', data),
  login:          (data) => API.post('/auth/login', data),
  getProfile:     ()     => API.get('/auth/profile'),
  updateProfile:  (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  addAddress:     (data) => API.post('/auth/address', data),
  deleteAddress:  (id)   => API.delete(`/auth/address/${id}`)
};

// ──────────────── Products ────────────────
export const productAPI = {
  getAll:    (params) => API.get('/products', { params }),
  getFeatured: ()     => API.get('/products/featured'),
  getOne:    (id)     => API.get(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/review`, data)
};

// ──────────────── Categories ────────────────
export const categoryAPI = {
  getAll: () => API.get('/categories')
};

// ──────────────── Cart ────────────────
export const cartAPI = {
  get:    ()                    => API.get('/cart'),
  add:    (productId, quantity) => API.post('/cart', { productId, quantity }),
  update: (productId, quantity) => API.put(`/cart/${productId}`, { quantity }),
  remove: (productId)           => API.delete(`/cart/${productId}`),
  clear:  ()                    => API.delete('/cart')
};

// ──────────────── Orders ────────────────
export const orderAPI = {
  create:     (data) => API.post('/orders', data),
  getMyOrders: ()    => API.get('/orders/my'),
  getOne:     (id)   => API.get(`/orders/${id}`),
  cancel:     (id)   => API.put(`/orders/${id}/cancel`)
};

export default API;
