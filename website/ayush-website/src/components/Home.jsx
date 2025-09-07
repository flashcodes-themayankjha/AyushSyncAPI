import React from 'react';
import Lottie from 'lottie-react';
import Spot from './Spot';
import HeroLottie from '../utils/lotties/hero'
// Placeholder Lottie animation data. Replace with your actual JSON data.
const defaultLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: {
    "v": "5.7.4",
    "fr": 30,
    "ip": 0,
    "op": 1,
    "w": 100,
    "h": 100,
    "nm": "Minimal Lottie",
    "ddd": 0,
    "assets": [],
    "layers": [
      {
        "ddd": 0,
        "ind": 0,
        "ty": 4,
        "nm": "Shape Layer 1",
        "sr": 1,
        "ks": {
          "o": { "a": 0, "k": 100, "ix": 11 },
          "r": { "a": 0, "k": 0, "ix": 10 },
          "p": { "a": 0, "k": [50, 50, 0], "ix": 2 },
          "a": { "a": 0, "k": [50, 50, 0], "ix": 1 },
          "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
        },
        "ao": 0,
        "shapes": [
          {
            "ty": "gr",
            "it": [
              {
                "ind": 0,
                "ty": "sh",
                "ix": 1,
                "ks": {
                  "a": 0,
                  "k": {
                    "i": [
                      [17.678, 0],
                      [0, 17.678],
                      [-17.678, 0],
                      [0, -17.678]
                    ],
                    "o": [
                      [-17.678, 0],
                      [0, -17.678],
                      [17.678, 0],
                      [0, 17.678]
                    ],
                    "v": [
                      [50, -0.001],
                      [100.001, 50],
                      [50, 100.001],
                      [-0.001, 50]
                    ]
                  },
                  "ix": 2
                },
                "nm": "Path 1",
                "mn": "ADBE Vector Shape - Group"
              },
              {
                "ty": "st",
                "c": { "a": 0, "k": [0, 0, 0, 1], "ix": 3 },
                "o": { "a": 0, "k": 100, "ix": 4 },
                "w": { "a": 0, "k": 2, "ix": 5 },
                "lc": 1,
                "lj": 1,
                "bm": 0,
                "nm": "Stroke 1",
                "mn": "ADBE Vector Stroke"
              },
              {
                "ty": "fl",
                "c": { "a": 0, "k": [0.5, 0.5, 0.5, 1], "ix": 3 },
                "o": { "a": 0, "k": 100, "ix": 4 },
                "bm": 0,
                "nm": "Fill 1",
                "mn": "ADBE Vector Fill"
              }
            ],
            "nm": "Group 1",
            "mn": "ADBE Vector Group"
          }
        ]
      }
    ]
  },
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

function Home({ scrollPosition }) {
  const heroSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-blue-100", parallaxFactor: 0.05 },
    { className: "bottom-20 right-20 w-20 h-20 bg-green-100", parallaxFactor: 0.03 },
    { className: "top-1/3 right-1/4 w-12 h-12 bg-purple-100", parallaxFactor: 0.07 },
  ];

  const featuresSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-red-100", parallaxFactor: 0.04 },
    { className: "bottom-20 right-20 w-20 h-20 bg-yellow-100", parallaxFactor: 0.06 },
    { className: "top-1/2 left-1/2 w-12 h-12 bg-green-100", parallaxFactor: 0.08 },
  ];

  const ctaSpotsData = [
    { className: "top-10 left-10 w-16 h-16 bg-blue-100", parallaxFactor: 0.05 },
    { className: "bottom-20 right-20 w-20 h-20 bg-green-100", parallaxFactor: 0.03 },
    { className: "top-1/3 right-1/4 w-12 h-12 bg-purple-100", parallaxFactor: 0.07 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-500">
              AyushSync:
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-500">
              Your Partner in Holistic Wellness
            </h2>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-700">
              Connecting you with traditional healing practices and modern well-being solutions for a balanced life.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              Explore Our Services
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <HeroLottie />
          </div>
        </div>
        {heroSpotsData.map((spot, index) => (
          <Spot
            key={index}
            className={spot.className}
            style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
          />
        ))}
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 w-full bg-white relative overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">
          Why Choose AyushSync?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-blue-500 text-5xl mb-4">🌿</div>
            <h3 className="text-2xl font-semibold mb-3">Traditional Wisdom</h3>
            <p className="text-gray-600">
              Access ancient healing knowledge from Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homoeopathy.
            </p>
            {/* Lottie Animation for Feature 1 */}
            <div className="mt-4 w-full h-32 flex items-center justify-center">
              <Lottie animationData={defaultLottieOptions.animationData} loop={defaultLottieOptions.loop} autoplay={defaultLottieOptions.autoplay} style={{ width: '80%', height: '80%' }} />
              {/* Instructions: Replace defaultLottieOptions.animationData with your actual Lottie JSON data. */}
            </div>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-green-500 text-5xl mb-4">🧘‍♀️</div>
            <h3 className="text-2xl font-semibold mb-3">Personalized Care</h3>
            <p className="text-gray-600">
              Connect with certified practitioners for tailored health plans and consultations.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <div className="text-purple-500 text-5xl mb-4">🌐</div>
            <h3 className="text-2xl font-semibold mb-3">Seamless Integration</h3>
            <p className="text-gray-600">
              Experience a user-friendly platform designed for easy navigation and access to resources.
            </p>
          </div>
        </div>
        {featuresSpotsData.map((spot, index) => (
          <Spot
            key={index}
            className={spot.className}
            style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
          />
        ))}
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-20 w-full bg-gray-50 text-gray-800 relative overflow-hidden">
        <h2 className="text-4xl font-bold mb-6 text-blue-500">
          Ready to Begin Your Wellness Journey?
        </h2>
        <p className="text-xl mb-8 leading-relaxed">
          Join AyushSync today and take the first step towards a healthier, more balanced you.
        </p>
        <button className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          Sign Up Now
        </button>
        {/* Lottie Animation for CTA Section */}
        <div className="mt-8 w-full h-48 flex items-center justify-center">
          <Lottie animationData={defaultLottieOptions.animationData} loop={defaultLottieOptions.loop} autoplay={defaultLottieOptions.autoplay} style={{ width: '60%', height: '60%' }} />
          {/* Instructions: Replace defaultLottieOptions.animationData with your actual Lottie JSON data. */}
        </div>
        {ctaSpotsData.map((spot, index) => (
          <Spot
            key={index}
            className={spot.className}
            style={{ transform: `translateY(${scrollPosition * spot.parallaxFactor}px)` }}
          />
        ))}
      </section>
    </div>
  );
}

export default Home;
