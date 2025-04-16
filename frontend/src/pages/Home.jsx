import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
    <div className="relative p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const EventCard = ({ title, date, location, image }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-200">
    <div className="aspect-w-16 aspect-h-9">
      <img
        src={image}
        alt={title}
        className="object-cover w-full h-full group-hover:scale-105 transition duration-200"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <div className="flex items-center text-white/80 text-sm space-x-4">
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: CalendarIcon,
      title: "Event Management",
      description: "Create and manage events with ease. Set dates, locations, and manage registrations all in one place."
    },
    {
      icon: UserGroupIcon,
      title: "Community",
      description: "Connect with other students, join events, and build your network within your university community."
    },
    {
      icon: AcademicCapIcon,
      title: "Academic Integration",
      description: "Stay updated with academic events, workshops, and seminars that enhance your learning experience."
    }
  ];

  const upcomingEvents = [
    {
      title: "Tech Innovation Summit",
      date: "Mar 25, 2024",
      location: "Main Auditorium",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3"
    },
    {
      title: "Career Fair 2024",
      date: "Mar 28, 2024",
      location: "Student Center",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3"
    },
    {
      title: "Cultural Festival",
      date: "Apr 1, 2024",
      location: "Campus Green",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-primary-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">
                  UniEvents
                </span>
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl">
                Discover, participate, and create amazing university events. Connect with your campus community and make the most of your university experience.
              </p>
              <div className="flex flex-wrap gap-4">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-primary-600 font-semibold hover:bg-primary-50 transition duration-200"
                    >
                      Get Started
                      <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white/20 hover:bg-white/10 transition duration-200"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-primary-600 mr-2" />
              <span className="text-primary-600 font-semibold">Features</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Everything you need to manage events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Streamline your event planning and management with our comprehensive set of features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <CalendarIcon className="w-6 h-6 text-primary-600 mr-2" />
              <span className="text-primary-600 font-semibold">Upcoming Events</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Don't miss out on these events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join exciting events happening around your campus and expand your horizons.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition duration-200"
            >
              View All Events
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;