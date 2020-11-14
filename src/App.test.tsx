import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Global Input App/i);
  expect(linkElement).toBeInTheDocument();
});
