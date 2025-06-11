import ProductCard from './ProductCard';

const ProductList = ({ products, onDelete, onUpdate, selected, setSelected }) => (
  <div className="product-list-grid">
    {products.length === 0 ? <p style={{ color: '#64748b', fontWeight: 500 }}>No Products Found.</p> :
      products.map(product => (
        <ProductCard key={product.id} product={product}
          onDelete={onDelete} onUpdate={onUpdate}
          selected={selected} setSelected={setSelected} />
      ))}
  </div>
);

export default ProductList;

