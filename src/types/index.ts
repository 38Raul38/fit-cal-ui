export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date: Date;
}

export interface NutritionEntry {
  id: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
}

// Onboarding Data Types
export interface OnboardingData {
  goal: number; // 0 = Lose weight, 1 = Maintain weight, 2 = Gain weight
  activityLevel: number; // 0 = Not very active, 1 = Lightly active, 2 = Active, 3 = Very active
  gender: number; // 0 = Male, 1 = Female
  birthDate: string; // Format: "YYYY-MM-DD"
  heightCm: number;
  weightKg: number;
  goalWeightKg: number | null;
}

export interface UserProfile {
  userInformationId?: number;
  birthDate: string;
  gender: string;
  height: number;
  weight: number;
  weightGoal: number;
  activityLevel: string;
  dailyCalories: number;
  protein: number;
  fats: number;
  carbs: number;
}

export interface CalorieCalculationResponse {
  dailyCalories: number;
  unitLabel: string;
  planText: string;
  goal: string;
}

// API Response Types
export interface AuthResponse {
  succeeded: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  user?: User;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  title?: string;
}
