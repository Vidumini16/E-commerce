import { useState, useEffect, useReducer, useCallback, useMemo, Suspense, lazy } from 'react';
const Header = lazy(() => import('./components/Header'));
const ProductForm = lazy(() => import('./components/ProductForm'));
const ProductList = lazy(() => import('./components/ProductList'));
const Filter = lazy(() => import('./components/Filter'));
const UndoSnackbar = lazy(() => import('./components/UndoSnackbar'));
import { useLocalStorage } from './hooks/useLocalStorage';
import Swal from 'sweetalert2';
import ErrorBoundary from './components/ErrorBoundary';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map(p => p.id === action.payload.id ? action.payload : p);
    case 'DELETE':
      return state.filter(p => p.id !== action.payload);
    case 'BULK_DELETE':
      return state.filter(p => !action.payload.includes(p.id));
    case 'UNDO_DELETE':
      return [...state, ...action.payload];
    default:
      return state;
  }
};

function App() {
  const [storedProducts, setStoredProducts] = useLocalStorage('products', []);
  const [products, dispatch] = useReducer(reducer, storedProducts);
  const [filters, setFilters] = useState({ search: '', category: 'All', min: 0, max: Infinity, stock: 'All' });
  const [selected, setSelected] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [showUndo, setShowUndo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Data migration/versioning for localStorage
  useEffect(() => {
    try {
      const version = localStorage.getItem('products_version');
      if (version !== '1') {
        // Example migration: clear old data or transform if needed
        localStorage.removeItem('products');
        localStorage.setItem('products_version', '1');
      }
    } catch (e) {
      setStorageError('Local storage error: ' + e.message);
    }
  }, []);

  // Instead, just set loading to false after a short delay
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  // Persist products to localStorage whenever products change
  useEffect(() => {
    setStoredProducts(products);
  }, [products, setStoredProducts]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(handler);
  }, [filters.search]);
const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesPrice = p.price >= filters.min && p.price <= filters.max;
      let matchesStock = true;
      if (filters.stock === 'In') {
        matchesStock = p.stock > 0;
      } else if (filters.stock === 'Out') {
        matchesStock = p.stock === 0;
      } else if (filters.stock === 'Low') {
        matchesStock = p.stock < 5 && p.stock >= 0;
      }
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  }, [products, debouncedSearch, filters.category, filters.min, filters.max, filters.stock]);

  // Memoized handlers (already memoized, just ensure all are)
  const handleAdd = useCallback((product) => {
    dispatch({ type: 'ADD', payload: product });
    setShowForm(false);
    Swal.fire({
      icon: 'success',
      title: 'Product added!',
      timer: 1200,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }, [dispatch]);

  const handleUpdate = useCallback((product) => {
    dispatch({ type: 'UPDATE', payload: product });
    setShowForm(false);
    setEditProduct(null);
    Swal.fire({
      icon: 'success',
      title: 'Product updated!',
      timer: 1200,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }, [dispatch]);

  // When edit is triggered, show modal with product data
  const handleEdit = useCallback((product) => {
    setEditProduct(product);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const item = products.find(p => p.id === id);
        setDeletedItems([item]);
        dispatch({ type: 'DELETE', payload: id });
        setShowUndo(true);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  }, [products, dispatch]);

  const handleBulkDelete = useCallback(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete selected products?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
      if (result.isConfirmed) {
        const items = products.filter(p => selected.includes(p.id));
        setDeletedItems(items);
        dispatch({ type: 'BULK_DELETE', payload: selected });
        setSelected([]);
        setShowUndo(true);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  }, [products, selected, dispatch]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO_DELETE', payload: deletedItems });
    setDeletedItems([]);
    setShowUndo(false);
    Swal.fire({
      icon: 'success',
      title: 'Undo successful!',
      timer: 1200,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }, [dispatch, deletedItems]);

  // Pagination (virtual scrolling alternative, simple page-based)
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <div className="container mx-auto p-4">
          {storageError && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
              {storageError}
            </div>
          )}
          {/* Loading spinner modal */}
          {loading && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(36, 39, 54, 0.18)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: '2rem 2.5rem',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px #23235b22',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div className="spinner" style={{
                  width: 48,
                  height: 48,
                  border: '6px solid #e5e7eb',
                  borderTop: '6px solid #6366f1',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: 16
                }} />
                <span style={{ color: '#6366f1', fontWeight: 600, fontSize: '1.1rem' }}>Loading...</span>
              </div>
            </div>
          )}
          <Header count={products.length} />
          <Filter filters={filters} setFilters={setFilters} />
          <button
            style={{
              marginBottom: '2rem',
              background: 'linear-gradient(90deg, #6366f1 60%, #818cf8 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              padding: '0.7rem 2rem',
              fontSize: '1.1rem',
              border: 'none',
              boxShadow: '0 2px 8px #6366f11a',
              cursor: 'pointer'
            }}
            onClick={() => { setShowForm(true); setEditProduct(null); }}
          >
            Add Product
          </button>
          {showForm && (
            <div
              style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(36, 39, 54, 0.18)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => { setShowForm(false); setEditProduct(null); }}
            >
              <div
                style={{
                  minWidth: 340,
                  maxWidth: 480,
                  width: '100%',
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px #23235b22',
                  padding: '2rem 1.5rem',
                  position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 18,
                    background: 'none',
                    border: 'none',
                    fontSize: 22,
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  aria-label="Close"
                  onClick={() => { setShowForm(false); setEditProduct(null); }}
                >
                  ×
                </button>
                <ProductForm
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  editProduct={editProduct}
                />
              </div>
            </div>
          )}
          {/* Remove old loading grid, only show product list when not loading */}
          {!loading && (
            <>
              <ProductList
                products={paginatedProducts}
                onDelete={handleDelete}
                onUpdate={handleEdit}
                selected={selected}
                setSelected={setSelected}
              />
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Prev
                  </button>
                  <span className="px-2 py-1">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
          {selected.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow"
            >
              Delete Selected
            </button>
          )}
          <UndoSnackbar show={showUndo} onUndo={handleUndo} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
