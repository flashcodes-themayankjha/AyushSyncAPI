
import React, { useState, useEffect } from 'react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import Home from './components/Home';
import Resources from './components/Resources';
import './App.css';
import Services from './components/Services';
import About from './components/About';
import ApiWorks from './components/ApiWorks';
import FloatingChatButton from './components/FloatingChatButton';
import Chatbot from './components/Chatbot';
import SplashScreen from './components/SplashScreen'; // Correct import

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState('hero-section'); // Default active section
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true); // State for splash screen

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5, // 50% of the section must be visible
      }
    );

    // Observe all sections with an ID
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {showSplash && <SplashScreen isLoading={showSplash} />}
      {!showSplash && (
        <>
          <Navbar activeSection={activeSection} />
          <main className="p-10 flex-grow relative z-10">
            <Home scrollPosition={scrollPosition} />
            <Resources scrollPosition={scrollPosition} />
            <Services scrollPosition={scrollPosition} />
            <ApiWorks scrollPosition={scrollPosition} />
            <About scrollPosition={scrollPosition} />
          </main>
          {isChatbotOpen && <Chatbot scrollPosition={scrollPosition} onClose={() => setIsChatbotOpen(false)} />}
          <FloatingChatButton onClick={() => setIsChatbotOpen(!isChatbotOpen)} />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
