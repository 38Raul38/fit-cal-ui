import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

type GoalPeriod = '90days' | '6months' | '1year' | 'alltime';
type CaloriePeriod = 'thisweek' | 'lastweek' | '2weeks';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [selectedGoalPeriod, setSelectedGoalPeriod] = useState<GoalPeriod>('90days');
  const [selectedCaloriePeriod, setSelectedCaloriePeriod] = useState<CaloriePeriod>('thisweek');

  // Mock data for Goal Progress
  const goalProgressData = {
    '90days': [
      { metric: t('analytics.weightLoss'), target: 10, achieved: 7.5, percentage: 75, unit: 'kg' },
      { metric: t('analytics.muscleGain'), target: 5, achieved: 3.2, percentage: 64, unit: 'kg' },
      { metric: t('analytics.bodyFat'), target: -5, achieved: -3.5, percentage: 70, unit: '%' },
      { metric: t('analytics.workoutDays'), target: 60, achieved: 48, percentage: 80, unit: '' },
    ],
    '6months': [
      { metric: t('analytics.weightLoss'), target: 20, achieved: 16, percentage: 80, unit: 'kg' },
      { metric: t('analytics.muscleGain'), target: 10, achieved: 7, percentage: 70, unit: 'kg' },
      { metric: t('analytics.bodyFat'), target: -10, achieved: -7, percentage: 70, unit: '%' },
      { metric: t('analytics.workoutDays'), target: 120, achieved: 95, percentage: 79, unit: '' },
    ],
    '1year': [
      { metric: t('analytics.weightLoss'), target: 30, achieved: 25, percentage: 83, unit: 'kg' },
      { metric: t('analytics.muscleGain'), target: 15, achieved: 11, percentage: 73, unit: 'kg' },
      { metric: t('analytics.bodyFat'), target: -15, achieved: -12, percentage: 80, unit: '%' },
      { metric: t('analytics.workoutDays'), target: 240, achieved: 180, percentage: 75, unit: '' },
    ],
    'alltime': [
      { metric: t('analytics.weightLoss'), target: 40, achieved: 35, percentage: 87, unit: 'kg' },
      { metric: t('analytics.muscleGain'), target: 20, achieved: 15, percentage: 75, unit: 'kg' },
      { metric: t('analytics.bodyFat'), target: -20, achieved: -17, percentage: 85, unit: '%' },
      { metric: t('analytics.workoutDays'), target: 365, achieved: 280, percentage: 77, unit: '' },
    ],
  };

  // Mock data for Total Calories
  const caloriesData = {
    thisweek: [
      { day: 'Mon', calories: 2100 },
      { day: 'Tue', calories: 2300 },
      { day: 'Wed', calories: 1900 },
      { day: 'Thu', calories: 2400 },
      { day: 'Fri', calories: 2200 },
      { day: 'Sat', calories: 2500 },
      { day: 'Sun', calories: 2000 },
    ],
    lastweek: [
      { day: 'Mon', calories: 2200 },
      { day: 'Tue', calories: 2100 },
      { day: 'Wed', calories: 2300 },
      { day: 'Thu', calories: 2000 },
      { day: 'Fri', calories: 2400 },
      { day: 'Sat', calories: 2600 },
      { day: 'Sun', calories: 2100 },
    ],
    '2weeks': [
      { day: 'W1 Mon', calories: 2200 },
      { day: 'W1 Tue', calories: 2100 },
      { day: 'W1 Wed', calories: 2300 },
      { day: 'W1 Thu', calories: 2000 },
      { day: 'W1 Fri', calories: 2400 },
      { day: 'W1 Sat', calories: 2600 },
      { day: 'W1 Sun', calories: 2100 },
      { day: 'W2 Mon', calories: 2100 },
      { day: 'W2 Tue', calories: 2300 },
      { day: 'W2 Wed', calories: 1900 },
      { day: 'W2 Thu', calories: 2400 },
      { day: 'W2 Fri', calories: 2200 },
      { day: 'W2 Sat', calories: 2500 },
      { day: 'W2 Sun', calories: 2000 },
    ],
  };

  const caloriesChartConfig = {
    calories: {
      label: 'Calories',
      color: 'hsl(24, 100%, 50%)',
    },
  } satisfies ChartConfig;

  const goalPeriodLabels = {
    '90days': t('analytics.90days'),
    '6months': t('analytics.6months'),
    '1year': t('analytics.1year'),
    'alltime': t('analytics.alltime'),
  };

  const caloriePeriodLabels = {
    thisweek: t('analytics.thisweek'),
    lastweek: t('analytics.lastweek'),
    '2weeks': t('analytics.2weeks'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t('analytics.title')}</h1>

        {/* Goal Progress Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl">{t('analytics.goalProgress')}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(goalPeriodLabels) as GoalPeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedGoalPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedGoalPeriod === period
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {goalPeriodLabels[period]}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">{t('analytics.metric')}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t('analytics.target')}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t('analytics.achieved')}</th>
                    <th className="text-right py-3 px-4 font-semibold">{t('analytics.progress')}</th>
                  </tr>
                </thead>
                <tbody>
                  {goalProgressData[selectedGoalPeriod].map((row, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-4 px-4 font-medium">{row.metric}</td>
                      <td className="text-right py-4 px-4">{row.target}{row.unit}</td>
                      <td className="text-right py-4 px-4">{row.achieved}{row.unit}</td>
                      <td className="text-right py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 transition-all"
                              style={{ width: `${row.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold min-w-[3rem]">{row.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Total Calories Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl">{t('analytics.totalCalories')}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(caloriePeriodLabels) as CaloriePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedCaloriePeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCaloriePeriod === period
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {caloriePeriodLabels[period]}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('analytics.dailyBreakdown')}</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caloriesData[selectedCaloriePeriod]} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <Bar
                        dataKey="calories"
                        fill="hsl(24, 100%, 50%)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('analytics.trendAnalysis')}</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={caloriesData[selectedCaloriePeriod]} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="hsl(24, 100%, 50%)"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(24, 100%, 50%)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t('analytics.average')}</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    caloriesData[selectedCaloriePeriod].reduce((sum, d) => sum + d.calories, 0) /
                      caloriesData[selectedCaloriePeriod].length
                  )}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t('analytics.highest')}</p>
                <p className="text-2xl font-bold">
                  {Math.max(...caloriesData[selectedCaloriePeriod].map((d) => d.calories))}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t('analytics.lowest')}</p>
                <p className="text-2xl font-bold">
                  {Math.min(...caloriesData[selectedCaloriePeriod].map((d) => d.calories))}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t('analytics.total')}</p>
                <p className="text-2xl font-bold">
                  {caloriesData[selectedCaloriePeriod].reduce((sum, d) => sum + d.calories, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
