import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    year: '',
    avatar: null,
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
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === 'password') {
        checkPasswordStrength(value);
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    const result = await dispatch(register(formDataToSend));
    if (!result.error) {
      navigate('/login');
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
              />
            </div>
          </div>
        );
      case 2:
        return (
          <>
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
                />
                <div className="password-requirements">
                  <ul className="requirement-list">
                    {Object.entries(passwordStrength).map(([key, met]) => (
                      <li key={key} className={`requirement-item ${met ? 'requirement-met' : 'requirement-unmet'}`}>
                        {met ? <CheckCircleIcon /> : <XCircleIcon />}
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </li>
                    ))}
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
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="avatar-upload">
              <div className="avatar-preview">
                {formData.avatar ? (
                  <img src={URL.createObjectURL(formData.avatar)} alt="Preview" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="avatar-input"
                onChange={handleInputChange}
                accept="image/*"
              />
              <label htmlFor="avatar" className="avatar-label">
                Choose profile picture
              </label>
              {formData.avatar && (
                <div className="avatar-actions">
                  <button
                    type="button"
                    className="avatar-action-btn"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: null }))}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <div className="register-grid">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleInputChange}
                  required={formData.role === 'student' || formData.role === 'faculty'}
                />
              </div>
              {formData.role === 'student' && (
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="text"
                    name="year"
                    className="form-input"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our community today</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="step-indicators">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className={`step ${step === number ? 'active' : ''} ${step > number ? 'completed' : ''}`}
            >
              <div className="step-number">{number}</div>
              <span className="step-label">
                {number === 1 ? 'Basic Info' : number === 2 ? 'Security' : 'Profile'}
              </span>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="auth-footer">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Account...' : step < 3 ? 'Next' : 'Create Account'}
            </button>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 