import React from 'react';
import Spot from './Spot';

const Services = ({ scrollPosition }) => {
  const servicesSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-blue-100", parallaxFactor: 0.10 },
    { className: "bottom-20 right-20 w-20 h-20 bg-green-100", parallaxFactor: 0.06 },
    { className: "top-1/3 right-1/4 w-12 h-12 bg-purple-100", parallaxFactor: 0.14 },
    { className: "top-1/2 left-10 w-14 h-14 bg-pink-100", parallaxFactor: 0.09 },
    { className: "bottom-10 right-1/3 w-18 h-18 bg-cyan-100", parallaxFactor: 0.07 },
    { className: "top-10 right-1/2 w-10 h-10 bg-lime-100", parallaxFactor: 0.12 },
  ];

  return (
    <section id="services-section" className="py-20 px-4 w-full bg-gray-50 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-blue-500 text-5xl mb-4">🌿</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Personalized Consultations</h3>
            <p className="text-gray-600">Connect with certified Ayush practitioners for tailored health advice and treatment plans.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-green-500 text-5xl mb-4">🧘‍♀️</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Wellness Programs</h3>
            <p className="text-gray-600">Explore curated programs in Yoga, Meditation, Naturopathy, and more for holistic well-being.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-purple-500 text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Educational Resources</h3>
            <p className="text-gray-600">Access a rich library of articles, videos, and guides on traditional healing practices.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-orange-500 text-5xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Ayush Product Marketplace</h3>
            <p className="text-gray-600">Discover authentic Ayush products, herbs, and supplements from trusted providers.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-red-500 text-5xl mb-4">🗓️</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Event & Workshop Listings</h3>
            <p className="text-gray-600">Find and register for upcoming wellness events, workshops, and retreats.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-teal-500 text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Community Support</h3>
            <p className="text-gray-600">Join a vibrant community of wellness enthusiasts and share your journey.</p>
          </div>
        </div>
      </div>
      {servicesSpotsData.map((spot, index) => (
        <Spot
          key={index}
          className={spot.className}
          style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
        />
      ))}
    </section>
  );
};

export default Services;