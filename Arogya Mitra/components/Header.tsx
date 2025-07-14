
import React from 'react';
import { APP_TITLE } from '../constants';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const tagline = "Your Trusted AI Health Companion";

  return (
    <header className="bg-gradient-to-br from-primary-light to-primary-dark text-white py-2 px-4 sm:py-3 md:py-4 md:px-6 shadow-xl sticky top-0 z-20">
      <div className="container mx-auto flex items-center space-x-3 sm:space-x-4">
        
        {/* Clickable logo on mobile to open menu */}
        <button 
          onClick={onMenuClick} 
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-white rounded-lg"
          aria-label="Open menu"
        >
           <img
            src="assets/arogya-mitra-logo.jpg" 
            alt={`${APP_TITLE} Logo`}  
            className="h-10 w-auto rounded-lg shadow-md"
          />
        </button>
        
        {/* Static logo for desktop */}
        <img
          src="assets/arogya-mitra-logo.jpg" 
          alt={`${APP_TITLE} Logo`}  
          className="h-10 sm:h-16 md:h-20 w-auto rounded-lg shadow-md hidden md:block"
        />

        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">{APP_TITLE}</h1>
          <p className="text-xs text-emerald-100/90 font-bold hidden sm:block">{tagline}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
