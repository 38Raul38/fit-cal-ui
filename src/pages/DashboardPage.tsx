import { useState } from 'react';
import { Flame, Apple, Wheat, Droplet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface DayData {
  caloriesLeft: number;
  totalCalories: number;
  proteinLeft: number;
  carbsLeft: number;
  fatLeft: number;
}

export default function DashboardPage() {
  const [selectedDay, setSelectedDay] = useState(6);
  
  // Mock data for different days
  const dayData: { [key: number]: DayData } = {
    1: { caloriesLeft: 1800, totalCalories: 2400, proteinLeft: 120, carbsLeft: 150, fatLeft: 40 },
    2: { caloriesLeft: 1500, totalCalories: 2400, proteinLeft: 90, carbsLeft: 110, fatLeft: 30 },
    3: { caloriesLeft: 2000, totalCalories: 2400, proteinLeft: 140, carbsLeft: 180, fatLeft: 50 },
    4: { caloriesLeft: 1200, totalCalories: 2400, proteinLeft: 80, carbsLeft: 90, fatLeft: 25 },
    5: { caloriesLeft: 1600, totalCalories: 2400, proteinLeft: 100, carbsLeft: 130, fatLeft: 35 },
    6: { caloriesLeft: 1000, totalCalories: 2400, proteinLeft: 100, carbsLeft: 99, fatLeft: 25 },
    7: { caloriesLeft: 2200, totalCalories: 2400, proteinLeft: 150, carbsLeft: 200, fatLeft: 55 },
  };

  const currentData = dayData[selectedDay];
  const caloriesLeft = currentData.caloriesLeft;
  const totalCalories = currentData.totalCalories;
  const proteinLeft = currentData.proteinLeft;
  const carbsLeft = currentData.carbsLeft;
  const fatLeft = currentData.fatLeft;
  
  const weekDays = [
    { day: 'S', date: 1 },
    { day: 'S', date: 2 },
    { day: 'M', date: 3 },
    { day: 'T', date: 4 },
    { day: 'W', date: 5 },
    { day: 'T', date: 6 },
    { day: 'F', date: 7 },
  ];

  const calorieProgress = ((totalCalories - caloriesLeft) / totalCalories) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Week Calendar */}
        <div className="flex justify-between gap-2 mb-6">
          {weekDays.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(item.date)}
              className={`flex flex-col items-center gap-2 transition-opacity hover:opacity-100 ${
                selectedDay === item.date ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                  selectedDay === item.date
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-dashed border-muted-foreground hover:border-foreground'
                }`}
              >
                {item.day}
              </div>
              <span className="text-sm">{item.date}</span>
            </button>
          ))}
        </div>

        {/* Calories Card */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2">{caloriesLeft}</h2>
                <p className="text-base sm:text-lg text-muted-foreground">Calories left</p>
              </div>
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - calorieProgress / 100)}`}
                    className="text-orange-500 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macros Cards - Grid on all screens */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Protein */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{proteinLeft}g</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Protein left</p>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * 0.3}`}
                    className="text-red-400 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Apple className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbs */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{carbsLeft}g</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Carbs left</p>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * 0.5}`}
                    className="text-orange-400 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wheat className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fat */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{fatLeft}g</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Fat left</p>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * 0.7}`}
                    className="text-blue-400 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
