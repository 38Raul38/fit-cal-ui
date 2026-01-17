import { useState, useEffect } from 'react';
import { Search, X, Plus, Loader2, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { api } from '@/lib/api';
import { getFavoriteFoods, addToFavorites, removeFromFavorites, isFavorite, type FavoriteFood } from '@/lib/favoriteFoods';

interface FoodItem {
  foodId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
}

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
  mealType: string;
}

export default function FoodSearchModal({ isOpen, onClose, onAddFood, mealType }: FoodSearchModalProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteFood[]>([]);
  const [servingSizes, setServingSizes] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load favorites when modal opens
  useEffect(() => {
    if (isOpen) {
      setFavorites(getFavoriteFoods());
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post<FoodItem>('/api/Food', {
        name: searchQuery,
        servingSize: null,
        servingUnit: 'g'
      });

      // API возвращает один результат, оборачиваем в массив
      const results = response.data ? [response.data] : [];
      setSearchResults(results);
      
      // Initialize serving sizes to default from API
      const initialSizes: Record<number, number> = {};
      results.forEach((item, index) => {
        initialSizes[index] = item.servingSize || 100;
      });
      setServingSizes(initialSizes);
      
      if (results.length === 0) {
        setError('No results found. Try a different search term.');
      }
    } catch (err: any) {
      setError('Failed to search for food. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServingSizeChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setServingSizes(prev => ({
      ...prev,
      [index]: numValue,
    }));
  };

  const calculateNutrition = (item: FoodItem, grams: number) => {
    const ratio = grams / item.servingSize;
    return {
      calories: Math.round(item.calories * ratio),
      protein: Math.round(item.protein * ratio * 10) / 10,
      carbs: Math.round(item.carbs * ratio * 10) / 10,
      fat: Math.round(item.fats * ratio * 10) / 10,
    };
  };

  const handleAddFood = (item: FoodItem, index: number) => {
    const grams = servingSizes[index] || item.servingSize;
    const nutrition = calculateNutrition(item, grams);
    
    onAddFood({
      name: `${item.name} (${grams}${item.servingUnit})`,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
    });
    onClose();
    setSearchQuery('');
    setSearchResults([]);
    setServingSizes({});
  };

  const handleAddFavoriteFood = (fav: FavoriteFood) => {
    onAddFood({
      name: `${fav.name} (${fav.servingSize}${fav.servingUnit})`,
      calories: fav.calories,
      protein: fav.protein,
      carbs: fav.carbs,
      fat: fav.fat,
    });
    onClose();
  };

  const handleToggleFavorite = (item: FoodItem, index: number) => {
    const grams = servingSizes[index] || item.servingSize;
    const nutrition = calculateNutrition(item, grams);
    
    const foodData = {
      name: item.name,
      servingSize: grams,
      servingUnit: item.servingUnit,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
    };

    if (isFavorite(foodData)) {
      const fav = favorites.find(f => 
        f.name === foodData.name && 
        f.servingSize === foodData.servingSize && 
        f.servingUnit === foodData.servingUnit
      );
      if (fav) {
        removeFromFavorites(fav.id);
        setFavorites(getFavoriteFoods());
      }
    } else {
      addToFavorites(foodData);
      setFavorites(getFavoriteFoods());
    }
  };

  const handleRemoveFavorite = (id: string) => {
    removeFromFavorites(id);
    setFavorites(getFavoriteFoods());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Food to {mealType}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Search
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className="h-4 w-4 inline mr-2" />
              Favorites ({favorites.length})
            </button>
          </div>

          {/* Search Tab */}
          {activeTab === 'search' && (
            <>
              {/* Search Bar */}
              <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for food (e.g., chicken breast, apple, rice)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* Results */}
              <div className="overflow-y-auto max-h-[50vh] space-y-2">
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => {
                const currentSize = servingSizes[index] || item.servingSize;
                const nutrition = calculateNutrition(item, currentSize);
                
                return (
                  <div
                    key={item.foodId}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg capitalize mb-3">{item.name}</h3>
                        
                        {/* Serving Size Input */}
                        <div className="mb-3">
                          <label className="text-sm text-muted-foreground mb-1 block">
                            Serving size ({item.servingUnit})
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={currentSize}
                            onChange={(e) => handleServingSizeChange(index, e.target.value)}
                            className="w-32"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Calories</p>
                            <p className="font-semibold">{nutrition.calories}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Protein</p>
                            <p className="font-semibold">{nutrition.protein}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Carbs</p>
                            <p className="font-semibold">{nutrition.carbs}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fat</p>
                            <p className="font-semibold">{nutrition.fat}g</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Original serving: {item.servingSize}{item.servingUnit}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleFavorite(item, index)}
                          className="flex-shrink-0"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFavorite({ name: item.name, servingSize: servingSizes[index] || item.servingSize, servingUnit: item.servingUnit })
                                ? 'fill-yellow-500 text-yellow-500'
                                : ''
                            }`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddFood(item, index)}
                          className="gap-2 flex-shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              !isLoading && searchQuery && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    {error || 'Search for food to see results'}
                  </p>
                </div>
              )
            )}
              </div>
            </>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="overflow-y-auto max-h-[50vh] space-y-2">
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg capitalize mb-2">{fav.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {fav.servingSize}{fav.servingUnit}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Calories</p>
                            <p className="font-semibold">{fav.calories}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Protein</p>
                            <p className="font-semibold">{fav.protein}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Carbs</p>
                            <p className="font-semibold">{fav.carbs}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fat</p>
                            <p className="font-semibold">{fav.fat}g</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFavorite(fav.id)}
                          className="flex-shrink-0"
                        >
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddFavoriteFood(fav)}
                          className="gap-2 flex-shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    No favorite foods yet. Add foods from search results!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
