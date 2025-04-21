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
    <nav className="bg-white backdrop-blur-lg bg-white/90 border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-lg transform group-hover:scale-105 transition-all duration-300">
              <AcademicCapIcon className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
              Uni<span className="text-indigo-600">Events</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-semibold transition duration-300 border-b-2 py-5 ${
                  location.pathname === link.path 
                    ? 'text-indigo-600 border-indigo-500' 
                    : 'text-gray-700 border-transparent hover:text-violet-600 hover:border-violet-300'
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
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="relative">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-9 h-9 rounded-full border-2 border-indigo-200 group-hover:border-indigo-400 transition-all duration-300" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-300">
                        <UserCircleIcon className="w-7 h-7" />
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">{user?.name || 'User'}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl py-2 border border-indigo-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-indigo-50">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      <UserCircleIcon className="w-5 h-5 mr-3 text-indigo-500" />
                      Profile
                    </Link>
                    <Link to="/notifications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      <BellIcon className="w-5 h-5 mr-3 text-indigo-500" />
                      Notifications
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                        <CogIcon className="w-5 h-5 mr-3 text-indigo-500" />
                        Settings
                      </Link>
                    )}
                    <div className="border-t border-indigo-50 mt-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-indigo-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg border border-indigo-600 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
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
              className="focus:outline-none text-gray-700 hover:text-indigo-600 transition-colors duration-300"
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
        <div className="md:hidden bg-white border-t border-indigo-50 px-4 py-3 space-y-3 shadow-lg">
          {isAuthenticated && (
            <div className="flex items-center space-x-3 px-2 py-3 bg-indigo-50 rounded-lg mb-4">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCircleIcon className="w-8 h-8" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          )}
          
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                location.pathname === link.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="pt-2 space-y-2">
              <Link
                to="/profile"
                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircleIcon className="w-5 h-5 mr-3 text-indigo-500" />
                Profile
              </Link>
              <Link
                to="/notifications"
                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <BellIcon className="w-5 h-5 mr-3 text-indigo-500" />
                Notifications
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CogIcon className="w-5 h-5 mr-3 text-indigo-500" />
                  Settings
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-indigo-500" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 space-y-3">
              <Link
                to="/login"
                className="block w-full text-center border border-indigo-600 text-indigo-600 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
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