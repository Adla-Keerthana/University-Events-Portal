import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import './Register.css';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: '1st',
    studentId: '',
    interests: [],
    acceptTerms: false
  });

  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.password || !formData.confirmPassword) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return false;
        }
        if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
          toast.error('Password must contain both letters and numbers');
          return false;
        }
        return true;
      case 3:
        if (!formData.acceptTerms) {
          toast.error('Please accept the terms and conditions');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const { confirmPassword, acceptTerms, ...userData } = formData;
      await dispatch(register(userData)).unwrap();
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="register-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="register-grid">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
              <div className="password-requirements">
                <p className="requirement-text">Password Requirements:</p>
                <ul className="requirement-list">
                  <li className={`requirement-item ${formData.password.length >= 8 ? 'requirement-met' : 'requirement-unmet'}`}>
                    {formData.password.length >= 8 ? <CheckCircleIcon className="requirement-icon" /> : <XCircleIcon className="requirement-icon" />}
                    At least 8 characters
                  </li>
                  <li className={`requirement-item ${/[A-Za-z]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}`}>
                    {/[A-Za-z]/.test(formData.password) ? <CheckCircleIcon className="requirement-icon" /> : <XCircleIcon className="requirement-icon" />}
                    Contains letters
                  </li>
                  <li className={`requirement-item ${/[0-9]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}`}>
                    {/[0-9]/.test(formData.password) ? <CheckCircleIcon className="requirement-icon" /> : <XCircleIcon className="requirement-icon" />}
                    Contains numbers
                  </li>
                </ul>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="register-grid">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                name="studentId"
                className="form-input"
                value={formData.studentId}
                onChange={handleInputChange}
              />
            </div>
            <div className="terms-checkbox">
              <input
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="acceptTerms" className="terms-text">
                I agree to the <Link to="/terms" className="terms-link">Terms and Conditions</Link> and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Create your account</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <div className="step-indicators">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`step ${stepNumber < step ? 'completed' : stepNumber === step ? 'active' : ''}`}
            >
              <div className="step-number">{stepNumber}</div>
              <div className="step-label">
                {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Password' : 'Additional Info'}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="form-actions">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="action-button secondary"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="action-button primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="action-button primary"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            )}
          </div>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 