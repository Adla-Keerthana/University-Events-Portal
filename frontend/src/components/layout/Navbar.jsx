import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, getProfile } from '../../store/slices/authSlice';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white text-primary-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <AcademicCapIcon className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-wide">UniEvents</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-semibold hover:text-primary-500 transition duration-300 border-b-2 ${
                  location.pathname === link.path ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <UserCircleIcon className="w-8 h-8" />
                  )}
                  <span className="text-sm font-semibold">{user?.name || 'User'}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/notifications" className="block px-4 py-2 hover:bg-gray-100">Notifications</Link>
                    {user?.role === 'admin' && (
                      <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold hover:bg-primary-500 hover:text-white rounded-full border border-primary-500 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-primary-600 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="mt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center border border-primary-500 text-primary-500 px-3 py-2 rounded-full text-sm font-semibold hover:bg-primary-500 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center bg-primary-500 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;