import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Validate password
      if (!formData.password) {
        toast.error('Please enter your password');
        setIsSubmitting(false);
        return;
      }

      const result = await dispatch(login(formData)).unwrap();
      
      // Store the token in localStorage
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      // Store user data in localStorage
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      toast.success('Login successful!');
      navigate('/events'); // Redirect to events page
    } catch (error) {
      // Handle specific error messages
      if (error.message?.includes('Invalid credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message?.includes('User not found')) {
        toast.error('No account found with this email');
      } else if (error.message?.includes('Email not verified')) {
        toast.error('Please verify your email before logging in');
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Sign in to your account</h2>
          <p className="auth-subtitle">
            Or{' '}
            <Link to="/register" className="auth-link">
              create a new account
            </Link>
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <div className="input-group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input input-with-icon"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="form-input input-with-icon"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox-input"
                disabled={isSubmitting}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? (
              <div className="loading-spinner" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 