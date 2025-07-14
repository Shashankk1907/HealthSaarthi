import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { FeatureKey, FeatureConfig as AppFeatureConfig } from './types';
import { GEMINI_API_KEY_PRESENT, APP_TITLE } from './constants';

// Import Views
import WelcomeView from './features/WelcomeView';
import HealthQAView from './features/HealthQA/HealthQAView';
import DietLifestyleView from './features/DietLifestyle/DietLifestyleView';

// Import Icons
import { 
  HomeIcon, HeartIcon, SparklesIcon
} from './assets/icons';
import DisclaimerBox from './components/DisclaimerBox';

const App: React.FC = () => {
  const sidebarFeatures: AppFeatureConfig[] = useMemo(() => [
    { key: FeatureKey.HOME, name: 'Welcome', description: 'Introduction to Health Saarthi.', roles: ['patient', 'clinician', 'both'], icon: <HomeIcon /> },
    { key: FeatureKey.HEALTH_QA, name: 'Health Assistant', description: 'Ask AI health questions.', roles: ['patient', 'clinician', 'both'], icon: <SparklesIcon /> },
    { key: FeatureKey.DIETARY_LIFESTYLE, name: 'Diet & Lifestyle', description: 'Personalized recommendations.', roles: ['patient'], icon: <HeartIcon /> },
  ], []);
  
  const MainContent: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    const getFeatureKeyFromPathname = useCallback((pathname: string): FeatureKey => {
      const key = pathname.substring(1).toUpperCase();
      if (key && Object.values(FeatureKey).includes(key as FeatureKey)) {
        return key as FeatureKey;
      }
      return FeatureKey.HEALTH_QA; // Default feature
    }, []); 
    
    const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureKey>(() => getFeatureKeyFromPathname(location.pathname));

    const toggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

    const handleSelectFeature = (featureKey: FeatureKey) => {
      navigate(`/${featureKey}`);
      if (isSidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    useEffect(() => {
        const keyFromPathname = getFeatureKeyFromPathname(location.pathname);
        setActiveFeatureKey(keyFromPathname);
        // Close sidebar on navigation if it's open (for mobile)
        if (isSidebarOpen) {
          setSidebarOpen(false);
        }
    }, [location.pathname, getFeatureKeyFromPathname]);


    const renderFeatureContent = () => {
      switch (activeFeatureKey) {
        case FeatureKey.HOME:
          return <WelcomeView />;
        case FeatureKey.HEALTH_QA:
          return <HealthQAView />;
        case FeatureKey.DIETARY_LIFESTYLE:
          return <DietLifestyleView />;
        default:
          // Navigate to a default valid feature if the path is not recognized
          return <Navigate to={`/${FeatureKey.HEALTH_QA}`} replace />;
      }
    };

    const currentFeatureForSidebar = sidebarFeatures.some(f => f.key === activeFeatureKey) ? activeFeatureKey : null;

    return (
      <div className="flex flex-col min-h-screen bg-neutral-light">
        <Header onMenuClick={toggleSidebar} />
        
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
        
        {!GEMINI_API_KEY_PRESENT && (
             <div className="container mx-auto mt-2 px-4 py-2">
                <DisclaimerBox 
                title="API Key Not Configured"
                message="The Gemini API key is not configured for Health Saarthi. AI-powered features like the Health Assistant will be disabled or may not function correctly. Please ensure the API_KEY environment variable is set by the hosting environment."
                className="bg-red-100 border-red-500 text-red-700"
                />
            </div>
        )}
        
        <div className="flex flex-1"> 
          <Sidebar
            features={sidebarFeatures}
            currentFeature={currentFeatureForSidebar}
            onSelectFeature={handleSelectFeature}
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <main 
            className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto"
            id="main-content"
          >
            {renderFeatureContent()}
          </main>
        </div>
        <Footer />
      </div>
    );
  };
  
  useEffect(() => {
    document.title = APP_TITLE;
  }, []);
  
  return (
    <HashRouter>
      <Routes>
        {/* Updated route to ensure base path defaults correctly */}
        <Route path="/:featureKeyFromRoute?" element={<MainContent />} />
        <Route path="*" element={<Navigate to={`/${FeatureKey.HEALTH_QA}`} replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
