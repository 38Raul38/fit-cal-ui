import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { LogOut, User, Palette, Globe, Activity, Lock, Mail } from 'lucide-react';
import { authService } from '@/services/authService';
import { profileApi } from '@/lib/api';
import type { UserProfile } from '@/types';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import ChangeEmailDialog from '@/components/ChangeEmailDialog';

type Language = 'en' | 'az' | 'ru' | 'de' | 'es';
type Theme = 'light' | 'dark';
type Gender = 'male' | 'female' | 'other';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Personal Details State
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [gender, setGender] = useState<Gender>('male');
  const [weightGoal, setWeightGoal] = useState('75');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [dailyCalories, setDailyCalories] = useState(2000);

  // Загрузка данных из API при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileApi.getProfile();
        if (profile) {
          setWeight(profile.weight.toString());
          setHeight(profile.height.toString());
          if (profile.birthDate) {
            // Конвертируем дату из ISO формата (2026-01-26T17:28:20.194Z) в YYYY-MM-DD
            const date = new Date(profile.birthDate);
            const formattedDate = date.toISOString().split('T')[0];
            setDateOfBirth(formattedDate);
          }
          setGender(profile.gender.toLowerCase() as Gender);
          setWeightGoal(profile.weightGoal.toString());
          setActivityLevel(profile.activityLevel);
          setDailyCalories(profile.dailyCalories);
          
          // Рассчитываем проценты макронутриентов из граммов
          const totalProteinGrams = profile.protein || 0;
          const totalCarbsGrams = profile.carbs || 0;
          const totalFatGrams = profile.fats || 0;
          
          if (totalProteinGrams > 0 || totalCarbsGrams > 0 || totalFatGrams > 0) {
            // Конвертируем граммы в калории
            const proteinCals = totalProteinGrams * 4;
            const carbsCals = totalCarbsGrams * 4;
            const fatCals = totalFatGrams * 9;
            const totalMacroCals = proteinCals + carbsCals + fatCals;
            
            if (totalMacroCals > 0) {
              // Рассчитываем проценты
              const proteinPercent = Math.round((proteinCals / totalMacroCals) * 100);
              const carbsPercent = Math.round((carbsCals / totalMacroCals) * 100);
              const fatPercent = Math.round((fatCals / totalMacroCals) * 100);
              
              setProtein(proteinPercent.toString());
              setCarbs(carbsPercent.toString());
              setFat(fatPercent.toString());
            }
          } else {
            // Если нет данных о макросах, оставляем дефолтные значения
            setProtein('30');
            setCarbs('40');
            setFat('30');
          }
        }
      } catch (error) {
        console.error('Error loading profile from API:', error);
        // Если не удалось загрузить из API, пробуем localStorage
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile);
            if (profile.weightKg) setWeight(profile.weightKg.toString());
            if (profile.heightCm) setHeight(profile.heightCm.toString());
            if (profile.birthDate) setDateOfBirth(profile.birthDate);
            if (profile.gender) setGender(profile.gender);
            if (profile.dailyCalories) setDailyCalories(profile.dailyCalories);
          } catch (error) {
            console.error('Error loading user profile from localStorage:', error);
          }
        }
      }
    };
    loadProfile();
  }, []);

  // Macronutrients State
  const [protein, setProtein] = useState('30');
  const [carbs, setCarbs] = useState('40');
  const [fat, setFat] = useState('30');

  // Загрузка макронутриентов из localStorage
  useEffect(() => {
    const savedMacros = localStorage.getItem('macroSettings');
    if (savedMacros) {
      try {
        const macros = JSON.parse(savedMacros);
        setProtein(macros.protein.toString());
        setCarbs(macros.carbs.toString());
        setFat(macros.fat.toString());
      } catch (error) {
        console.error('Error loading macros:', error);
      }
    }
  }, []);

  // Preferences State
  const [language, setLanguage] = useState<Language>(i18n.language as Language || 'en');
  const [theme, setTheme] = useState<Theme>('light');

  // Dialog States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

  // User data State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Load user data
  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
    }
  }, []);

  // Загрузка темы из localStorage при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const languageLabels = {
    en: 'English',
    az: 'Azərbaycan',
    ru: 'Русский',
    es: 'Español',
    de: 'Deutsch',
  };

  const handleSavePersonalDetails = async () => {
    try {
      // Подготавливаем данные для backend в формате UserProfile
      const profileData: Partial<UserProfile> = {
        birthDate: dateOfBirth,
        gender: gender === 'male' ? 'Male' : 'Female',
        height: parseFloat(height),
        weight: parseFloat(weight),
        weightGoal: parseFloat(weightGoal),
        activityLevel: activityLevel,
        dailyCalories: dailyCalories,
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fats: parseInt(fat),
      };
      
      console.log('💾 Saving personal details to backend:', profileData);
      
      // Отправляем на backend
      await profileApi.saveProfile(profileData);
      
      console.log('✅ Personal details saved successfully');
      
      // Также сохраняем в localStorage как кэш
      const localProfile = {
        weightKg: parseFloat(weight),
        heightCm: parseFloat(height),
        birthDate: dateOfBirth,
        gender,
        weightGoal: parseFloat(weightGoal),
        activityLevel,
        dailyCalories,
      };
      localStorage.setItem('userProfile', JSON.stringify(localProfile));
      
      alert('Personal details saved successfully!');
    } catch (error: any) {
      console.error('❌ Error saving personal details:', error);
      alert(`Failed to save personal details: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSaveMacros = () => {
    const total = parseInt(protein) + parseInt(carbs) + parseInt(fat);
    if (total !== 100) {
      alert('Macros must total 100%');
      return;
    }
    
    const macros = {
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
    };
    
    localStorage.setItem('macroSettings', JSON.stringify(macros));
    console.log('Saving macros:', macros);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Очищаем историю и делаем редирект
      window.history.pushState(null, '', '/login');
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      window.history.pushState(null, '', '/login');
      window.location.replace('/login');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t('settings.title')}</h1>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{t('settings.accountInformation')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName">{t('settings.fullName')}</Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  disabled
                  className="mt-1.5 bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="userEmail">{t('settings.email')}</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  disabled
                  className="mt-1.5 bg-muted"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('settings.accountInfoNote')}
            </p>
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{t('settings.personalDetails')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">{t('settings.currentWeight')}</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="height">{t('settings.height')}</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">{t('settings.dateOfBirth')}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="gender">{t('settings.gender')}</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="male">{t('settings.male')}</option>
                  <option value="female">{t('settings.female')}</option>
                  <option value="other">{t('settings.other')}</option>
                </select>
              </div>
            </div>

            <Button onClick={handleSavePersonalDetails} className="mt-2">
              {t('settings.savePersonalDetails')}
            </Button>
          </CardContent>
        </Card>

        {/* Adjust Macronutrients */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{t('settings.adjustMacros')}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('settings.macrosDescription')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="protein">{t('settings.protein')} (%)</Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  max="100"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="mt-1.5"
                />
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${protein}%` }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="carbs">{t('settings.carbs')} (%)</Label>
                <Input
                  id="carbs"
                  type="number"
                  min="0"
                  max="100"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="mt-1.5"
                />
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400"
                    style={{ width: `${carbs}%` }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fat">{t('settings.fat')} (%)</Label>
                <Input
                  id="fat"
                  type="number"
                  min="0"
                  max="100"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="mt-1.5"
                />
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400"
                    style={{ width: `${fat}%` }}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveMacros} className="mt-2">
              {t('settings.saveMacros')}
            </Button>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{t('settings.language')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                    language === lang
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-muted bg-background text-foreground hover:border-foreground/50'
                  }`}
                >
                  {languageLabels[lang]}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{t('settings.appearance')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                  theme === 'light'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-muted bg-background text-foreground hover:border-foreground/50'
                }`}
              >
                {t('settings.light')}
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                  theme === 'dark'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-muted bg-background text-foreground hover:border-foreground/50'
                }`}
              >
                {t('settings.dark')}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{t('settings.accountSecurity')}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('settings.accountSecurityDescription')}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settings.password')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings.passwordDescription')}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsChangePasswordOpen(true)}
              >
                {t('settings.change')}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settings.emailAddress')}</p>
                  <p className="text-sm text-muted-foreground">{userEmail || t('settings.noEmail')}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsChangeEmailOpen(true)}
              >
                {t('settings.change')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Separator className="mb-6" />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('settings.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <ChangePasswordDialog 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          console.log('Password changed successfully');
        }}
      />
      <ChangeEmailDialog 
        isOpen={isChangeEmailOpen} 
        onClose={() => setIsChangeEmailOpen(false)}
        currentEmail={userEmail}
        onSuccess={() => {
          console.log('Email changed successfully');
          // Refresh user data
          const updatedUser = authService.getUser();
          if (updatedUser) {
            setUserEmail(updatedUser.email || '');
          }
        }}
      />
    </div>
  );
}
