interface FavoriteFood {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  addedAt: string;
}

const STORAGE_KEY = 'fit-tracker-favorites';

export const getFavoriteFoods = (): FavoriteFood[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavoriteFoods = (favorites: FavoriteFood[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const addToFavorites = (food: Omit<FavoriteFood, 'id' | 'addedAt'>): void => {
  const favorites = getFavoriteFoods();
  
  // Check if already in favorites
  const exists = favorites.some(fav => 
    fav.name === food.name && 
    fav.servingSize === food.servingSize && 
    fav.servingUnit === food.servingUnit
  );
  
  if (!exists) {
    const newFavorite: FavoriteFood = {
      ...food,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    
    favorites.push(newFavorite);
    saveFavoriteFoods(favorites);
  }
};

export const removeFromFavorites = (id: string): void => {
  const favorites = getFavoriteFoods();
  const updated = favorites.filter(fav => fav.id !== id);
  saveFavoriteFoods(updated);
};

export const isFavorite = (food: { name: string; servingSize: number; servingUnit: string }): boolean => {
  const favorites = getFavoriteFoods();
  return favorites.some(fav => 
    fav.name === food.name && 
    fav.servingSize === food.servingSize && 
    fav.servingUnit === food.servingUnit
  );
};

export type { FavoriteFood };
