
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-neutral-dark text-neutral-lightest py-4 px-6 text-center text-sm shadow-inner">
      <p>&copy; {currentYear} Health Saarthi. All rights reserved. | Developed by Shashank Sonawane</p>
    </footer>
  );
};

export default Footer;