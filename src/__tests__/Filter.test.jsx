import { render, fireEvent } from '@testing-library/react';
import Filter from '../components/Filter';

test('filter changes trigger state updates', () => {
  const setFilters = jest.fn();
  const { getByPlaceholderText } = render(<Filter filters={{}} setFilters={setFilters} />);
  fireEvent.change(getByPlaceholderText(/Search/i), { target: { value: 'phone' } });
  expect(setFilters).toHaveBeenCalled();
});
