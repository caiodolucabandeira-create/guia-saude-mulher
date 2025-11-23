"use client";

import { useState, useEffect } from "react";
import { Calendar, Heart, Utensils, Activity, BookOpen, User, Syringe } from "lucide-react";
import { CycleTracker } from "./components/CycleTracker";
import { DietPlanner } from "./components/DietPlanner";
import { CalorieCounter } from "./components/CalorieCounter";
import { RecipeBook } from "./components/RecipeBook";
import { MenopauseTracker } from "./components/MenopauseTracker";
import { OzempicTracker } from "./components/OzempicTracker";
import { ProfileSetup } from "./components/ProfileSetup";

type Tab = "cycle" | "diet" | "calories" | "recipes" | "menopause" | "ozempic" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("cycle");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    setHasProfile(!!profile);
    if (!profile) {
      setActiveTab("profile");
    }
  }, []);

  const tabs = [
    { id: "cycle" as Tab, label: "Ciclo", icon: Calendar, color: "from-pink-400 to-rose-500" },
    { id: "diet" as Tab, label: "Dieta", icon: Utensils, color: "from-emerald-400 to-teal-500" },
    { id: "calories" as Tab, label: "Calorias", icon: Activity, color: "from-purple-400 to-pink-500" },
    { id: "recipes" as Tab, label: "Receitas", icon: BookOpen, color: "from-orange-400 to-amber-500" },
    { id: "menopause" as Tab, label: "Menopausa", icon: Heart, color: "from-cyan-400 to-blue-500" },
    { id: "ozempic" as Tab, label: "Ozempic", icon: Syringe, color: "from-teal-400 to-emerald-500" },
    { id: "profile" as Tab, label: "Perfil", icon: User, color: "from-indigo-400 to-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-pink-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Bem-Estar Feminino
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Seu guia de saúde completo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Mobile Optimized */}
      <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-[73px] z-40 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {!hasProfile && activeTab !== "profile" && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                Complete seu perfil para personalizar sua experiência!
              </p>
            </div>
          )}

          {activeTab === "cycle" && <CycleTracker />}
          {activeTab === "diet" && <DietPlanner />}
          {activeTab === "calories" && <CalorieCounter />}
          {activeTab === "recipes" && <RecipeBook />}
          {activeTab === "menopause" && <MenopauseTracker />}
          {activeTab === "ozempic" && <OzempicTracker />}
          {activeTab === "profile" && <ProfileSetup onComplete={() => setHasProfile(true)} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Feito com <Heart className="w-4 h-4 inline text-pink-500" /> para o bem-estar feminino
          </p>
        </div>
      </footer>
    </div>
  );
}
