import React from 'react';
import { FeatureConfig, FeatureKey } from '../types';
import { MenuIcon } from '../assets/icons';

interface SidebarProps {
  features: FeatureConfig[];
  currentFeature: FeatureKey | null;
  onSelectFeature: (featureKey: FeatureKey) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ features, currentFeature, onSelectFeature, isOpen, toggleSidebar }) => {
  return (
    <aside 
      id="app-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-neutral-lightest p-5 space-y-3 border-r border-neutral-light shadow-lg transform transition-transform duration-300 ease-in-out
                 md:sticky md:top-0 md:h-screen md:flex-shrink-0 md:translate-x-0 md:shadow-sm md:z-auto md:block
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-hidden={!isOpen && typeof window !== 'undefined' && window.innerWidth < 768}
    >
      <div className="flex justify-between items-center mb-4 pt-2">
        <h2 className="text-xs font-semibold text-neutral-medium uppercase tracking-wider px-2">Tools & Info</h2>
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-neutral-medium hover:text-neutral-dark focus:outline-none"
          aria-label="Close menu"
        >
           <MenuIcon className="w-6 h-6" />
        </button> 
      </div>
      <nav>
        <ul>
          {features.map((feature) => (
            <li key={feature.key}>
              <button
                onClick={() => onSelectFeature(feature.key)}
                className={`w-full flex items-center text-left px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out group
                  ${
                    currentFeature === feature.key
                      ? 'bg-white text-neutral-darkest shadow-sm' 
                      : 'text-neutral-darkest hover:bg-white hover:shadow-sm'
                  }`}
                aria-current={currentFeature === feature.key ? 'page' : undefined}
              >
                {feature.icon && (
                  <span className={`mr-3.5 shrink-0 transition-colors duration-150 ${currentFeature === feature.key ? 'text-primary-dark' : 'text-neutral-medium group-hover:text-primary-dark'}`}>
                    {React.cloneElement(feature.icon, { className: 'w-5 h-5' })}
                  </span>
                )}
                {feature.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;