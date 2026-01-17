interface WaterRecord {
  date: string; // YYYY-MM-DD
  glasses: number; // количество стаканов
}

const STORAGE_KEY = 'fit-tracker-water';
const DAILY_GOAL = 8; // стаканов в день

export const getWaterHistory = (): Record<string, WaterRecord> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading water data from localStorage:', error);
    return {};
  }
};

export const saveWaterHistory = (history: Record<string, WaterRecord>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving water data to localStorage:', error);
  }
};

export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayWater = (): number => {
  const history = getWaterHistory();
  const today = getDateKey(new Date());
  return history[today]?.glasses || 0;
};

export const addWaterGlass = (): number => {
  const history = getWaterHistory();
  const today = getDateKey(new Date());
  const current = history[today]?.glasses || 0;
  const newAmount = Math.min(current + 1, DAILY_GOAL * 2); // max 16 стаканов
  
  history[today] = {
    date: today,
    glasses: newAmount,
  };
  
  saveWaterHistory(history);
  return newAmount;
};

export const removeWaterGlass = (): number => {
  const history = getWaterHistory();
  const today = getDateKey(new Date());
  const current = history[today]?.glasses || 0;
  const newAmount = Math.max(current - 1, 0);
  
  history[today] = {
    date: today,
    glasses: newAmount,
  };
  
  saveWaterHistory(history);
  return newAmount;
};

export const resetTodayWater = (): void => {
  const history = getWaterHistory();
  const today = getDateKey(new Date());
  
  history[today] = {
    date: today,
    glasses: 0,
  };
  
  saveWaterHistory(history);
};

export const getWaterGoal = (): number => {
  return DAILY_GOAL;
};

export const getWaterPercentage = (): number => {
  const current = getTodayWater();
  return Math.min((current / DAILY_GOAL) * 100, 100);
};
