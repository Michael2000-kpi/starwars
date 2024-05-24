import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header with correct text', () => {
  render(<App />);
  const headerElement = screen.getByText(/Star Wars:by Mykhailo Hamar/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders pagination component', () => {
  render(<App />);
  const paginationElement = screen.getByRole('navigation', { name: /pagination/i });
  expect(paginationElement).toBeInTheDocument();
});

test('renders filter component', () => {
  render(<App />);
  const filterElement = screen.getByRole('combobox', { name: /filter/i });
  expect(filterElement).toBeInTheDocument();
});

test('renders person cards', async () => {
  render(<App />);
  const personNameElement = await screen.findByText(/Name:/i);
  expect(personNameElement).toBeInTheDocument();
});

test('clicking on a person card displays detailed information', async () => {
  render(<App />);
  const personNameElement = await screen.findByText(/Name:/i);
  fireEvent.click(personNameElement);
  const detailElement = screen.getByText(/Details for/i);
  expect(detailElement).toBeInTheDocument();
});
