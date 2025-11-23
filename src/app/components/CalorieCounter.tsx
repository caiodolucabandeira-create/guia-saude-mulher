"use client";

import { useState, useEffect } from "react";
import { Activity, Plus, Trash2, TrendingUp, Apple, Coffee, Utensils } from "lucide-react";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
}

export function CalorieCounter() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    meal: "breakfast" as const,
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const saved = localStorage.getItem("calorieEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntries = (newEntries: FoodEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem("calorieEntries", JSON.stringify(newEntries));
  };

  const addEntry = () => {
    if (!newEntry.name || newEntry.calories <= 0) return;

    const entry: FoodEntry = {
      id: Date.now().toString(),
      ...newEntry,
      date: selectedDate,
    };

    saveEntries([...entries, entry]);
    setNewEntry({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      meal: "breakfast",
    });
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  const getTodayEntries = () => {
    return entries.filter((e) => e.date === selectedDate);
  };

  const getTotals = () => {
    const todayEntries = getTodayEntries();
    return todayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fats: acc.fats + entry.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const getEntriesByMeal = (meal: string) => {
    return getTodayEntries().filter((e) => e.meal === meal);
  };

  const totals = getTotals();

  const mealIcons = {
    breakfast: Coffee,
    lunch: Utensils,
    dinner: Utensils,
    snack: Apple,
  };

  const mealLabels = {
    breakfast: "Café da Manhã",
    lunch: "Almoço",
    dinner: "Jantar",
    snack: "Lanche",
  };

  const mealColors = {
    breakfast: "from-amber-400 to-orange-500",
    lunch: "from-emerald-400 to-teal-500",
    dinner: "from-blue-400 to-indigo-500",
    snack: "from-pink-400 to-rose-500",
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Contador de Calorias</h2>
        </div>
        <p className="text-purple-100">Registre suas refeições e acompanhe sua nutrição</p>
      </div>

      {/* Date Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Data</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Daily Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calorias</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totals.calories}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Proteínas</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totals.protein}g</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Carboidratos</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totals.carbs}g</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gorduras</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totals.fats}g</p>
          </div>
        </div>
      </div>

      {/* Add Entry Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        Adicionar Alimento
      </button>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Novo Alimento</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do Alimento
              </label>
              <input
                type="text"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Ex: Arroz integral"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refeição
              </label>
              <select
                value={newEntry.meal}
                onChange={(e) => setNewEntry({ ...newEntry, meal: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="breakfast">Café da Manhã</option>
                <option value="lunch">Almoço</option>
                <option value="dinner">Jantar</option>
                <option value="snack">Lanche</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calorias
                </label>
                <input
                  type="number"
                  value={newEntry.calories || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, calories: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  value={newEntry.protein || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, protein: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Carboidratos (g)
                </label>
                <input
                  type="number"
                  value={newEntry.carbs || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, carbs: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gorduras (g)
                </label>
                <input
                  type="number"
                  value={newEntry.fats || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, fats: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={addEntry}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meals List */}
      {["breakfast", "lunch", "dinner", "snack"].map((meal) => {
        const mealEntries = getEntriesByMeal(meal);
        if (mealEntries.length === 0) return null;

        const MealIcon = mealIcons[meal as keyof typeof mealIcons];
        const mealColor = mealColors[meal as keyof typeof mealColors];

        return (
          <div key={meal} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${mealColor} rounded-full flex items-center justify-center`}>
                <MealIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {mealLabels[meal as keyof typeof mealLabels]}
              </h3>
            </div>

            <div className="space-y-2">
              {mealEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{entry.name}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>{entry.calories} cal</span>
                      <span>P: {entry.protein}g</span>
                      <span>C: {entry.carbs}g</span>
                      <span>G: {entry.fats}g</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {getTodayEntries().length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum alimento registrado hoje</p>
        </div>
      )}
    </div>
  );
}
