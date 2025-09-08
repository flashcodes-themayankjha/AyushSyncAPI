import React from 'react';
import Spot from './Spot';

const Resources = ({ scrollPosition }) => {
  const resourcesSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-red-100", parallaxFactor: 0.08 },
    { className: "bottom-20 right-20 w-20 h-20 bg-yellow-100", parallaxFactor: 0.12 },
    { className: "top-1/2 left-1/2 w-12 h-12 bg-green-100", parallaxFactor: 0.16 },
    { className: "top-1/4 left-1/4 w-10 h-10 bg-blue-100", parallaxFactor: 0.07 },
    { className: "bottom-1/4 right-1/4 w-18 h-18 bg-purple-100", parallaxFactor: 0.11 },
    { className: "top-10 right-10 w-14 h-14 bg-orange-100", parallaxFactor: 0.09 },
  ];

  return (
    <section id="resources-section" className="py-20 px-4 w-full bg-white relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">Our Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Resource Title 1</h3>
            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Resource Title 2</h3>
            <p className="text-gray-600">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Resource Title 3</h3>
            <p className="text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
        </div>
      </div>
      {resourcesSpotsData.map((spot, index) => (
        <Spot
          key={index}
          className={spot.className}
          style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
        />
      ))}
    </section>
  );
};

export default Resources;