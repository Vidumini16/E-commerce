import { render } from '@testing-library/react';
import ProductList from '../components/ProductList';

const products = [
  { id: 1, name: 'Book', price: 10, category: 'Books', stock: 5, description: '', image: '' },
];

test('renders ProductList with products', () => {
  const { getByText } = render(<ProductList products={products} onDelete={jest.fn()} onUpdate={jest.fn()} selected={[]} setSelected={jest.fn()} />);
  expect(getByText(/Book/i)).toBeInTheDocument();
});
