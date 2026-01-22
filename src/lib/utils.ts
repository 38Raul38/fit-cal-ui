import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Storage utilities
export const getUserId = (): string | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log('⚠️ getUserId: no user in localStorage');
    return null;
  }
  try {
    const user = JSON.parse(userStr);
    const userId = user?.id ? String(user.id) : null;
    console.log('👤 getUserId:', userId);
    return userId;
  } catch {
    console.error('❌ getUserId: failed to parse user');
    return null;
  }
};

export const getFavoritesKey = (): string => {
  const userId = getUserId();
  const key = userId ? `fit-tracker-favorites-${userId}` : 'fit-tracker-favorites';
  console.log('🔑 getFavoritesKey:', key);
  return key;
};

export const getMealsKey = (): string => {
  const userId = getUserId();
  const key = userId ? `fit-tracker-meals-${userId}` : 'fit-tracker-meals';
  console.log('🔑 getMealsKey:', key);
  return key;
};

// Debug utility - call from browser console: window.debugStorage()
(window as any).debugStorage = () => {
  const userId = getUserId();
  const mealsKey = getMealsKey();
  const favoritesKey = getFavoritesKey();
  
  console.log('=== STORAGE DEBUG ===');
  console.log('Current userId:', userId);
  console.log('Current mealsKey:', mealsKey);
  console.log('Current favoritesKey:', favoritesKey);
  console.log('\n📦 All localStorage keys:');
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes('fit-tracker')) {
      const value = localStorage.getItem(key);
      const preview = value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : null;
      console.log(`  ${key}:`, preview);
    }
  }
  
  console.log('\n🔐 Auth data:');
  console.log('  authToken:', localStorage.getItem('authToken')?.substring(0, 50) + '...');
  console.log('  refreshToken:', localStorage.getItem('refreshToken')?.substring(0, 50) + '...');
  console.log('  user:', localStorage.getItem('user'));
  console.log('===================');
};

// Utility to clear ALL fit-tracker data - call from console: window.clearAllFitTrackerData()
(window as any).clearAllFitTrackerData = () => {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('fit-tracker') || key === 'authToken' || key === 'refreshToken' || key === 'user')) {
      keysToRemove.push(key);
    }
  }
  
  console.log('🗑️ Removing keys:', keysToRemove);
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log('✅ All fit-tracker data cleared!');
  window.location.href = '/login';
};
