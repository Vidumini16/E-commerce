import { useEffect } from 'react';

const Filter = ({ filters, setFilters }) => {
  // Update URL query params when filters change (bonus: URL state)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.min && filters.min !== 0) params.set('min', filters.min);
    if (filters.max && filters.max !== Infinity) params.set('max', filters.max);
    if (filters.stock && filters.stock !== 'All') params.set('stock', filters.stock);
    const paramString = params.toString();
    window.history.replaceState(
      {},
      '',
      paramString
        ? `${window.location.pathname}?${paramString}`
        : window.location.pathname
    );
  }, [filters]);

  return (
    <div className="card filter-row">
      <input style={{ width: 140 }} placeholder="Search" value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
      <select style={{ width: 120 }} value={filters.category}
        onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
        {['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'].map(c => <option key={c}>{c}</option>)}
      </select>
      <input type="number" style={{ width: 100 }} placeholder="Min Price"
        onChange={e => setFilters(f => ({ ...f, min: Number(e.target.value) }))} />
      <input type="number" style={{ width: 100 }} placeholder="Max Price"
        onChange={e => setFilters(f => ({ ...f, max: Number(e.target.value) }))} />
      <select style={{ width: 120 }} value={filters.stock}
        onChange={e => setFilters(f => ({ ...f, stock: e.target.value }))}>
        {['All', 'In', 'Out', 'Low'].map(s => <option key={s} value={s}>{s === 'Low' ? 'Low Stock (<5)' : s}</option>)}
      </select>
      <button
        style={{
          background: '#e5e7eb',
          color: '#23235b',
          boxShadow: 'none',
          border: '1px solid #d1d5db'
        }}
        onClick={() => setFilters({ search: '', category: 'All', min: 0, max: Infinity, stock: 'All' })}
        type="button"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filter;
