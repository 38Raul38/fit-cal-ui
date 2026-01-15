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

const STORAGE_KEY = 'fit-tracker-meals';

export const getMealsHistory = (): Record<string, DayMeals> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading meals from localStorage:', error);
    return {};
  }
};

export const saveMealsHistory = (history: Record<string, DayMeals>): void => {
  try {
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

export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTotalNutrition = (meals: DayMeals) => {
  const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.dinner];
  
  return {
    calories: allMeals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: allMeals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: allMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: allMeals.reduce((sum, meal) => sum + meal.fat, 0),
  };
};
