
import React, { useState, useCallback } from 'react';
import { HeartIcon, SparklesIcon } from '../../assets/icons'; 
import DisclaimerBox from '../../components/DisclaimerBox';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChatMessageDisplay from '../../components/ChatMessageDisplay';
import { generateText, GenerateTextResult } from '../../services/geminiService';
import { WELLNESS_AI_SYSTEM_INSTRUCTION, PRIMARY_GOAL_OPTIONS, ACTIVITY_LEVEL_OPTIONS, GEMINI_API_KEY_PRESENT } from '../../constants';

interface FormData {
  gender: 'male' | 'female' | 'other' | '';
  age: string;
  weight: string;
  height: string;
  primaryGoal: string;
  activityLevel: string;
  dietaryPreferences: string;
}

interface CalculatedMetrics {
  bmi?: number;
  bmr?: number;
  tdee?: number;
}

const DietLifestyleView: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    age: '',
    weight: '',
    height: '',
    primaryGoal: PRIMARY_GOAL_OPTIONS[0]?.value || '',
    activityLevel: ACTIVITY_LEVEL_OPTIONS[0]?.value || '',
    dietaryPreferences: '',
  });
  const [calculatedMetrics, setCalculatedMetrics] = useState<CalculatedMetrics | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset results when form changes
    setAiResponse(null);
    setCalculatedMetrics(null);
    setError(null);
  };

  const calculateMetrics = (data: FormData): CalculatedMetrics => {
    const ageNum = parseInt(data.age, 10);
    const weightNum = parseFloat(data.weight);
    const heightNum = parseFloat(data.height);
    const metrics: CalculatedMetrics = {};

    if (weightNum > 0 && heightNum > 0) {
      const heightM = heightNum / 100;
      metrics.bmi = parseFloat((weightNum / (heightM * heightM)).toFixed(1));
    }

    if (ageNum > 0 && weightNum > 0 && heightNum > 0 && (data.gender === 'male' || data.gender === 'female')) {
      let bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum);
      if (data.gender === 'male') {
        bmr += 5;
      } else { // female
        bmr -= 161;
      }
      metrics.bmr = parseFloat(bmr.toFixed(0));

      const activity = ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === data.activityLevel);
      if (activity && metrics.bmr) {
        metrics.tdee = parseFloat((metrics.bmr * activity.factor).toFixed(0));
      }
    }
    return metrics;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setAiResponse(null);
    setIsLoading(true);

    const ageNum = parseInt(formData.age, 10);
    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height);

    if (!formData.gender || isNaN(ageNum) || ageNum <= 0 || isNaN(weightNum) || weightNum <= 0 || isNaN(heightNum) || heightNum <= 0 || !formData.primaryGoal || !formData.activityLevel) {
      setError("Please fill in all required fields with valid values.");
      setIsLoading(false);
      return;
    }

    const metrics = calculateMetrics(formData);
    setCalculatedMetrics(metrics);

    const selectedGoalLabel = PRIMARY_GOAL_OPTIONS.find(opt => opt.value === formData.primaryGoal)?.label || formData.primaryGoal;
    const selectedActivityLabel = ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === formData.activityLevel)?.label || formData.activityLevel;

    const promptParts = [
        `User Profile:`,
        `- Age: ${formData.age} years`,
        `- Gender: ${formData.gender}`,
        `- Height: ${formData.height} cm`,
        `- Weight: ${formData.weight} kg`,
        `- Primary Goal: ${selectedGoalLabel}`,
        `- Activity Level: ${selectedActivityLabel}`,
        `- Dietary Preferences/Restrictions: ${formData.dietaryPreferences || 'None specified'}`,
        `\nCalculated Metrics (for your reference, do NOT repeat these in your response):`,
        `- BMI: ${metrics.bmi !== undefined ? metrics.bmi : 'N/A'}`,
        `- BMR: ${metrics.bmr !== undefined ? metrics.bmr + ' kcal/day' : 'N/A'}`,
        `- TDEE: ${metrics.tdee !== undefined ? metrics.tdee + ' kcal/day' : 'N/A'}`,
        `\nPlease act as WellnessAI and provide a personalized wellness plan based on the above information, following all persona guidelines.`
      ];

    try {
      const result: GenerateTextResult = await generateText({
        prompt: promptParts.join('\n'),
        systemInstruction: WELLNESS_AI_SYSTEM_INSTRUCTION,
      });
      setAiResponse(result.text);
    } catch (err) {
      console.error("Error generating wellness plan:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred while generating your plan.");
      setAiResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  if (!GEMINI_API_KEY_PRESENT) {
    return (
      <div className="p-3 sm:p-4">
        <DisclaimerBox 
          title="API Key Not Configured"
          message="The Gemini API key is not configured for Health Saarthi. The Diet & Lifestyle Planner (WellnessAI) requires a valid API key to function. Please ensure the API_KEY environment variable is set by the hosting environment."
          className="bg-red-50 border-red-400 text-red-700"
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl space-y-5 sm:space-y-6">
      <header className="pb-4 border-b border-neutral-light">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary-dark flex items-center">
          <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 mr-2.5 sm:mr-3 text-primary-DEFAULT" />
          WellnessAI Advisor
        </h2>
        <p className="text-neutral-medium mt-1 text-sm sm:text-base">Get your personalized diet, fitness, and lifestyle plan.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-neutral-darkest mb-1">Gender <span className="text-red-500">*</span></label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT">
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>
          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-neutral-darkest mb-1">Age (Years) <span className="text-red-500">*</span></label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 30" required min="1" className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT placeholder-neutral-medium"/>
          </div>
          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-neutral-darkest mb-1">Weight (kg) <span className="text-red-500">*</span></label>
            <input type="number" id="weight" name="weight" step="0.1" value={formData.weight} onChange={handleChange} placeholder="e.g., 70.5" required min="1" className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT placeholder-neutral-medium"/>
          </div>
          {/* Height */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-neutral-darkest mb-1">Height (cm) <span className="text-red-500">*</span></label>
            <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} placeholder="e.g., 175" required min="1" className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT placeholder-neutral-medium"/>
          </div>
           {/* Primary Goal */}
           <div className="md:col-span-2">
            <label htmlFor="primaryGoal" className="block text-sm font-medium text-neutral-darkest mb-1">Primary Goal <span className="text-red-500">*</span></label>
            <select id="primaryGoal" name="primaryGoal" value={formData.primaryGoal} onChange={handleChange} required className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT">
              {PRIMARY_GOAL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          {/* Activity Level */}
          <div className="md:col-span-2">
            <label htmlFor="activityLevel" className="block text-sm font-medium text-neutral-darkest mb-1">Activity Level <span className="text-red-500">*</span></label>
            <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} required className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT">
              {ACTIVITY_LEVEL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          {/* Dietary Preferences */}
          <div className="md:col-span-2">
            <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-neutral-darkest mb-1">Dietary Preferences/Restrictions</label>
            <textarea id="dietaryPreferences" name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleChange} placeholder="e.g., vegetarian, gluten-free, allergies, foods I dislike" rows={3} className="w-full p-3 sm:p-3.5 bg-white text-neutral-darkest border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT placeholder-neutral-medium"></textarea>
          </div>
        </div>
        <div className="pt-1 sm:pt-2">
          <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary-DEFAULT hover:bg-primary-dark text-neutral-darkest font-semibold py-2.5 px-8 sm:py-3 sm:px-10 rounded-lg shadow-md hover:shadow-lg disabled:opacity-60">
            {isLoading ? 'Generating Plan...' : 'Get My Wellness Plan'}
          </button>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && (
        <div className="mt-6 sm:mt-8 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {calculatedMetrics && !isLoading && !error && (
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-neutral-light">
          <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-3 sm:mb-4">Your Personal Snapshot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-4 bg-neutral-lightest rounded-lg border border-neutral-light">
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-neutral-medium">BMI</p>
              <p className="text-lg font-semibold text-primary-dark">{calculatedMetrics.bmi?.toFixed(1) || 'N/A'}</p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-neutral-medium">Est. BMR (kcal/day)</p>
              <p className="text-lg font-semibold text-primary-dark">{calculatedMetrics.bmr?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-neutral-medium">Est. TDEE (kcal/day)</p>
              <p className="text-lg font-semibold text-primary-dark">{calculatedMetrics.tdee?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>
           { (calculatedMetrics.bmr === undefined || calculatedMetrics.tdee === undefined) && formData.gender === 'other' &&
            <p className="text-xs text-neutral-medium mt-2 italic">BMR and TDEE calculations are most accurate for male/female biological sex. For 'Other', these are not calculated by default.</p>
           }
        </div>
      )}

      {aiResponse && !isLoading && !error && (
        <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-neutral-light">
           <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-3 sm:mb-4 flex items-center">
             <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-accent-DEFAULT" />
             WellnessAI Recommendations
           </h3>
          <div className="p-3 sm:p-4 bg-primary-light/5 rounded-lg border border-primary-light/20">
            <ChatMessageDisplay text={aiResponse} />
          </div>
        </div>
      )}
      
      <DisclaimerBox className="mt-6 sm:mt-8" message="I am an AI assistant and not a medical professional. This information is for educational purposes only. Please consult with a doctor or registered dietitian before making any significant changes to your diet or exercise routine." />
    </div>
  );
};

export default DietLifestyleView;
