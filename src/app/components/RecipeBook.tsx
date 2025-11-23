"use client";

import { useState, useEffect } from "react";
import { BookOpen, Heart, Search, Clock, Users, ChefHat, Filter } from "lucide-react";
import { recipesDatabase, Recipe } from "../data/recipes";

export function RecipeBook() {
  const [recipes] = useState<Recipe[]>(recipesDatabase);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [calorieFilter, setCalorieFilter] = useState<"all" | "low" | "medium" | "high">("all");

  useEffect(() => {
    const saved = localStorage.getItem("favoriteRecipes");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = favorites.includes(recipeId)
      ? favorites.filter((id) => id !== recipeId)
      : [...favorites, recipeId];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteRecipes", JSON.stringify(newFavorites));
  };

  const categories = ["Todas", ...new Set(recipes.map((r) => r.category))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Todas" || recipe.category === selectedCategory;
    
    let matchesCalories = true;
    if (calorieFilter === "low") matchesCalories = recipe.calories < 200;
    if (calorieFilter === "medium") matchesCalories = recipe.calories >= 200 && recipe.calories < 400;
    if (calorieFilter === "high") matchesCalories = recipe.calories >= 400;
    
    return matchesSearch && matchesCategory && matchesCalories;
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Livro de Receitas</h2>
        </div>
        <p className="text-orange-100">Mais de 500 receitas saudáveis, incluindo doces fitness!</p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span>{recipes.length} receitas disponíveis</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-white" />
            <span>{favorites.length} favoritas</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar receitas ou ingredientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Calorie Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Calorias
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCalorieFilter("all")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  calorieFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setCalorieFilter("low")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  calorieFilter === "low"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Baixa (&lt;200 cal)
              </button>
              <button
                onClick={() => setCalorieFilter("medium")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  calorieFilter === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Média (200-400 cal)
              </button>
              <button
                onClick={() => setCalorieFilter("high")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  calorieFilter === "high"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Alta (&gt;400 cal)
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      {!selectedRecipe ? (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-400 px-2">
            Mostrando {filteredRecipes.length} receita(s)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {recipe.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(recipe.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} porção(ões)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ChefHat className="w-4 h-4" />
                    <span>{recipe.calories} calorias</span>
                  </div>
                </div>

                {recipe.protein && recipe.carbs && recipe.fats && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Proteína:</span>
                        <span className="font-semibold">{recipe.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carboidratos:</span>
                        <span className="font-semibold">{recipe.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gorduras:</span>
                        <span className="font-semibold">{recipe.fats}g</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300">{recipe.benefits}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Recipe Detail */
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="mb-4 px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            ← Voltar
          </button>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {selectedRecipe.name}
              </h2>
              <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium rounded-full">
                {selectedRecipe.category}
              </span>
            </div>
            <button
              onClick={() => toggleFavorite(selectedRecipe.id)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorites.includes(selectedRecipe.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Tempo</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {selectedRecipe.prepTime} min
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Porções</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {selectedRecipe.servings}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 text-center">
              <ChefHat className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Calorias</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {selectedRecipe.calories}
              </p>
            </div>
          </div>

          {selectedRecipe.protein && selectedRecipe.carbs && selectedRecipe.fats && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Informação Nutricional</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedRecipe.protein}g</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Proteína</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{selectedRecipe.carbs}g</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Carboidratos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedRecipe.fats}g</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Gorduras</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Benefícios</h3>
            <p className="text-sm text-green-700 dark:text-green-300">{selectedRecipe.benefits}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Ingredientes</h3>
            <ul className="space-y-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Modo de Preparo
            </h3>
            <ol className="space-y-3">
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhuma receita encontrada</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Tente ajustar os filtros</p>
        </div>
      )}
    </div>
  );
}
