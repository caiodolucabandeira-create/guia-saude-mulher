"use client";

import { useState, useEffect } from "react";
import { Utensils, Target, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

interface DietPlan {
  goal: "lose" | "gain" | "maintain";
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealPlan: string[];
}

export function DietPlanner() {
  const [dietPlan, setDietPlan] = useState<DietPlan>({
    goal: "maintain",
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    age: 0,
    activityLevel: "moderate",
    dailyCalories: 0,
    macros: { protein: 0, carbs: 0, fats: 0 },
    mealPlan: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("dietPlan");
    if (saved) {
      setDietPlan(JSON.parse(saved));
    }
  }, []);

  const saveDietPlan = (data: DietPlan) => {
    setDietPlan(data);
    localStorage.setItem("dietPlan", JSON.stringify(data));
  };

  const calculateBMR = () => {
    // Fórmula de Mifflin-St Jeor para mulheres
    if (!dietPlan.currentWeight || !dietPlan.height || !dietPlan.age) return 0;
    return (10 * dietPlan.currentWeight) + (6.25 * dietPlan.height) - (5 * dietPlan.age) - 161;
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return Math.round(bmr * activityMultipliers[dietPlan.activityLevel]);
  };

  const calculateDailyCalories = () => {
    const tdee = calculateTDEE();
    if (dietPlan.goal === "lose") return tdee - 500;
    if (dietPlan.goal === "gain") return tdee + 300;
    return tdee;
  };

  const calculateMacros = (calories: number) => {
    // Distribuição padrão: 30% proteína, 40% carboidratos, 30% gorduras
    return {
      protein: Math.round((calories * 0.3) / 4), // 4 cal/g
      carbs: Math.round((calories * 0.4) / 4),
      fats: Math.round((calories * 0.3) / 9), // 9 cal/g
    };
  };

  const generatePlan = () => {
    const calories = calculateDailyCalories();
    const macros = calculateMacros(calories);
    
    const mealPlans = {
      lose: [
        "Café da manhã: Omelete com vegetais + chá verde",
        "Lanche: Iogurte natural com frutas vermelhas",
        "Almoço: Peito de frango grelhado + salada + arroz integral",
        "Lanche: Castanhas (porção pequena)",
        "Jantar: Peixe assado + legumes no vapor",
      ],
      gain: [
        "Café da manhã: Panquecas de aveia + pasta de amendoim + banana",
        "Lanche: Smoothie de proteína com frutas",
        "Almoço: Carne magra + batata doce + salada + azeite",
        "Lanche: Sanduíche natural + suco natural",
        "Jantar: Frango + arroz + feijão + abacate",
        "Ceia: Iogurte grego com granola",
      ],
      maintain: [
        "Café da manhã: Pão integral + ovo + frutas",
        "Lanche: Frutas + oleaginosas",
        "Almoço: Proteína magra + carboidrato + vegetais",
        "Lanche: Iogurte + aveia",
        "Jantar: Refeição balanceada similar ao almoço",
      ],
    };

    saveDietPlan({
      ...dietPlan,
      dailyCalories: calories,
      macros,
      mealPlan: mealPlans[dietPlan.goal],
    });
  };

  const goalIcons = {
    lose: TrendingDown,
    gain: TrendingUp,
    maintain: Minus,
  };

  const goalColors = {
    lose: "from-red-400 to-pink-500",
    gain: "from-green-400 to-emerald-500",
    maintain: "from-blue-400 to-cyan-500",
  };

  const GoalIcon = goalIcons[dietPlan.goal];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className={`bg-gradient-to-br ${goalColors[dietPlan.goal]} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex items-center gap-3 mb-4">
          <Utensils className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Planejamento Alimentar</h2>
        </div>
        <p className="text-white/90">Dieta personalizada para seus objetivos</p>
      </div>

      {/* Goal Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Seu Objetivo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => saveDietPlan({ ...dietPlan, goal: "lose" })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              dietPlan.goal === "lose"
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-red-300"
            }`}
          >
            <TrendingDown className={`w-8 h-8 mx-auto mb-2 ${
              dietPlan.goal === "lose" ? "text-red-500" : "text-gray-400"
            }`} />
            <p className={`font-semibold ${
              dietPlan.goal === "lose" ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
            }`}>
              Emagrecer
            </p>
          </button>

          <button
            onClick={() => saveDietPlan({ ...dietPlan, goal: "maintain" })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              dietPlan.goal === "maintain"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
            }`}
          >
            <Minus className={`w-8 h-8 mx-auto mb-2 ${
              dietPlan.goal === "maintain" ? "text-blue-500" : "text-gray-400"
            }`} />
            <p className={`font-semibold ${
              dietPlan.goal === "maintain" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            }`}>
              Manter
            </p>
          </button>

          <button
            onClick={() => saveDietPlan({ ...dietPlan, goal: "gain" })}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              dietPlan.goal === "gain"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-green-300"
            }`}
          >
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${
              dietPlan.goal === "gain" ? "text-green-500" : "text-gray-400"
            }`} />
            <p className={`font-semibold ${
              dietPlan.goal === "gain" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
            }`}>
              Ganhar Peso
            </p>
          </button>
        </div>

        {/* Personal Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso Atual (kg)
            </label>
            <input
              type="number"
              value={dietPlan.currentWeight || ""}
              onChange={(e) => saveDietPlan({ ...dietPlan, currentWeight: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Ex: 65"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso Desejado (kg)
            </label>
            <input
              type="number"
              value={dietPlan.targetWeight || ""}
              onChange={(e) => saveDietPlan({ ...dietPlan, targetWeight: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Ex: 60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              value={dietPlan.height || ""}
              onChange={(e) => saveDietPlan({ ...dietPlan, height: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Ex: 165"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idade
            </label>
            <input
              type="number"
              value={dietPlan.age || ""}
              onChange={(e) => saveDietPlan({ ...dietPlan, age: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Ex: 30"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nível de Atividade
          </label>
          <select
            value={dietPlan.activityLevel}
            onChange={(e) => saveDietPlan({ ...dietPlan, activityLevel: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
            <option value="light">Leve (exercício 1-3x/semana)</option>
            <option value="moderate">Moderado (exercício 3-5x/semana)</option>
            <option value="active">Ativo (exercício 6-7x/semana)</option>
            <option value="veryActive">Muito Ativo (exercício intenso diário)</option>
          </select>
        </div>

        <button
          onClick={generatePlan}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Gerar Plano Alimentar
        </button>
      </div>

      {/* Results */}
      {dietPlan.dailyCalories > 0 && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Suas Metas Diárias</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Calorias</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dietPlan.dailyCalories}
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Proteínas</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {dietPlan.macros.protein}g
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Carboidratos</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {dietPlan.macros.carbs}g
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Gorduras</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dietPlan.macros.fats}g
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Sugestão de Refeições</h3>
            
            <div className="space-y-3">
              {dietPlan.mealPlan.map((meal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl"
                >
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{meal}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
