
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-DEFAULT"></div>
    </div>
  );
};

export default LoadingSpinner;
