interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DayMeals {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

const getStorageKey = (): string => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return `fit-tracker-meals-${user.id}`;
    } catch {
      console.warn('Failed to parse user data');
    }
  }
  return 'fit-tracker-meals'; // Fallback для неавторизованных
};

export const getMealsHistory = (): Record<string, DayMeals> => {
  try {
    const STORAGE_KEY = getStorageKey();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading meals from localStorage:', error);
    return {};
  }
};

export const saveMealsHistory = (history: Record<string, DayMeals>): void => {
  try {
    const STORAGE_KEY = getStorageKey();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving meals to localStorage:', error);
  }
};

export const getMealsForDate = (date: Date): DayMeals => {
  const history = getMealsHistory();
  const key = getDateKey(date);
  return history[key] || { breakfast: [], lunch: [], dinner: [] };
};

export const getTodayMeals = (): { name: string; items: Meal[] }[] => {
  const todayMeals = getMealsForDate(new Date());
  return [
    { name: 'breakfast', items: todayMeals.breakfast },
    { name: 'lunch', items: todayMeals.lunch },
    { name: 'dinner', items: todayMeals.dinner },
  ];
};

export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTotalNutrition = (meals: DayMeals) => {
  // Ensure all meal arrays exist
  const breakfast = Array.isArray(meals.breakfast) ? meals.breakfast : [];
  const lunch = Array.isArray(meals.lunch) ? meals.lunch : [];
  const dinner = Array.isArray(meals.dinner) ? meals.dinner : [];
  
  const allMeals = [...breakfast, ...lunch, ...dinner];
  
  return {
    calories: allMeals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: allMeals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: allMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: allMeals.reduce((sum, meal) => sum + meal.fat, 0),
  };
};

export const getStreakDays = (): number => {
  const history = getMealsHistory();
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check each day going backwards
  while (true) {
    const key = getDateKey(currentDate);
    const dayMeals = history[key];
    
    // Check if this day has any meals
    const hasMeals = dayMeals && (
      (Array.isArray(dayMeals.breakfast) && dayMeals.breakfast.length > 0) ||
      (Array.isArray(dayMeals.lunch) && dayMeals.lunch.length > 0) ||
      (Array.isArray(dayMeals.dinner) && dayMeals.dinner.length > 0)
    );
    
    if (hasMeals) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If it's today and no meals yet, don't count but don't break streak
      if (currentDate.toDateString() === today.toDateString()) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
    
    // Safety limit - don't check more than 365 days
    if (streak >= 365) break;
  }
  
  return streak;
};
