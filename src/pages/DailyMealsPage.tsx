import { useState, useEffect } from 'react';
import { Plus, Apple, Sun, Sunset, Moon, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import FoodSearchModal from '@/components/FoodSearchModal';
import { getMealsHistory, saveMealsHistory } from '@/lib/mealStorage';
import { useTranslation } from 'react-i18next';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DailyMealsPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  
  const currentDateKey = getDateKey(selectedDate);
  const allMeals = getMealsHistory();
  const dayMeals = allMeals[currentDateKey] || { breakfast: [], lunch: [], dinner: [] };
  
  const [breakfast, setBreakfast] = useState<Meal[]>(dayMeals.breakfast);
  const [lunch, setLunch] = useState<Meal[]>(dayMeals.lunch);
  const [dinner, setDinner] = useState<Meal[]>(dayMeals.dinner);

  // Load meals when date changes
  useEffect(() => {
    const meals = getMealsHistory();
    const key = getDateKey(selectedDate);
    const dayData = meals[key] || { breakfast: [], lunch: [], dinner: [] };
    
    // Ensure arrays exist
    setBreakfast(Array.isArray(dayData.breakfast) ? dayData.breakfast : []);
    setLunch(Array.isArray(dayData.lunch) ? dayData.lunch : []);
    setDinner(Array.isArray(dayData.dinner) ? dayData.dinner : []);
  }, [selectedDate]);

  // Get week days for calendar - starting from Monday
  const getWeekDays = () => {
    const days = [];
    const refDate = selectedDate;
    const currentDay = refDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Find the Monday of the current week
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days, else go to Monday
    const monday = new Date(refDate);
    monday.setDate(refDate.getDate() + diff);
    
    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  
  // Day names for calendar starting from Monday
  const getDayName = (date: Date) => {
    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const dayIndex = (date.getDay() + 6) % 7; // Shift so Monday is 0
    return dayNames[dayIndex];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpenModal = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setActiveMealType(mealType);
    setIsModalOpen(true);
  };

  const handleAddFood = (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };

    const key = getDateKey(selectedDate);
    let updatedMeals: Meal[] = [];
    
    if (activeMealType === 'breakfast') {
      updatedMeals = [...breakfast, newMeal];
      setBreakfast(updatedMeals);
    } else if (activeMealType === 'lunch') {
      updatedMeals = [...lunch, newMeal];
      setLunch(updatedMeals);
    } else {
      updatedMeals = [...dinner, newMeal];
      setDinner(updatedMeals);
    }

    // Save to localStorage
    const allMeals = getMealsHistory();
    saveMealsHistory({
      ...allMeals,
      [key]: {
        breakfast: activeMealType === 'breakfast' ? updatedMeals : breakfast,
        lunch: activeMealType === 'lunch' ? updatedMeals : lunch,
        dinner: activeMealType === 'dinner' ? updatedMeals : dinner,
      },
    });
  };

  const handleDeleteFood = (mealType: 'breakfast' | 'lunch' | 'dinner', mealId: string) => {
    const key = getDateKey(selectedDate);
    let updatedMeals: Meal[] = [];

    if (mealType === 'breakfast') {
      updatedMeals = breakfast.filter(meal => meal.id !== mealId);
      setBreakfast(updatedMeals);
    } else if (mealType === 'lunch') {
      updatedMeals = lunch.filter(meal => meal.id !== mealId);
      setLunch(updatedMeals);
    } else {
      updatedMeals = dinner.filter(meal => meal.id !== mealId);
      setDinner(updatedMeals);
    }

    // Save to localStorage
    const allMeals = getMealsHistory();
    saveMealsHistory({
      ...allMeals,
      [key]: {
        breakfast: mealType === 'breakfast' ? updatedMeals : breakfast,
        lunch: mealType === 'lunch' ? updatedMeals : lunch,
        dinner: mealType === 'dinner' ? updatedMeals : dinner,
      },
    });
  };

  const mealSections = [
    {
      id: 'breakfast',
      title: t('dailyMeals.breakfast'),
      icon: Sun,
      meals: breakfast,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      id: 'lunch',
      title: t('dailyMeals.lunch'),
      icon: Sunset,
      meals: lunch,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      id: 'dinner',
      title: t('dailyMeals.dinner'),
      icon: Moon,
      meals: dinner,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ];

  const getTotalCalories = (meals: Meal[]) => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('dailyMeals.title')}</h1>
          <p className="text-muted-foreground">{t('dailyMeals.subtitle')}</p>
        </div>

        {/* Week Calendar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 7);
                    handleDayClick(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 7);
                    handleDayClick(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((date, index) => {
                const today = isToday(date);
                const selected = isSameDay(date, selectedDate);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(date)}
                    className={`
                      flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg transition-all
                      ${selected && today ? 'bg-primary text-primary-foreground shadow-lg' : ''}
                      ${selected && !today ? 'bg-primary/80 text-primary-foreground shadow-md' : ''}
                      ${!selected && today ? 'bg-muted ring-2 ring-primary/50' : ''}
                      ${!selected && !today ? 'hover:bg-muted/50' : ''}
                    `}
                  >
                    <span className="text-xs sm:text-sm font-medium mb-1">
                      {getDayName(date)}
                    </span>
                    <span className={`text-lg sm:text-xl font-bold ${selected ? '' : 'text-muted-foreground'}`}>
                      {date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {isToday(selectedDate) && (
              <div className="mt-3 text-center">
                <span className="text-sm text-primary font-medium">{t('dailyMeals.today')}</span>
              </div>
            )}
            {!isToday(selectedDate) && (
              <div className="mt-3 text-center">
                <span className="text-sm text-muted-foreground">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meal Sections */}
        <div className="space-y-4">
          {mealSections.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-4 sm:p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.bgColor}`}>
                      <section.icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {getTotalCalories(section.meals)} {t('dailyMeals.calories')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleOpenModal(section.id as 'breakfast' | 'lunch' | 'dinner')}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('dailyMeals.addFood')}</span>
                  </Button>
                </div>

                {/* Meals List */}
                {section.meals.length === 0 ? (
                  <div className="py-8 text-center">
                    <Apple className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      {isToday(selectedDate) 
                        ? t('dailyMeals.noMealsToday') || 'No meals added yet' 
                        : t('dailyMeals.noMealsThisDay') || `No meals for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            P: {meal.protein}{t('dailyMeals.grams')} • C: {meal.carbs}{t('dailyMeals.grams')} • F: {meal.fat}{t('dailyMeals.grams')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold">{meal.calories}</p>
                            <p className="text-xs text-muted-foreground">{t('dailyMeals.cal')}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteFood(section.id as 'breakfast' | 'lunch' | 'dinner', meal.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="mt-6">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dailyMeals.todaysSummary')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(getTotalCalories([...breakfast, ...lunch, ...dinner]))}
                </p>
                <p className="text-sm text-muted-foreground">{t('dailyMeals.totalCalories')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round([...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.protein, 0) * 10) / 10}g
                </p>
                <p className="text-sm text-muted-foreground">{t('dailyMeals.protein')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round([...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.carbs, 0) * 10) / 10}g
                </p>
                <p className="text-sm text-muted-foreground">{t('dailyMeals.carbs')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round([...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.fat, 0) * 10) / 10}g
                </p>
                <p className="text-sm text-muted-foreground">{t('dailyMeals.fat')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Search Modal */}
      <FoodSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFood={handleAddFood}
        mealType={activeMealType.charAt(0).toUpperCase() + activeMealType.slice(1)}
      />
    </div>
  );
}
