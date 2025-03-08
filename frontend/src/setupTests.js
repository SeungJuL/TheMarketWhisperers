// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';

test('login and display profile link', () => {
  render(<LoginPage />);
  
  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
  
  // Simulate login button click
  fireEvent.click(screen.getByText(/login/i));
  
  // Check local storage
  expect(localStorage.getItem('token')).toBe('mockToken');
  
  // Render Navbar
  render(<Navbar />);
  
  // Check if Profile link is visible
  expect(screen.getByText(/profile/i)).toBeInTheDocument();
});
