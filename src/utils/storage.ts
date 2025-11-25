import { Category } from '../types';

const STORAGE_KEY = 'productivity-dashboard-data';

export const saveToStorage = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

export const loadFromStorage = (): Category[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
};
