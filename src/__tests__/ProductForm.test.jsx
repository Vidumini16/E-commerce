import { render, fireEvent } from '@testing-library/react';
import ProductForm from '../components/ProductForm';

test('renders form and validates inputs', () => {
  const { getByPlaceholderText, getByText } = render(<ProductForm onAdd={jest.fn()} />);
  fireEvent.change(getByPlaceholderText(/Name/i), { target: { value: 'TV' } });
  fireEvent.change(getByPlaceholderText(/Price/i), { target: { value: '-5' } });
  fireEvent.click(getByText(/Add Product/i));
  expect(getByText(/Price must be positive/i)).toBeInTheDocument();
});
