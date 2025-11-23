"use client";

import { useState, useEffect } from "react";
import { User, Save, CheckCircle } from "lucide-react";

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  lifeStage: "adolescent" | "adult" | "perimenopause" | "menopause" | "postmenopause";
  healthGoals: string[];
  allergies: string;
  medicalConditions: string;
}

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    lifeStage: "adult",
    healthGoals: [],
    allergies: "",
    medicalConditions: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onComplete();
    }, 1500);
  };

  const toggleGoal = (goal: string) => {
    const goals = profile.healthGoals.includes(goal)
      ? profile.healthGoals.filter((g) => g !== goal)
      : [...profile.healthGoals, goal];
    setProfile({ ...profile, healthGoals: goals });
  };

  const lifeStages = [
    { value: "adolescent", label: "Adolescência (13-19 anos)" },
    { value: "adult", label: "Adulta (20-40 anos)" },
    { value: "perimenopause", label: "Perimenopausa (40-50 anos)" },
    { value: "menopause", label: "Menopausa (50+ anos)" },
    { value: "postmenopause", label: "Pós-menopausa" },
  ];

  const healthGoalOptions = [
    "Perder peso",
    "Ganhar peso",
    "Manter peso",
    "Melhorar saúde hormonal",
    "Aumentar energia",
    "Melhorar sono",
    "Reduzir estresse",
    "Fortalecer ossos",
    "Melhorar digestão",
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Seu Perfil</h2>
        </div>
        <p className="text-indigo-100">Configure suas informações para uma experiência personalizada</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Informações Pessoais
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Seu nome"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idade
              </label>
              <input
                type="number"
                value={profile.age || ""}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Ex: 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                value={profile.height || ""}
                onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Ex: 165"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={profile.weight || ""}
                onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Ex: 65"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Life Stage */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Fase da Vida
        </h3>
        
        <div className="space-y-2">
          {lifeStages.map((stage) => (
            <button
              key={stage.value}
              onClick={() => setProfile({ ...profile, lifeStage: stage.value as any })}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                profile.lifeStage === stage.value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    profile.lifeStage === stage.value
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {profile.lifeStage === stage.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span
                  className={`font-medium ${
                    profile.lifeStage === stage.value
                      ? "text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Health Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Objetivos de Saúde
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthGoalOptions.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                profile.healthGoals.includes(goal)
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    profile.healthGoals.includes(goal)
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {profile.healthGoals.includes(goal) && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    profile.healthGoals.includes(goal)
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {goal}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Informações Médicas
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alergias Alimentares
            </label>
            <textarea
              value={profile.allergies}
              onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
              className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
              placeholder="Liste suas alergias alimentares (ex: lactose, glúten, nozes...)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condições Médicas
            </label>
            <textarea
              value={profile.medicalConditions}
              onChange={(e) => setProfile({ ...profile, medicalConditions: e.target.value })}
              className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
              placeholder="Liste condições médicas relevantes (ex: diabetes, hipertensão, SOP...)"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveProfile}
        disabled={saved}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
          saved
            ? "bg-green-500 text-white"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
        }`}
      >
        {saved ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Perfil Salvo!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Salvar Perfil
          </>
        )}
      </button>
    </div>
  );
}
