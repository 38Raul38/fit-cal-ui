import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { OnboardingData } from '@/types';

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData> & {
    activityLevelText?: string;
    genderText?: string;
  };
  updateOnboardingData: (data: Partial<OnboardingData> & {
    activityLevelText?: string;
    genderText?: string;
  }) => void;
  clearOnboardingData: () => void;
  getCompleteData: () => OnboardingData | null;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData> & {
    activityLevelText?: string;
    genderText?: string;
  }>({});

  const updateOnboardingData = (data: Partial<OnboardingData> & {
    activityLevelText?: string;
    genderText?: string;
  }) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const clearOnboardingData = () => {
    setOnboardingData({});
  };

  const getCompleteData = (): OnboardingData | null => {
    const { goal, activityLevel, gender, birthDate, heightCm, weightKg, goalWeightKg } = onboardingData;
    
    if (
      goal === undefined ||
      activityLevel === undefined ||
      gender === undefined ||
      !birthDate ||
      !heightCm ||
      !weightKg ||
      goalWeightKg === undefined
    ) {
      console.log('Missing data:', { goal, activityLevel, gender, birthDate, heightCm, weightKg, goalWeightKg });
      return null;
    }

    return {
      goal,
      activityLevel,
      gender,
      birthDate,
      heightCm,
      weightKg,
      goalWeightKg,
    };
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        clearOnboardingData,
        getCompleteData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
