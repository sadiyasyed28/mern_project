const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = require('./db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const categories = [
  { name: 'Fruits & Vegetables', icon: '🥦', slug: 'fruits-vegetables', description: 'Fresh farm produce' },
  { name: 'Dairy & Eggs', icon: '🥛', slug: 'dairy-eggs', description: 'Fresh dairy products' },
  { name: 'Bakery', icon: '🍞', slug: 'bakery', description: 'Freshly baked goods' },
  { name: 'Meat & Seafood', icon: '🥩', slug: 'meat-seafood', description: 'Premium quality meat' },
  { name: 'Beverages', icon: '🧃', slug: 'beverages', description: 'Drinks and juices' },
  { name: 'Snacks', icon: '🍿', slug: 'snacks', description: 'Chips and snacks' },
  { name: 'Frozen Foods', icon: '🧊', slug: 'frozen-foods', description: 'Frozen meals' },
  { name: 'Pantry', icon: '🫙', slug: 'pantry', description: 'Cooking essentials' },
];

const products = [
  // Fruits & Vegetables
  { name: 'Organic Banana', description: 'Fresh organic bananas from local farms. Rich in potassium and naturally sweet.', price: 49, originalPrice: 65, unit: '1 dozen', stock: 150, category: 'fruits-vegetables', rating: 4.5, reviewCount: 128, badge: 'Organic', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400' },
  { name: 'Red Apple', description: 'Crispy and sweet red apples. Perfect for snacking or baking.', price: 120, originalPrice: 150, unit: '1 kg', stock: 80, category: 'fruits-vegetables', rating: 4.3, reviewCount: 89, badge: 'Fresh', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400' },
  { name: 'Broccoli', description: 'Tender, nutritious broccoli florets. High in vitamins and antioxidants.', price: 55, originalPrice: 70, unit: '500g', stock: 60, category: 'fruits-vegetables', rating: 4.2, reviewCount: 45, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400' },
  { name: 'Tomatoes', description: 'Juicy vine-ripened tomatoes. Great for salads, sauces, and cooking.', price: 40, originalPrice: 55, unit: '500g', stock: 200, category: 'fruits-vegetables', rating: 4.4, reviewCount: 203, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
  { name: 'Avocado', description: 'Creamy Hass avocados. Perfect for guacamole or toast.', price: 89, originalPrice: 110, unit: '2 pcs', stock: 45, category: 'fruits-vegetables', rating: 4.6, reviewCount: 167, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400' },
  { name: 'Spinach', description: 'Baby spinach leaves. Ready to eat, washed and packed.', price: 35, originalPrice: 45, unit: '200g', stock: 90, category: 'fruits-vegetables', rating: 4.1, reviewCount: 72, badge: 'Organic', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },

  // Dairy & Eggs
  { name: 'Full Cream Milk', description: 'Fresh, pasteurized full cream milk. Rich in calcium and protein.', price: 62, originalPrice: 68, unit: '1 liter', stock: 120, category: 'dairy-eggs', rating: 4.7, reviewCount: 312, badge: 'Fresh', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
  { name: 'Farm Fresh Eggs', description: 'Free-range, farm fresh eggs. High in protein and essential nutrients.', price: 90, originalPrice: 105, unit: '12 pcs', stock: 200, category: 'dairy-eggs', rating: 4.8, reviewCount: 445, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
  { name: 'Greek Yogurt', description: 'Thick and creamy Greek yogurt. Probiotic-rich and delicious.', price: 75, originalPrice: 90, unit: '400g', stock: 85, category: 'dairy-eggs', rating: 4.5, reviewCount: 198, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
  { name: 'Cheddar Cheese', description: 'Aged cheddar cheese with sharp, rich flavor. Perfect for sandwiches.', price: 145, originalPrice: 170, unit: '200g', stock: 55, category: 'dairy-eggs', rating: 4.4, reviewCount: 134, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400' },
  { name: 'Butter', description: 'Creamy unsalted butter. Perfect for baking and cooking.', price: 58, originalPrice: 65, unit: '100g', stock: 100, category: 'dairy-eggs', rating: 4.6, reviewCount: 287, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400' },

  // Bakery
  { name: 'Sourdough Bread', description: 'Artisan sourdough with crispy crust and chewy interior. Baked fresh daily.', price: 85, originalPrice: 95, unit: '400g loaf', stock: 40, category: 'bakery', rating: 4.9, reviewCount: 521, badge: 'Artisan', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400' },
  { name: 'Whole Wheat Bread', description: 'Nutritious whole wheat bread. High in fiber and perfect for daily use.', price: 45, originalPrice: 55, unit: '400g loaf', stock: 75, category: 'bakery', rating: 4.3, reviewCount: 234, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { name: 'Croissants', description: 'Buttery, flaky croissants baked fresh every morning. A French classic.', price: 35, originalPrice: 42, unit: '2 pcs', stock: 60, category: 'bakery', rating: 4.7, reviewCount: 389, badge: 'Fresh', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },

  // Meat & Seafood
  { name: 'Chicken Breast', description: 'Boneless, skinless chicken breast. Lean protein for healthy meals.', price: 220, originalPrice: 260, unit: '500g', stock: 70, category: 'meat-seafood', rating: 4.5, reviewCount: 178, badge: 'Fresh', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d11bbc?w=400' },
  { name: 'Atlantic Salmon', description: 'Premium Atlantic salmon fillets. Rich in omega-3 fatty acids.', price: 380, originalPrice: 450, unit: '400g', stock: 35, category: 'meat-seafood', rating: 4.8, reviewCount: 267, badge: 'Premium', image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400' },

  // Beverages
  { name: 'Orange Juice', description: 'Freshly squeezed orange juice. No preservatives, 100% natural.', price: 95, originalPrice: 110, unit: '1 liter', stock: 90, category: 'beverages', rating: 4.6, reviewCount: 312, badge: 'Fresh', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { name: 'Green Tea', description: 'Premium Japanese green tea. Rich in antioxidants and calming.', price: 145, originalPrice: 165, unit: '25 bags', stock: 110, category: 'beverages', rating: 4.4, reviewCount: 198, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { name: 'Sparkling Water', description: 'Refreshing sparkling mineral water. Zero calories, zero sugar.', price: 55, originalPrice: 65, unit: '1 liter', stock: 200, category: 'beverages', rating: 4.2, reviewCount: 145, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' },

  // Snacks
  { name: 'Mixed Nuts', description: 'Premium mix of almonds, cashews, walnuts and pistachios.', price: 280, originalPrice: 320, unit: '250g', stock: 65, category: 'snacks', rating: 4.7, reviewCount: 423, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1567892885630-e40f66a1e1c8?w=400' },
  { name: 'Dark Chocolate', description: '70% dark chocolate bar. Rich, intense flavor with health benefits.', price: 95, originalPrice: 115, unit: '100g', stock: 85, category: 'snacks', rating: 4.8, reviewCount: 567, badge: 'Premium', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400' },
  { name: 'Kettle Chips', description: 'Hand-cooked kettle chips with sea salt. Satisfyingly crunchy.', price: 65, originalPrice: 75, unit: '150g', stock: 120, category: 'snacks', rating: 4.3, reviewCount: 234, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400' },

  // Pantry
  { name: 'Extra Virgin Olive Oil', description: 'Cold-pressed extra virgin olive oil from Mediterranean olives.', price: 320, originalPrice: 380, unit: '500ml', stock: 55, category: 'pantry', rating: 4.9, reviewCount: 634, badge: 'Premium', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { name: 'Basmati Rice', description: 'Long-grain aromatic basmati rice. Fluffy and fragrant when cooked.', price: 135, originalPrice: 155, unit: '1 kg', stock: 150, category: 'pantry', rating: 4.6, reviewCount: 445, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400' },
  { name: 'Pasta', description: 'Premium Italian pasta made from durum wheat semolina.', price: 75, originalPrice: 88, unit: '500g', stock: 130, category: 'pantry', rating: 4.4, reviewCount: 312, image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400' },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Data cleared...');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories seeded`);

    // Map slug to id
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Create products with category references
    const productsWithCat = products.map(p => ({
      ...p,
      category: categoryMap[p.category]
    }));

    const createdProducts = await Product.insertMany(productsWithCat);
    console.log(`${createdProducts.length} products seeded`);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@grocery.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999'
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // Create demo user
    const demoUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'john123',
      phone: '8888888888',
      addresses: [{
        fullName: 'John Doe',
        phone: '8888888888',
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true
      }]
    });
    console.log(`Demo user created: ${demoUser.email}`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin: admin@grocery.com / admin123');
    console.log('Demo:  john@example.com / john123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
