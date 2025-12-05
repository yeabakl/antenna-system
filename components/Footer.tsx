
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Antenna Manufacturing & Business Consultancy. All rights reserved.</p>
        <div className="mt-2 text-sm">
          <a href="#" className="hover:text-blue-400 transition-colors mx-2">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-blue-400 transition-colors mx-2">Terms of Service</a>
          <span>|</span>
          <a href="mailto:contact@antenna.com" className="hover:text-blue-400 transition-colors mx-2">contact@antenna.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
