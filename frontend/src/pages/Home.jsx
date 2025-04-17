import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  StarIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

// Enhanced Feature Card with hover animations and depth
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group">
    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary-100 opacity-20 group-hover:bg-primary-200 transition-all duration-500"></div>
    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
    <div className="mt-6 flex items-center text-primary-500 font-medium opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300">
      <span>Learn more</span>
      <ArrowRightIcon className="w-4 h-4 ml-2" />
    </div>
  </div>
);

// Enhanced Event Card with glass morphism effect
const EventCard = ({ title, date, location, image }) => (
  <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-sky-50 h-96 transform hover:-translate-y-2 transition-all duration-500">
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="object-cover w-full h-full group-hover:scale-110 transform transition-transform duration-700 ease-in-out"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
    
    {/* Badge */}
    <div className="absolute top-4 right-4">
      <div className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
        <StarIcon className="w-3 h-3 mr-1" />
        Featured
      </div>
    </div>
    
    <div className="absolute bottom-0 p-8 w-full">
      <div className="mb-2 flex items-center space-x-2">
        <span className="inline-block bg-primary-500/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded">
          {date.includes("Mar") ? "March" : "April"}
        </span>
        <HeartIcon className="w-5 h-5 text-white/70 hover:text-red-500 cursor-pointer" />
      </div>
      <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-primary-300 transition">
        {title}
      </h3>
      <div className="flex flex-col space-y-2 text-white/90 text-sm mb-4">
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-2" />
          {date}
        </div>
        <div className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2" />
          {location}
        </div>
      </div>
      <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg py-2 text-sm font-medium transition-all duration-300">
        View Details
      </button>
    </div>
  </div>
);

const Testimonial = ({ text, author, role }) => (
  <div className="bg-rose-50 rounded-2xl shadow-lg p-8 border border-rose-100">
    <div className="flex justify-center mb-6">
      <div className="text-primary-400">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
        </svg>
      </div>
    </div>
    <p className="text-gray-700 mb-6 text-center">{text}</p>
    <div className="text-center">
      <h4 className="font-bold text-lg">{author}</h4>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="bg-indigo-50 rounded-2xl shadow-lg p-8 text-center border border-indigo-100">
    <div className="flex justify-center mb-4">
      <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
        <Icon className="w-8 h-8" />
      </div>
    </div>
    <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">{number}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

const Home = () => {
  const features = [
    {
      icon: CalendarIcon,
      title: "Event Management",
      description: "Create and manage events seamlessly with our intuitive dashboard. Schedule, promote, and track attendance all in one place."
    },
    {
      icon: UserGroupIcon,
      title: "Community Networking",
      description: "Connect with like-minded peers, build meaningful relationships, and expand your professional network through shared interests."
    },
    {
      icon: AcademicCapIcon,
      title: "Academic Integration",
      description: "Seamlessly access and participate in workshops, seminars, and exclusive academic events tailored to your educational journey."
    }
  ];

  const upcomingEvents = [
    {
      title: "Tech Innovation Summit 2024",
      date: "Mar 25, 2024 • 10:00 AM",
      location: "Main Auditorium",
      image: "/api/placeholder/600/800"
    },
    {
      title: "Career Fair & Networking",
      date: "Mar 28, 2024 • 9:00 AM",
      location: "Student Center",
      image: "/api/placeholder/600/800"
    },
    {
      title: "Cultural Festival & Exhibition",
      date: "Apr 1, 2024 • 11:00 AM",
      location: "Campus Green",
      image: "/api/placeholder/600/800"
    }
  ];

  const testimonials = [
    {
      text: "UniEvents transformed how our student club organizes activities. We've seen a 200% increase in attendance!",
      author: "Alex Johnson",
      role: "Student Club President"
    },
    {
      text: "The platform is intuitive and beautiful. I've never had an easier time finding events that match my interests.",
      author: "Priya Sharma",
      role: "Graduate Student"
    },
    {
      text: "As a faculty member, I appreciate how easily I can create and promote academic events to the right audience.",
      author: "Dr. Michael Chen",
      role: "Associate Professor"
    }
  ];

  return (
    <div className="font-sans">
      {/* Hero Section with campus-inspired background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-primary-50 py-32">
        <div className="absolute inset-0 overflow-hidden opacity-15 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-80 h-96 w-96 rounded-full bg-primary-200 opacity-20 blur-3xl"></div>
          <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
          <div className="absolute right-60 bottom-0 h-64 w-64 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <span className="text-primary-600 font-medium text-sm">Welcome to the future of campus events</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 bg-clip-text text-transparent">
            Discover & Connect with UniEvents
          </h1>
          
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Your all-in-one platform to explore, organize, and enjoy university events that matter to you.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-primary-500/30 transition duration-300 transform hover:-translate-y-1">
              Get Started Now
            </Link>
            <Link to="/explore" className="border-2 border-primary-500 text-primary-500 bg-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition duration-300 transform hover:-translate-y-1">
              Explore Events
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img src="/api/placeholder/48/48" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="/api/placeholder/48/48" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="/api/placeholder/48/48" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              </div>
              <p className="text-gray-600 text-sm">Trusted by 10,000+ students</p>
            </div>
            <div className="flex items-center space-x-1">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <p className="text-gray-600 text-sm ml-2">5.0 (2k+ reviews)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with light peach background */}
      <section className="py-24 bg-amber-50 relative">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 px-4 py-1 rounded-full mb-4">
              <SparklesIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our award-winning platform provides all the tools needed to create and participate in university events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with light blue background */}
      <section className="py-24 bg-sky-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-fixed opacity-5"></div>
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="500+" label="Events Monthly" icon={CalendarIcon} />
            <StatCard number="50,000+" label="Active Users" icon={UserGroupIcon} />
            <StatCard number="98%" label="Satisfaction Rate" icon={StarIcon} />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section with light mint background */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-teal-50 relative">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 px-4 py-1 rounded-full mb-4">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">Don't Miss Out</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-gray-600 text-lg max-w-xl">
                Discover the most exciting campus events happening soon
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/events"
                className="group inline-flex items-center border-2 border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                View All Events
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with light pink background */}
      <section className="py-24 bg-rose-50 relative">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 px-4 py-1 rounded-full mb-4">
              <HeartIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hear from students and faculty who have transformed their campus experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with campus life background overlay */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-blue-600 text-white relative">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto text-center px-6 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Campus Experience?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of students already discovering and connecting through UniEvents
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-white/30 transition duration-300 transform hover:-translate-y-1">
              Create Your Account
            </Link>
            <Link to="/contact" className="border-2 border-white text-white bg-transparent px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition duration-300 transform hover:-translate-y-1">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;