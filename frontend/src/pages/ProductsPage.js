import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const badge = searchParams.get('badge') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    document.title = `${search ? `"${search}" - ` : ''}${category ? `${category} - ` : ''}Shop - FreshMart`;
  }, [search, category]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      if (badge) params.badge = badge;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, badge, page]);

  useEffect(() => {
    fetchProducts();
    categoryAPI.getAll().then(res => setCategories(res.data.categories)).catch(() => {});
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const sortOptions = [
    { value: '', label: '✨ Recommended' },
    { value: 'price_asc', label: '💰 Price: Low to High' },
    { value: 'price_desc', label: '💸 Price: High to Low' },
    { value: 'rating', label: '⭐ Top Rated' },
    { value: 'newest', label: '🆕 Newest First' },
  ];

  const badgeFilters = ['Fresh', 'Organic', 'Best Seller', 'Premium'];

  const hasActiveFilters = category || search || sort || badge;

  return (
    <div className="products-page page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <div className="breadcrumb">
              <Link to="/" id="products-breadcrumb-home">Home</Link>
              <span>›</span>
              <span>Shop</span>
              {category && <><span>›</span><span className="capitalize">{category.replace(/-/g, ' ')}</span></>}
              {search && <><span>›</span><span>"{search}"</span></>}
            </div>
            <h1 className="products-title">
              {search ? `Results for "${search}"` : category ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Products'}
            </h1>
            {!loading && <p className="products-count">{total} products found</p>}
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="products-sidebar" aria-label="Product filters">
            <div className="filter-section">
              <div className="filter-header">
                <h3>Filters</h3>
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={clearFilters} id="clear-filters-btn">Clear all</button>
                )}
              </div>

              {/* Category filter */}
              <div className="filter-group">
                <h4 className="filter-group-title">Category</h4>
                <button
                  className={`filter-item ${!category ? 'active' : ''}`}
                  onClick={() => updateParam('category', '')}
                  id="filter-all-categories"
                >
                  🛒 All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={`filter-item ${category === cat.slug ? 'active' : ''}`}
                    onClick={() => updateParam('category', cat.slug)}
                    id={`filter-cat-${cat.slug}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Badge filter */}
              <div className="filter-group">
                <h4 className="filter-group-title">Product Type</h4>
                {badgeFilters.map(b => (
                  <button
                    key={b}
                    className={`filter-item ${badge === b ? 'active' : ''}`}
                    onClick={() => updateParam('badge', badge === b ? '' : b)}
                    id={`filter-badge-${b.toLowerCase().replace(' ', '-')}`}
                  >
                    {badge === b ? '✓ ' : ''}{b}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="sort-wrapper">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  className="form-select sort-select"
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                  aria-label="Sort products"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="active-filters">
                {search && (
                  <span className="active-filter-tag">
                    🔍 {search}
                    <button onClick={() => updateParam('search', '')} aria-label="Remove search filter" id="remove-search-filter">×</button>
                  </span>
                )}
                {badge && (
                  <span className="active-filter-tag">
                    🏷️ {badge}
                    <button onClick={() => updateParam('badge', '')} aria-label="Remove badge filter" id="remove-badge-filter">×</button>
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="products-grid-page">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="product-skeleton skeleton" style={{ height: '300px' }}></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state animate-fadeInUp">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn btn-primary mt-2" onClick={clearFilters} id="reset-filters-btn">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid-page">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => updateParam('page', page - 1)}
                      disabled={page === 1}
                      aria-label="Previous page"
                      id="pagination-prev"
                    >
                      ← Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                        onClick={() => updateParam('page', i + 1)}
                        aria-label={`Page ${i + 1}`}
                        id={`pagination-page-${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      onClick={() => updateParam('page', page + 1)}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      id="pagination-next"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
