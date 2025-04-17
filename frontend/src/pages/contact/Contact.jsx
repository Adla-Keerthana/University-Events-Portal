import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 765-4321'],
    },
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: 'Email',
      details: ['info@university.edu', 'admissions@university.edu'],
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: 'Address',
      details: ['123 University Avenue', 'City, State 12345'],
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: 'Office Hours',
      details: ['Monday - Friday: 9:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 1:00 PM'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with decorative elements */}
        <div className="relative text-center mb-20">
          {/* Decorative elements */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-primary-500 rounded-full opacity-70"></div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Section with improved card design */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Contact Information with hover effects */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 p-3 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-all duration-300">
                      <div className="text-primary-600">
                        {info.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {info.title}
                      </h3>
                      <div className="mt-2 text-base text-gray-600">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="leading-relaxed">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Social Media Links */}
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form with improved interactions */}
            <div className="lg:col-span-2 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="name" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
                      Your Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="email" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
                      Your Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="subject" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
                    Subject
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="message" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
                    Message
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="message"
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Write your message here..."
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section with improved card design */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <MapPinIcon className="h-6 w-6 mr-2 text-primary-600" />
              Find Us
            </h2>
            <p className="text-gray-600 mt-1">Visit our campus at 123 University Avenue, City, State 12345</p>
          </div>
          
          <div className="relative aspect-video md:aspect-[21/9] rounded-b-lg overflow-hidden">
            <iframe
              title="University Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00425878459418!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1644266936927!5m2!1sen!2sus"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-primary-600">What are the admission requirements?</h3>
              <p className="mt-2 text-gray-600">Our admission requirements vary by program. Please visit our admissions page or contact our admissions office for specific program requirements.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-primary-600">How can I apply for financial aid?</h3>
              <p className="mt-2 text-gray-600">To apply for financial aid, complete the FAFSA form and submit it by our priority deadline. Our financial aid office can provide additional assistance.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-primary-600">Do you offer campus tours?</h3>
              <p className="mt-2 text-gray-600">Yes, we offer guided campus tours Monday through Friday at 10:00 AM and 2:00 PM, and on select Saturdays. Please schedule your tour through our website.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;