import React from 'react';
import { FeatureConfig, FeatureKey } from '../types';
import { HomeIcon } from '../assets/icons'; // Example, ensure all icons used are imported or handled

interface SidebarProps {
  features: FeatureConfig[];
  currentFeature: FeatureKey | null;
  onSelectFeature: (featureKey: FeatureKey) => void;
  isOpen: boolean;
  toggleSidebar: () => void; // For potential close button inside sidebar on mobile
}

const Sidebar: React.FC<SidebarProps> = ({ features, currentFeature, onSelectFeature, isOpen }) => {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-neutral-lightest p-5 space-y-3 border-r border-neutral-light shadow-lg transform transition-transform duration-300 ease-in-out
                 md:sticky md:top-0 md:h-full md:overflow-y-auto md:translate-x-0 md:shadow-sm md:z-auto md:block
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-hidden={!isOpen && typeof window !== 'undefined' && window.innerWidth < 768}
    >
      {/* Optional: Add a close button for mobile inside the sidebar */}
      {/* 
      <button onClick={toggleSidebar} className="md:hidden absolute top-4 right-4 text-neutral-medium hover:text-neutral-dark">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
         </svg>
      </button> 
      */}
      <h2 className="text-xs font-semibold text-neutral-medium uppercase tracking-wider mb-4 px-2 pt-2">Tools & Info</h2>
      <nav>
        <ul>
          {features.map((feature) => (
            <li key={feature.key}>
              <button
                onClick={() => onSelectFeature(feature.key)}
                className={`w-full flex items-center text-left px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out group
                  ${
                    currentFeature === feature.key
                      ? 'bg-primary-DEFAULT text-neutral-darkest shadow-md' 
                      : 'text-neutral-darkest hover:bg-primary-light/20 hover:text-primary-dark hover:pl-4'
                  }`}
                aria-current={currentFeature === feature.key ? 'page' : undefined}
              >
                {feature.icon && (
                  <span className={`mr-3.5 shrink-0 transition-colors duration-150 ${currentFeature === feature.key ? 'text-neutral-darkest' : 'text-primary-DEFAULT group-hover:text-primary-dark'}`}>
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