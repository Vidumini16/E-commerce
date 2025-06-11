import ProductList from './ProductList';

const OutOfStockList = ({ products, ...props }) => {
  const outOfStock = products.filter(p => Number(p.stock) === 0);
  return (
    <div>
      <h2 style={{ color: '#e11d48', marginBottom: '1rem' }}>Out of Stock Products</h2>
      <ProductList products={outOfStock} {...props} />
    </div>
  );
};

export default OutOfStockList;