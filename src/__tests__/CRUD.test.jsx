import { render, fireEvent } from '@testing-library/react';
import ProductForm from '../components/ProductForm';

test('ProductForm validates and submits data', () => {
  const onAdd = jest.fn();
  const { getByPlaceholderText, getByText } = render(<ProductForm onAdd={onAdd} />);
  fireEvent.change(getByPlaceholderText(/Name/i), { target: { value: 'Phone' } });
  fireEvent.change(getByPlaceholderText(/Price/i), { target: { value: '500' } });
  fireEvent.change(getByPlaceholderText(/Stock/i), { target: { value: '10' } });
  fireEvent.click(getByText(/Add Product/i));
  expect(onAdd).toHaveBeenCalled();
});
