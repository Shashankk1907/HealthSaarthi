
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_TITLE } from '../constants';
import DisclaimerBox from '../components/DisclaimerBox';
import { HeartIcon, QuestionIcon } from '../assets/icons'; 
import { FeatureKey } from '../types';

const WelcomeView: React.FC = () => {
  const navigate = useNavigate();

  const goToHealthQA = () => {
    navigate(`/${FeatureKey.HEALTH_QA}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-xl space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-neutral-light">
        <HeartIcon className="w-12 h-12 sm:w-14 md:w-16 text-primary-DEFAULT mr-0 mb-3 sm:mr-5 sm:mb-0 shrink-0" />
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-darkest">Welcome to {APP_TITLE}!</h2>
          <p className="text-neutral-medium text-md sm:text-lg mt-1">Your trusted AI health companion.</p>
        </div>
      </div>
      
      <p className="text-neutral-dark text-sm sm:text-base leading-relaxed">
        Health Saarthi is designed to be your intelligent assistant for navigating health information,
        understanding medical conditions, managing medications (conceptually), and making informed decisions
        about your well-being.
      </p>
      <p className="text-neutral-dark text-sm sm:text-base leading-relaxed">
        Our primary goal is to provide you with clear, empathetic, and accessible support through our advanced AI Health Assistant.
        You can also explore tools like our Diet & Lifestyle planner.
      </p>

      <div className="text-center my-6 sm:my-8 py-5 sm:py-6">
        <button
          onClick={goToHealthQA}
          className="bg-primary-DEFAULT hover:bg-primary-dark text-neutral-darkest font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-1 transition-all duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto text-sm sm:text-base"
        >
          <QuestionIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2.5" />
          Ask Your Health Questions
        </button>
      </div>
      
      <p className="text-neutral-dark text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
        Please remember, while Health Saarthi strives
        to provide helpful information, it is not a substitute for professional medical advice,
        diagnosis, or treatment. Always consult your doctor.
      </p>
      
      <DisclaimerBox />

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-primary-light/10 rounded-lg border border-primary-light/30">
        <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-2.5 sm:mb-3">Our Core Principles:</h3>
        <ul className="list-disc list-inside text-neutral-dark space-y-1 sm:space-y-1.5 text-sm sm:text-base">
          <li><span className="font-semibold text-primary-dark">Empathetic Support:</span> Providing information with understanding and care.</li>
          <li><span className="font-semibold text-primary-dark">Clarity & Simplicity:</span> Making complex medical topics easy to grasp.</li>
          <li><span className="font-semibold text-primary-dark">Evidence-Based Information:</span> Drawing from reliable and verified knowledge.</li>
          <li><span className="font-semibold text-primary-dark">Actionable Insights:</span> Helping you understand next steps and important considerations.</li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeView;
