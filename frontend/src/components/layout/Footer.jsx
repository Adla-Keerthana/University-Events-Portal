import React from 'react';
import { Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold font-display">UniEvents</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              University Events Portal - Connecting students with exciting events and opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-primary-300 hover:text-white transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-300 hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-300 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-primary-300">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <a href="mailto:info@universityevents.com" className="hover:text-white transition-colors duration-200">
                  info@universityevents.com
                </a>
              </li>
              <li className="flex items-center text-primary-300">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <a href="tel:(123) 456-7890" className="hover:text-white transition-colors duration-200">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-start text-primary-300">
                <MapPinIcon className="h-5 w-5 mr-2 mt-1" />
                <span>123 University Ave, City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">Stay Updated</h3>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-primary-800 border border-primary-700 rounded-md text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-800">
          <p className="text-center text-primary-400 text-sm">
            &copy; {new Date().getFullYear()} University Events Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;