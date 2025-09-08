import React from 'react';
import Spot from './Spot';

const About = ({ scrollPosition }) => {
  const aboutSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-blue-100", parallaxFactor: 0.10 },
    { className: "bottom-20 right-20 w-20 h-20 bg-green-100", parallaxFactor: 0.06 },
    { className: "top-1/3 right-1/4 w-12 h-12 bg-purple-100", parallaxFactor: 0.14 },
    { className: "top-50 left-5 w-14 h-14 bg-yellow-100", parallaxFactor: 0.08 },
    { className: "bottom-10 left-1/2 w-18 h-18 bg-red-100", parallaxFactor: 0.12 },
    { className: "top-1/4 right-10 w-10 h-10 bg-teal-100", parallaxFactor: 0.05 },
  ];

  return (
    <section id="about-section" className="py-20 px-4 w-full bg-white relative">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-blue-500">About Us</h2>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-700">
          We are a team of passionate developers dedicated to creating innovative solutions that bridge the gap between traditional healing practices and modern technology.
        </p>
      </div>
      {aboutSpotsData.map((spot, index) => (
        <Spot
          key={index}
          className={spot.className}
          style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
        />
      ))}
    </section>
  );
};

export default About;
