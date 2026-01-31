import { useState, useEffect } from 'react';
import { Apple, Wheat, Droplet, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { useTranslation } from 'react-i18next';
import { getTodayMeals } from '@/lib/mealStorage';
import { getTodayWater, addWaterGlass, removeWaterGlass, getWaterGoal } from '@/lib/waterStorage';
import { profileApi } from '@/lib/api';

interface DayData {
  caloriesLeft: number;
  totalCalories: number;
  proteinLeft: number;
  totalProtein: number;
  carbsLeft: number;
  totalCarbs: number;
  fatLeft: number;
  totalFat: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const waterGoal = getWaterGoal();
  
  const [currentData, setCurrentData] = useState<DayData>({
    caloriesLeft: 2400,
    totalCalories: 2400,
    proteinLeft: 150,
    totalProtein: 150,
    carbsLeft: 240,
    totalCarbs: 240,
    fatLeft: 80,
    totalFat: 80,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      console.log('📊 [Dashboard] Starting to load data...');
      console.log('📊 [Dashboard] localStorage state:', {
        hasAuthToken: !!localStorage.getItem('authToken'),
        hasUser: !!localStorage.getItem('user'),
        tokenPreview: localStorage.getItem('authToken')?.substring(0, 20) + '...'
      });
      
      try {
        // Получаем профиль пользователя из API
        console.log('📊 [Dashboard] Calling profileApi.getProfile()...');
        const profile = await profileApi.getProfile();
        
        console.log('📊 [Dashboard] Profile received:', profile);
        
        let dailyCalories = 2400;
        let proteinPercent = 30;
        let carbsPercent = 40;
        let fatPercent = 30;
        
        if (profile) {
          // Используем данные из backend
          dailyCalories = profile.dailyCalories || 2400;
          
          // Рассчитываем проценты макронутриентов из граммов
          const totalProteinGrams = profile.protein || 0;
          const totalCarbsGrams = profile.carbs || 0;
          const totalFatGrams = profile.fats || 0;
          
          // Если в профиле есть макросы в граммах, пересчитываем проценты
          if (totalProteinGrams > 0 || totalCarbsGrams > 0 || totalFatGrams > 0) {
            const proteinCals = totalProteinGrams * 4;
            const carbsCals = totalCarbsGrams * 4;
            const fatCals = totalFatGrams * 9;
            const totalMacroCals = proteinCals + carbsCals + fatCals;
            
            if (totalMacroCals > 0) {
              proteinPercent = (proteinCals / totalMacroCals) * 100;
              carbsPercent = (carbsCals / totalMacroCals) * 100;
              fatPercent = (fatCals / totalMacroCals) * 100;
            }
          }
          
          // Сохраняем в localStorage как кэш
          localStorage.setItem('userProfile', JSON.stringify({
            dailyCalories: profile.dailyCalories,
            protein: profile.protein,
            carbs: profile.carbs,
            fats: profile.fats,
          }));
        } else {
          // Если профиля нет в API, пробуем загрузить из localStorage (кэш)
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            try {
              const cachedProfile = JSON.parse(savedProfile);
              dailyCalories = cachedProfile.dailyCalories || 2400;
            } catch (error) {
              console.error('Error loading cached profile:', error);
            }
          }
          
          // Загружаем настройки макронутриентов из localStorage
          const savedMacros = localStorage.getItem('macroSettings');
          if (savedMacros) {
            try {
              const macros = JSON.parse(savedMacros);
              proteinPercent = macros.protein || 30;
              carbsPercent = macros.carbs || 40;
              fatPercent = macros.fat || 30;
            } catch (error) {
              console.error('Error loading macros:', error);
            }
          }
        }

        // Рассчитываем рекомендуемые макросы
        const totalProtein = Math.round((dailyCalories * (proteinPercent / 100)) / 4);
        const totalCarbs = Math.round((dailyCalories * (carbsPercent / 100)) / 4);
        const totalFat = Math.round((dailyCalories * (fatPercent / 100)) / 9);

        // Получаем съеденные продукты за сегодня
        const todayMeals = getTodayMeals();
        
        // Суммируем калории и макросы
        let consumedCalories = 0;
        let consumedProtein = 0;
        let consumedCarbs = 0;
        let consumedFat = 0;

        todayMeals.forEach(meal => {
          meal.items.forEach(item => {
            consumedCalories += item.calories;
            consumedProtein += item.protein;
            consumedCarbs += item.carbs;
            consumedFat += item.fat;
          });
        });

        // Рассчитываем остаток
        setCurrentData({
          caloriesLeft: Math.max(0, dailyCalories - consumedCalories),
          totalCalories: dailyCalories,
          proteinLeft: Math.max(0, totalProtein - consumedProtein),
          totalProtein,
          carbsLeft: Math.max(0, totalCarbs - consumedCarbs),
          totalCarbs,
          fatLeft: Math.max(0, totalFat - consumedFat),
          totalFat,
        });

        // Загружаем воду
        setWaterGlasses(getTodayWater());
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        
        // В случае ошибки используем данные из localStorage
        const savedProfile = localStorage.getItem('userProfile');
        let dailyCalories = 2400;
        
        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile);
            dailyCalories = profile.dailyCalories || 2400;
          } catch (e) {
            console.error('Error parsing cached profile:', e);
          }
        }
        
        setCurrentData(prev => ({
          ...prev,
          totalCalories: dailyCalories,
          caloriesLeft: dailyCalories,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  const handleAddWater = () => {
    const newAmount = addWaterGlass();
    setWaterGlasses(newAmount);
  };

  const handleRemoveWater = () => {
    const newAmount = removeWaterGlass();
    setWaterGlasses(newAmount);
  };
  
  const caloriesLeft = Math.round(currentData.caloriesLeft);
  const totalCalories = Math.round(currentData.totalCalories);
  const proteinLeft = Number(currentData.proteinLeft.toFixed(1));
  const totalProtein = Number(currentData.totalProtein.toFixed(1));
  const carbsLeft = Number(currentData.carbsLeft.toFixed(1));
  const totalCarbs = Number(currentData.totalCarbs.toFixed(1));
  const fatLeft = Number(currentData.fatLeft.toFixed(1));
  const totalFat = Number(currentData.totalFat.toFixed(1));
  
  const calorieProgress = totalCalories > 0 ? ((totalCalories - caloriesLeft) / totalCalories) * 100 : 0;
  const proteinProgress = totalProtein > 0 ? ((totalProtein - proteinLeft) / totalProtein) * 100 : 0;
  const carbsProgress = totalCarbs > 0 ? ((totalCarbs - carbsLeft) / totalCarbs) * 100 : 0;
  const fatProgress = totalFat > 0 ? ((totalFat - fatLeft) / totalFat) * 100 : 0;

  const caloriesChartData = [{ value: calorieProgress, fill: 'hsl(var(--chart-1))' }];
  const caloriesChartConfig = {
    value: { label: 'Calories', color: 'hsl(24, 100%, 50%)' }
  } satisfies ChartConfig;

  const proteinChartData = [{ value: proteinProgress }];
  const proteinChartConfig = {
    value: { label: 'Protein', color: 'hsl(0, 72%, 51%)' }
  } satisfies ChartConfig;

  const carbsChartData = [{ value: carbsProgress }];
  const carbsChartConfig = {
    value: { label: 'Carbs', color: 'hsl(33, 100%, 50%)' }
  } satisfies ChartConfig;

  const fatChartData = [{ value: fatProgress }];
  const fatChartConfig = {
    value: { label: 'Fat', color: 'hsl(199, 89%, 48%)' }
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Calories Card */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2">{caloriesLeft}</h2>
                <p className="text-base sm:text-lg text-muted-foreground">{t('dashboard.caloriesLeft')}</p>
              </div>
              <ChartContainer config={caloriesChartConfig} className="w-28 h-28 sm:w-36 sm:h-36">
                <RadialBarChart
                  data={caloriesChartData}
                  startAngle={90}
                  endAngle={90 - (calorieProgress * 360) / 100}
                  innerRadius={45}
                  outerRadius={65}
                >
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <g>
                              <foreignObject
                                x={(viewBox.cx ?? 0) - 35}
                                y={(viewBox.cy ?? 0) - 20}
                                width="70"
                                height="40"
                              >
                                <div className="flex h-full items-center justify-center">
                                  <span className="text-2xl font-bold text-orange-500">{totalCalories - caloriesLeft}</span>
                                </div>
                              </foreignObject>
                            </g>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="value"
                    background
                    cornerRadius={10}
                    fill="hsl(24, 100%, 50%)"
                  />
                </RadialBarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Macros Cards - Grid on all screens */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Protein */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{proteinLeft}g</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{t('dashboard.proteinLeft')}</p>
              <ChartContainer config={proteinChartConfig} className="w-20 h-20 sm:w-24 sm:h-24 mx-auto aspect-square">
                <RadialBarChart
                  data={proteinChartData}
                  startAngle={90}
                  endAngle={90 - (proteinProgress * 360) / 100}
                  innerRadius={25}
                  outerRadius={40}
                >
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <foreignObject
                              x={(viewBox.cx ?? 0) - 12}
                              y={(viewBox.cy ?? 0) - 12}
                              width="24"
                              height="24"
                            >
                              <div className="flex h-full items-center justify-center">
                                <Apple className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                              </div>
                            </foreignObject>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar dataKey="value" background cornerRadius={5} fill="hsl(0, 72%, 51%)" />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Carbs */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{carbsLeft}g</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{t('dashboard.carbsLeft')}</p>
              <ChartContainer config={carbsChartConfig} className="w-20 h-20 sm:w-24 sm:h-24 mx-auto aspect-square">
                <RadialBarChart
                  data={carbsChartData}
                  startAngle={90}
                  endAngle={90 - (carbsProgress * 360) / 100}
                  innerRadius={25}
                  outerRadius={40}
                >
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <foreignObject
                              x={(viewBox.cx ?? 0) - 12}
                              y={(viewBox.cy ?? 0) - 12}
                              width="24"
                              height="24"
                            >
                              <div className="flex h-full items-center justify-center">
                                <Wheat className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                              </div>
                            </foreignObject>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar dataKey="value" background cornerRadius={5} fill="hsl(33, 100%, 50%)" />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Fat */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{fatLeft}g</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{t('dashboard.fatLeft')}</p>
              <ChartContainer config={fatChartConfig} className="w-20 h-20 sm:w-24 sm:h-24 mx-auto aspect-square">
                <RadialBarChart
                  data={fatChartData}
                  startAngle={90}
                  endAngle={90 - (fatProgress * 360) / 100}
                  innerRadius={25}
                  outerRadius={40}
                >
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <foreignObject
                              x={(viewBox.cx ?? 0) - 12}
                              y={(viewBox.cy ?? 0) - 12}
                              width="24"
                              height="24"
                            >
                              <div className="flex h-full items-center justify-center">
                                <Droplet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                              </div>
                            </foreignObject>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar dataKey="value" background cornerRadius={5} fill="hsl(199, 89%, 48%)" />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Water Tracker */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Water Intake</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {waterGlasses} / {waterGoal} glasses
              </span>
            </div>

            {/* Water Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                  style={{ width: `${Math.min((waterGlasses / waterGoal) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Water Glasses Visual */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {Array.from({ length: waterGoal }).map((_, index) => (
                <div
                  key={index}
                  className={`w-10 h-12 rounded-lg border-2 transition-all ${
                    index < waterGlasses
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-transparent border-muted'
                  }`}
                >
                  {index < waterGlasses && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Droplet className="h-5 w-5 text-white fill-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleRemoveWater}
                disabled={waterGlasses === 0}
                variant="outline"
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove
              </Button>
              <Button
                onClick={handleAddWater}
                disabled={waterGlasses >= waterGoal * 2}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Glass
              </Button>
            </div>

            {waterGlasses >= waterGoal && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">
                  🎉 Great job! You reached your daily water goal!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
