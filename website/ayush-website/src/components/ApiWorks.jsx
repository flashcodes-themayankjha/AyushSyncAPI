import React from 'react';
import Spot from './Spot';

const ApiWorks = ({ scrollPosition }) => {
  const apiWorksSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-blue-100", parallaxFactor: 0.10 },
    { className: "bottom-20 right-20 w-20 h-20 bg-green-100", parallaxFactor: 0.06 },
    { className: "top-1/3 right-1/4 w-12 h-12 bg-purple-100", parallaxFactor: 0.14 },
    { className: "top-50 left-5 w-14 h-14 bg-yellow-100", parallaxFactor: 0.08 },
    { className: "bottom-10 left-1/2 w-18 h-18 bg-red-100", parallaxFactor: 0.12 },
    { className: "top-1/4 right-10 w-10 h-10 bg-teal-100", parallaxFactor: 0.05 },
  ];

  return (
    <section id="api-works-section" className="py-20 px-4 w-full bg-white relative">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-blue-500">How Our AyushSync API Works</h2>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-700">
          The AyushSync API provides a seamless interface for integrating traditional Ayush practices into modern digital health solutions. Here's a simplified overview of its functionality:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          <div className="bg-gray-100 p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">1. Data Integration</h3>
            <p className="text-gray-600">Our API securely integrates with various Ayush data sources, including traditional texts, research papers, and practitioner databases.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">2. Intelligent Matching</h3>
            <p className="text-gray-600">Leveraging AI and machine learning, the API intelligently matches user queries and health profiles with relevant Ayush treatments, remedies, and practitioners.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">3. Personalized Recommendations</h3>
            <p className="text-gray-600">It provides personalized recommendations for wellness plans, dietary advice, herbal remedies, and suitable Ayush therapies based on individual needs.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">4. Practitioner Network</h3>
            <p className="text-gray-600">Access a verified network of Ayush practitioners, allowing for easy booking of consultations and follow-ups.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">5. Secure & Scalable</h3>
            <p className="text-gray-600">Built with robust security measures and designed for scalability, our API can handle high volumes of requests and sensitive health data.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">6. Easy Integration</h3>
            <p className="text-gray-600">With comprehensive documentation and developer-friendly endpoints, integrating the AyushSync API into your applications is straightforward.</p>
          </div>
        </div>
      </div>
      {apiWorksSpotsData.map((spot, index) => (
        <Spot
          key={index}
          className={spot.className}
          style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
        />
      ))}
    </section>
  );
};

export default ApiWorks;