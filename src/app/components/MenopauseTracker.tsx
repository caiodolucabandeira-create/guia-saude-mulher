"use client";

import { useState, useEffect } from "react";
import { Heart, Thermometer, Moon, Droplet, Activity, TrendingUp, AlertCircle } from "lucide-react";

interface MenopauseData {
  isInMenopause: boolean;
  startDate: string;
  symptoms: {
    hotFlashes: number;
    nightSweats: number;
    moodChanges: number;
    sleepIssues: number;
    weightGain: number;
  };
  treatments: string[];
  notes: string;
  lastSymptomDate: string;
}

export function MenopauseTracker() {
  const [menopauseData, setMenopauseData] = useState<MenopauseData>({
    isInMenopause: false,
    startDate: "",
    symptoms: {
      hotFlashes: 0,
      nightSweats: 0,
      moodChanges: 0,
      sleepIssues: 0,
      weightGain: 0,
    },
    treatments: [],
    notes: "",
    lastSymptomDate: "",
  });

  const [showSymptomLog, setShowSymptomLog] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState({
    hotFlashes: false,
    nightSweats: false,
    moodChanges: false,
    sleepIssues: false,
    weightGain: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("menopauseData");
    if (saved) {
      setMenopauseData(JSON.parse(saved));
    }
  }, []);

  const saveMenopauseData = (data: MenopauseData) => {
    setMenopauseData(data);
    localStorage.setItem("menopauseData", JSON.stringify(data));
  };

  const logSymptoms = () => {
    const newSymptoms = { ...menopauseData.symptoms };
    if (todaySymptoms.hotFlashes) newSymptoms.hotFlashes++;
    if (todaySymptoms.nightSweats) newSymptoms.nightSweats++;
    if (todaySymptoms.moodChanges) newSymptoms.moodChanges++;
    if (todaySymptoms.sleepIssues) newSymptoms.sleepIssues++;
    if (todaySymptoms.weightGain) newSymptoms.weightGain++;

    saveMenopauseData({
      ...menopauseData,
      symptoms: newSymptoms,
      lastSymptomDate: new Date().toISOString().split("T")[0],
    });

    setTodaySymptoms({
      hotFlashes: false,
      nightSweats: false,
      moodChanges: false,
      sleepIssues: false,
      weightGain: false,
    });
    setShowSymptomLog(false);
  };

  const toggleTreatment = (treatment: string) => {
    const treatments = menopauseData.treatments.includes(treatment)
      ? menopauseData.treatments.filter((t) => t !== treatment)
      : [...menopauseData.treatments, treatment];
    saveMenopauseData({ ...menopauseData, treatments });
  };

  const symptoms = [
    { key: "hotFlashes", label: "Ondas de Calor", icon: Thermometer, color: "text-red-500" },
    { key: "nightSweats", label: "Suores Noturnos", icon: Moon, color: "text-blue-500" },
    { key: "moodChanges", label: "Mudanças de Humor", icon: Activity, color: "text-purple-500" },
    { key: "sleepIssues", label: "Problemas de Sono", icon: Moon, color: "text-indigo-500" },
    { key: "weightGain", label: "Ganho de Peso", icon: TrendingUp, color: "text-orange-500" },
  ];

  const treatmentOptions = [
    "Terapia Hormonal",
    "Suplementos Naturais",
    "Exercícios Regulares",
    "Dieta Balanceada",
    "Meditação/Yoga",
    "Acupuntura",
    "Fitoterapia",
  ];

  const dietTips = [
    "Aumente o consumo de cálcio e vitamina D para saúde óssea",
    "Inclua alimentos ricos em fitoestrógenos (soja, linhaça)",
    "Reduza cafeína e álcool para diminuir ondas de calor",
    "Mantenha-se hidratada para controlar suores",
    "Consuma proteínas magras para manter massa muscular",
    "Evite alimentos processados e açúcares refinados",
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Acompanhamento da Menopausa</h2>
        </div>
        <p className="text-cyan-100">Monitore sintomas e adapte sua rotina</p>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="inMenopause"
              checked={menopauseData.isInMenopause}
              onChange={(e) => saveMenopauseData({ ...menopauseData, isInMenopause: e.target.checked })}
              className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
            />
            <label htmlFor="inMenopause" className="text-gray-700 dark:text-gray-300 font-medium">
              Estou na menopausa
            </label>
          </div>

          {menopauseData.isInMenopause && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                value={menopauseData.startDate}
                onChange={(e) => saveMenopauseData({ ...menopauseData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {menopauseData.isInMenopause && (
        <>
          {/* Symptoms Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sintomas</h3>
              <button
                onClick={() => setShowSymptomLog(!showSymptomLog)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Registrar Hoje
              </button>
            </div>

            {showSymptomLog && (
              <div className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selecione os sintomas de hoje:
                </p>
                {symptoms.map((symptom) => (
                  <div key={symptom.key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`today-${symptom.key}`}
                      checked={todaySymptoms[symptom.key as keyof typeof todaySymptoms]}
                      onChange={(e) =>
                        setTodaySymptoms({ ...todaySymptoms, [symptom.key]: e.target.checked })
                      }
                      className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                    />
                    <label
                      htmlFor={`today-${symptom.key}`}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      {symptom.label}
                    </label>
                  </div>
                ))}
                <button
                  onClick={logSymptoms}
                  className="w-full mt-3 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom) => {
                const Icon = symptom.icon;
                const count = menopauseData.symptoms[symptom.key as keyof typeof menopauseData.symptoms];
                return (
                  <div
                    key={symptom.key}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <Icon className={`w-6 h-6 ${symptom.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {symptom.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {count} registro(s)
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Treatments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Tratamentos Atuais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {treatmentOptions.map((treatment) => (
                <button
                  key={treatment}
                  onClick={() => toggleTreatment(treatment)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    menopauseData.treatments.includes(treatment)
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-cyan-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        menopauseData.treatments.includes(treatment)
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {menopauseData.treatments.includes(treatment) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        menopauseData.treatments.includes(treatment)
                          ? "text-cyan-700 dark:text-cyan-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {treatment}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Diet Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Droplet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Dicas de Alimentação
              </h3>
            </div>
            
            <div className="space-y-3">
              {dietTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Anotações Pessoais
            </h3>
            
            <textarea
              value={menopauseData.notes}
              onChange={(e) => saveMenopauseData({ ...menopauseData, notes: e.target.value })}
              placeholder="Registre observações sobre sintomas, tratamentos, ou qualquer outra informação relevante..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
            />
          </div>
        </>
      )}

      {!menopauseData.isInMenopause && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center">
          <Heart className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Acompanhamento da Menopausa
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Marque a opção acima quando entrar na menopausa para começar a monitorar seus sintomas e
            receber dicas personalizadas.
          </p>
        </div>
      )}
    </div>
  );
}
