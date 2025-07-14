
import React from 'react';
import { GENERAL_DISCLAIMER } from '../constants';

interface DisclaimerBoxProps {
  message?: string;
  className?: string;
  title?: string;
}

const DisclaimerBox: React.FC<DisclaimerBoxProps> = ({ message, className, title }) => {
  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-md shadow-sm my-4 ${className ?? ''}`} role="alert">
      <p className="font-bold text-yellow-800">{title || 'Important Disclaimer'}</p>
      <p className="text-sm">{message || GENERAL_DISCLAIMER}</p>
    </div>
  );
};

export default DisclaimerBox;
