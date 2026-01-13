import { useState } from 'react';
import { Plus, Apple, Sun, Sunset, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function DailyMealsPage() {
  const [breakfast, setBreakfast] = useState<Meal[]>([]);
  const [lunch, setLunch] = useState<Meal[]>([]);
  const [dinner, setDinner] = useState<Meal[]>([]);

  const mealSections = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      icon: Sun,
      meals: breakfast,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      id: 'lunch',
      title: 'Lunch',
      icon: Sunset,
      meals: lunch,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      id: 'dinner',
      title: 'Dinner',
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Daily Meals</h1>
          <p className="text-muted-foreground">Track your meals throughout the day</p>
        </div>

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
                        {getTotalCalories(section.meals)} calories
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Food</span>
                  </Button>
                </div>

                {/* Meals List */}
                {section.meals.length === 0 ? (
                  <div className="py-8 text-center">
                    <Apple className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      No meals added yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{meal.calories}</p>
                          <p className="text-xs text-muted-foreground">cal</p>
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
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold">
                  {getTotalCalories([...breakfast, ...lunch, ...dinner])}
                </p>
                <p className="text-sm text-muted-foreground">Total Calories</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {[...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.protein, 0)}g
                </p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {[...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.carbs, 0)}g
                </p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {[...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.fat, 0)}g
                </p>
                <p className="text-sm text-muted-foreground">Fat</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
