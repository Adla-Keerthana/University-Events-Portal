import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
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
    role: 'student', // Default role
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
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.role) {
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
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
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
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      console.log('Sending registration data:', userData);
      
      const result = await dispatch(register(userData)).unwrap();
      console.log('Registration response:', result);

      if (result.token) {
        toast.success('Registration successful!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="student">Student</option>
                <option value="committee_member">Committee Member</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                <ul className="mt-1 space-y-1">
                  <li className={`flex items-center text-sm ${passwordStrength.length ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordStrength.length ? 
                      <CheckCircleIcon className="w-4 h-4 mr-2" /> : 
                      <XCircleIcon className="w-4 h-4 mr-2" />}
                    At least 6 characters
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter your department"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                name="studentId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Enter your student ID"
              />
            </div>
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">Create Account</h2>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }} 
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className="flex flex-col items-center"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                stepNumber < step ? 'bg-blue-600 border-blue-600 text-white' : 
                stepNumber === step ? 'border-blue-600 text-blue-600' : 
                'border-gray-300 text-gray-300'
              }`}>
                {stepNumber}
              </div>
              <div className={`mt-2 text-xs ${
                stepNumber <= step ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Password' : 'Additional Info'}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handlePrevious}
                disabled={loading}
              >
                Previous
              </button>
            )}
            
            {step > 1 && step < 3 && <div />}
            
            {step < 3 ? (
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            )}
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;