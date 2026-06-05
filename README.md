# 🥦 FreshMart - MERN Grocery Delivery Application

A full-stack grocery delivery web application built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 🚀 Features

### Frontend
- ⚡ **Beautiful Dark UI** - Glassmorphism design with teal/green accent colors
- 🏠 **Home Page** - Hero section, category grid, featured products, promotional banners
- 🛍️ **Product Listing** - Filtering by category, search, sort, badges, pagination
- 📄 **Product Detail** - Images, ratings, reviews, add to cart
- 🛒 **Shopping Cart** - Full cart management with quantity controls, order summary
- 💳 **Multi-step Checkout** - Address → Delivery Slot → Payment → Review
- 📦 **Orders** - Order listing with status tracking, order detail page
- 👤 **User Profile** - Personal info, saved addresses, security settings
- 🔑 **Authentication** - Login/Register with JWT

### Backend API
- 🔐 **Auth** - JWT-based authentication with bcrypt password hashing
- 🛒 **Products** - CRUD with filtering, search, pagination, reviews
- 🗂️ **Categories** - Category management with icons
- 🛍️ **Cart** - Per-user cart with automatic total calculation
- 📦 **Orders** - Full order lifecycle management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, React Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Vanilla CSS (Dark Mode, Glassmorphism) |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v16+ and npm
- **MongoDB** (local or Atlas cloud)

### 1. Setup Backend
```bash
cd backend
npm install
```

Configure `.env` (already created):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery_delivery
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

Start MongoDB locally, then seed the database:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Open App
Visit: **http://localhost:3000**

---

## 👥 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@grocery.com | admin123 |
| User | john@example.com | john123 |

---

## 📁 Project Structure

```
MERN/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seeder.js          # Database seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── categoryRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar/
│       │   ├── Footer/
│       │   └── ProductCard/
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── CartContext.js
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── ProductsPage.js
│       │   ├── ProductDetailPage.js
│       │   ├── CartPage.js
│       │   ├── CheckoutPage.js
│       │   ├── OrderSuccessPage.js
│       │   ├── OrdersPage.js
│       │   ├── OrderDetailPage.js
│       │   └── ProfilePage.js
│       ├── utils/
│       │   └── api.js
│       ├── App.js
│       ├── index.js
│       └── index.css
│
└── README.md
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |
| POST | /api/auth/address | Add address |
| DELETE | /api/auth/address/:id | Delete address |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all (with filters) |
| GET | /api/products/featured | Get featured |
| GET | /api/products/:id | Get one |
| POST | /api/products/:id/review | Add review |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart | Add item |
| PUT | /api/cart/:productId | Update qty |
| DELETE | /api/cart/:productId | Remove item |
| DELETE | /api/cart | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders/my | My orders |
| GET | /api/orders/:id | Order detail |
| PUT | /api/orders/:id/cancel | Cancel order |

---

## 🚀 Deployment

### Deploy to Vercel + Railway + MongoDB Atlas

1. **MongoDB**: Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Backend**: Deploy to [Railway](https://railway.app) - set MONGO_URI env var
3. **Frontend**: Deploy to [Vercel](https://vercel.com) - set REACT_APP_API_URL

### Environment Variables for Production
```
# Backend
MONGO_URI=mongodb+srv://...
JWT_SECRET=very-long-random-secret
NODE_ENV=production
PORT=5000
```

---

## 📝 License
MIT © FreshMart 2024
