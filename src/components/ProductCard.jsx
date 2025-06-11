import { memo } from 'react';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onDelete, onUpdate, selected, setSelected }) => {
  const toggleSelect = () => {
    setSelected(prev => prev.includes(product.id)
      ? prev.filter(id => id !== product.id)
      : [...prev, product.id]);
  };

  // Ensure price is a number before calling toFixed
  const price = typeof product.price === 'number'
    ? product.price
    : Number(product.price) || 0;

  return (
    <div
      className="card"
      tabIndex={0}
      aria-label={`Product card for ${product.name}`}
      style={{ position: 'relative', minHeight: 340, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      <input
        type="checkbox"
        checked={selected.includes(product.id)}
        onChange={toggleSelect}
        style={{ position: 'absolute', top: 12, left: 12, accentColor: '#6366f1' }}
        aria-label={`Select product ${product.name}`}
      />
      <img
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.name}
        style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          marginBottom: 8,
          borderRadius: 10,
          border: '1px solid #e5e7eb'
        }}
        loading="lazy"
      />
      <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#4f46e5', margin: 0 }}>{product.name}</h2>
      <p aria-label="Price" style={{ fontWeight: 600, color: '#23235b', margin: 0 }}>${price.toFixed(2)}</p>
      <p aria-label="Category" style={{ fontSize: '0.98rem', color: '#64748b', margin: 0 }}>{product.category}</p>
      <p aria-label="Stock status" style={{ margin: 0 }}>
        {product.stock > 0
          ? <span style={{ color: '#10b981', fontWeight: 600 }}>In Stock</span>
          : <span style={{ color: '#e11d48', fontWeight: 600 }}>Out of Stock</span>}
      </p>
      <p style={{ fontSize: '0.97rem', color: '#334155', margin: 0 }}>{product.description.slice(0, 50)}...</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <button
          onClick={() => onUpdate(product)}
          style={{
            background: 'linear-gradient(90deg, #10b981 60%, #22d3ee 100%)',
            color: '#fff'
          }}
          aria-label={`Edit product ${product.name}`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          style={{
            background: 'linear-gradient(90deg, #e11d48 60%, #f43f5e 100%)',
            color: '#fff'
          }}
          aria-label={`Delete product ${product.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default memo(ProductCard);
