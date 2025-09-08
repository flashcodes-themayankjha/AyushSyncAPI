
import React, { useState } from "react";
import logo from "../assets/logo.png";
import Login from "./Login"; // Import the Login component

const Navbar = ({ activeSection }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const navItems = [
    { label: "Home", href: "#hero-section" },
    { label: "Resources", href: "#resources-section" },
    { label: "Services", href: "#services-section" },
    { label: "Our API", href: "#api-works-section" },
    { label: "About Us", href: "#" },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-10 h-20 fixed top-0 left-0 bg-white/20 backdrop-blur-lg shadow-lg border-b border-white/30 z-20">
      {/* Logo */}
      <div className="flex items-center h-full">
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-auto" // logo is now larger and visible
        />
      </div>

      {/* Right Menu */}
      <div className="flex items-center gap-8 h-full">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative group h-full flex items-center"
          >
            <a
              href={item.href}
              className={`text-blue-500 text-lg font-medium px-1 transition-colors duration-200 ${
                activeSection === item.href.substring(1) ? "font-semibold" : ""
              }`}
            >
              {item.label}
            </a>
            {/* Underline Effect */}
            <span
              className={`
                absolute left-0 bottom-2 h-0.5 rounded-full bg-blue-500 transition-all duration-300
                ${
                  activeSection === item.href.substring(1)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }
              `}
            />
          </div>
        ))}
        <button
          onClick={openLogin}
          className="px-6 py-1.5 rounded-full bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 transition"
          style={{ minWidth: 100, textAlign: "center" }}
        >
          Login
        </button>
      </div>

      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </nav>
  );
};

export default Navbar;
