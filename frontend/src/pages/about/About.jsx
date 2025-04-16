import React from 'react';
import { AcademicCapIcon, UserGroupIcon, TrophyIcon, HeartIcon } from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-primary-600" />,
      title: 'Academic Excellence',
      description: 'Fostering a culture of academic achievement and continuous learning through various educational events and workshops.'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      title: 'Community Engagement',
      description: 'Building strong connections within our university community through collaborative events and social gatherings.'
    },
    {
      icon: <TrophyIcon className="h-8 w-8 text-primary-600" />,
      title: 'Sports & Recreation',
      description: 'Promoting physical wellness and competitive spirit through diverse sporting events and tournaments.'
    },
    {
      icon: <HeartIcon className="h-8 w-8 text-primary-600" />,
      title: 'Cultural Diversity',
      description: 'Celebrating our rich cultural heritage through festivals, performances, and cultural exchange programs.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            About Our University
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students through education, innovation, and community engagement.
            We strive to create an inclusive environment where every student can thrive.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Our Mission & Vision
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mission
                </h3>
                <p className="text-gray-600">
                  To provide exceptional education and foster innovation while building a vibrant
                  community of lifelong learners who contribute meaningfully to society.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vision
                </h3>
                <p className="text-gray-600">
                  To be a leading institution that transforms lives through education,
                  research, and community engagement, preparing students to be future leaders
                  and innovators in their chosen fields.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Students', value: '10,000+' },
            { label: 'Faculty Members', value: '500+' },
            { label: 'Research Papers', value: '1,000+' },
            { label: 'Campus Acres', value: '200+' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <div className="text-2xl font-bold text-primary-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;