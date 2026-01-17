/**
 * Утилиты для маппинга данных онбординга в формат API
 */

// Маппинг уровня активности
export const mapActivityLevel = (level: string): number => {
  const mapping: Record<string, number> = {
    'Not very active': 0,
    'Lightly active': 1,
    'Active': 2,
    'Very active': 3,
  };
  return mapping[level] ?? 0;
};

// Маппинг пола
export const mapGender = (gender: string): number => {
  const mapping: Record<string, number> = {
    'male': 0,
    'female': 1,
  };
  return mapping[gender.toLowerCase()] ?? 0;
};

// Маппинг цели (из localStorage selectedGoals)
export const mapGoal = (goals: string[]): number => {
  if (goals.includes('Lose weight')) return 0;
  if (goals.includes('Maintain weight')) return 1;
  if (goals.includes('Gain weight')) return 2;
  return 1; // По умолчанию maintain
};

// Форматирование даты в YYYY-MM-DD
export const formatBirthDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Если уже строка, попробуем извлечь дату
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return date;
  }
  return date.toISOString().split('T')[0];
};
