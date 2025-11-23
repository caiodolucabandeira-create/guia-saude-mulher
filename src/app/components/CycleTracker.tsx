"use client";

import { useState, useEffect } from "react";
import { Calendar, Heart, Droplet, Moon, Sun, Plus, Shield, Activity, Thermometer, Wind, Zap, Brain, AlertCircle } from "lucide-react";

interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  sexualActivity: { date: string; protected: boolean; notes?: string }[];
  contraceptive: string;
  symptoms: { date: string; symptoms: string[] }[];
  flow: { date: string; intensity: "light" | "medium" | "heavy" }[];
  mood: { date: string; mood: string }[];
  cervicalMucus: { date: string; type: string }[];
  basalTemperature: { date: string; temp: number }[];
  notes: { date: string; note: string }[];
}

export function CycleTracker() {
  const [cycleData, setCycleData] = useState<CycleData>({
    lastPeriodDate: "",
    cycleLength: 28,
    periodLength: 5,
    sexualActivity: [],
    contraceptive: "",
    symptoms: [],
    flow: [],
    mood: [],
    cervicalMucus: [],
    basalTemperature: [],
    notes: [],
  });

  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityDate, setActivityDate] = useState("");
  const [isProtected, setIsProtected] = useState(true);
  const [activityNotes, setActivityNotes] = useState("");

  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [symptomDate, setSymptomDate] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const [showAddFlow, setShowAddFlow] = useState(false);
  const [flowDate, setFlowDate] = useState("");
  const [flowIntensity, setFlowIntensity] = useState<"light" | "medium" | "heavy">("medium");

  const [showAddMood, setShowAddMood] = useState(false);
  const [moodDate, setMoodDate] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const [showAddTemp, setShowAddTemp] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [temperature, setTemperature] = useState("");

  const [showAddNote, setShowAddNote] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cycleData");
    if (saved) {
      setCycleData(JSON.parse(saved));
    }
  }, []);

  const saveCycleData = (data: CycleData) => {
    setCycleData(data);
    localStorage.setItem("cycleData", JSON.stringify(data));
  };

  const calculateNextPeriod = () => {
    if (!cycleData.lastPeriodDate) return null;
    const lastDate = new Date(cycleData.lastPeriodDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + cycleData.cycleLength);
    return nextDate;
  };

  const calculateOvulation = () => {
    if (!cycleData.lastPeriodDate) return null;
    const lastDate = new Date(cycleData.lastPeriodDate);
    const ovulationDate = new Date(lastDate);
    ovulationDate.setDate(ovulationDate.getDate() + Math.floor(cycleData.cycleLength / 2));
    return ovulationDate;
  };

  const calculateFertileWindow = () => {
    if (!cycleData.lastPeriodDate) return null;
    const ovulation = calculateOvulation();
    if (!ovulation) return null;
    
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return { start: fertileStart, end: fertileEnd };
  };

  const getDaysUntil = (date: Date | null) => {
    if (!date) return null;
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCurrentPhase = () => {
    if (!cycleData.lastPeriodDate) return "Não definido";
    const lastDate = new Date(cycleData.lastPeriodDate);
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = daysSince % cycleData.cycleLength;

    if (cycleDay <= cycleData.periodLength) return "Menstruação";
    if (cycleDay <= 14) return "Fase Folicular";
    if (cycleDay <= 16) return "Ovulação";
    return "Fase Lútea";
  };

  const getPhaseDescription = () => {
    const phase = getCurrentPhase();
    const descriptions: Record<string, string> = {
      "Menstruação": "Período menstrual - Descanse e hidrate-se bem",
      "Fase Folicular": "Energia crescente - Ótimo para novos projetos",
      "Ovulação": "Pico de energia e fertilidade",
      "Fase Lútea": "Prepare-se para a TPM - Autocuidado é essencial",
      "Não definido": "Configure sua última menstruação abaixo"
    };
    return descriptions[phase] || "";
  };

  const addSexualActivity = () => {
    if (!activityDate) return;
    const newActivity = { date: activityDate, protected: isProtected, notes: activityNotes };
    saveCycleData({
      ...cycleData,
      sexualActivity: [...cycleData.sexualActivity, newActivity].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
    setActivityDate("");
    setActivityNotes("");
    setShowAddActivity(false);
  };

  const addSymptom = () => {
    if (!symptomDate || selectedSymptoms.length === 0) return;
    saveCycleData({
      ...cycleData,
      symptoms: [...cycleData.symptoms, { date: symptomDate, symptoms: selectedSymptoms }].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
    setSymptomDate("");
    setSelectedSymptoms([]);
    setShowAddSymptom(false);
  };

  const addFlow = () => {
    if (!flowDate) return;
    saveCycleData({
      ...cycleData,
      flow: [...cycleData.flow, { date: flowDate, intensity: flowIntensity }].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
    setFlowDate("");
    setShowAddFlow(false);
  };

  const addMood = () => {
    if (!moodDate || !selectedMood) return;
    saveCycleData({
      ...cycleData,
      mood: [...cycleData.mood, { date: moodDate, mood: selectedMood }].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
    setMoodDate("");
    setSelectedMood("");
    setShowAddMood(false);
  };

  const addTemperature = () => {
    if (!tempDate || !temperature) return;
    saveCycleData({
      ...cycleData,
      basalTemperature: [...cycleData.basalTemperature, { date: tempDate, temp: parseFloat(temperature) }].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
    setTempDate("");
    setTemperature("");
    setShowAddTemp(false);
  };

  const addNote = () => {
    if (!noteDate || !noteText) return;
    saveCycleData({
      ...cycleData,
      notes: [...cycleData.notes, { date: noteDate, note: noteText }].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
    setNoteDate("");
    setNoteText("");
    setShowAddNote(false);
  };

  const nextPeriod = calculateNextPeriod();
  const ovulation = calculateOvulation();
  const fertileWindow = calculateFertileWindow();
  const daysUntilPeriod = getDaysUntil(nextPeriod);
  const currentPhase = getCurrentPhase();

  const symptomOptions = [
    "Cólicas", "Dor de cabeça", "Inchaço", "Acne", "Sensibilidade nos seios",
    "Fadiga", "Náusea", "Dor nas costas", "Alterações de humor", "Insônia",
    "Ansiedade", "Irritabilidade", "Compulsão alimentar", "Tontura"
  ];

  const moodOptions = [
    "Feliz 😊", "Triste 😢", "Irritada 😠", "Ansiosa 😰", "Calma 😌",
    "Energética ⚡", "Cansada 😴", "Estressada 😫", "Apaixonada 😍", "Neutra 😐"
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Acompanhamento do Ciclo</h2>
        </div>
        <p className="text-pink-100">Monitore seu ciclo menstrual e saúde reprodutiva com detalhes</p>
      </div>

      {/* Current Phase Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-pink-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fase Atual</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
            <Activity className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span className="font-semibold text-pink-600 dark:text-pink-400">{currentPhase}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
          {getPhaseDescription()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Próxima Menstruação</span>
            </div>
            {nextPeriod ? (
              <div>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {daysUntilPeriod !== null && daysUntilPeriod >= 0 ? `${daysUntilPeriod} dias` : "Atrasada"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {nextPeriod.toLocaleDateString("pt-BR")}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Configure abaixo</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ovulação Prevista</span>
            </div>
            {ovulation ? (
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {getDaysUntil(ovulation) !== null && getDaysUntil(ovulation)! >= 0 
                    ? `${getDaysUntil(ovulation)} dias` 
                    : "Passou"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {ovulation.toLocaleDateString("pt-BR")}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Configure abaixo</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Janela Fértil</span>
            </div>
            {fertileWindow ? (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {fertileWindow.start.toLocaleDateString("pt-BR")} - {fertileWindow.end.toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                  ~6 dias férteis
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Configure abaixo</p>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Configurações do Ciclo</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data da Última Menstruação
            </label>
            <input
              type="date"
              value={cycleData.lastPeriodDate}
              onChange={(e) => saveCycleData({ ...cycleData, lastPeriodDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duração do Ciclo (dias)
              </label>
              <input
                type="number"
                value={cycleData.cycleLength}
                onChange={(e) => saveCycleData({ ...cycleData, cycleLength: parseInt(e.target.value) || 28 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200"
                min="21"
                max="35"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duração da Menstruação (dias)
              </label>
              <input
                type="number"
                value={cycleData.periodLength}
                onChange={(e) => saveCycleData({ ...cycleData, periodLength: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200"
                min="3"
                max="7"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Método Contraceptivo
            </label>
            <select
              value={cycleData.contraceptive}
              onChange={(e) => saveCycleData({ ...cycleData, contraceptive: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="">Nenhum</option>
              <option value="pill">Pílula</option>
              <option value="iud">DIU</option>
              <option value="implant">Implante</option>
              <option value="injection">Injeção</option>
              <option value="condom">Preservativo</option>
              <option value="natural">Métodos Naturais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sexual Activity Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Atividade Sexual</h3>
          <button
            onClick={() => setShowAddActivity(!showAddActivity)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Adicionar</span>
          </button>
        </div>

        {showAddActivity && (
          <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="protected"
                checked={isProtected}
                onChange={(e) => setIsProtected(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <label htmlFor="protected" className="text-sm text-gray-700 dark:text-gray-300">
                Relação protegida
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações (opcional)</label>
              <input
                type="text"
                value={activityNotes}
                onChange={(e) => setActivityNotes(e.target.value)}
                placeholder="Ex: Usamos preservativo"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <button
              onClick={addSexualActivity}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cycleData.sexualActivity.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum registro ainda</p>
          ) : (
            cycleData.sexualActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      {new Date(activity.date).toLocaleDateString("pt-BR")}
                    </span>
                    {activity.notes && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.notes}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activity.protected ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Protegida</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Desprotegida</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Symptoms Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sintomas</h3>
          <button
            onClick={() => setShowAddSymptom(!showAddSymptom)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Registrar</span>
          </button>
        </div>

        {showAddSymptom && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
              <input
                type="date"
                value={symptomDate}
                onChange={(e) => setSymptomDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sintomas</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {symptomOptions.map((symptom) => (
                  <label key={symptom} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSymptoms([...selectedSymptoms, symptom]);
                        } else {
                          setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                        }
                      }}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={addSymptom}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cycleData.symptoms.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum sintoma registrado</p>
          ) : (
            cycleData.symptoms.map((entry, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {entry.symptoms.map((symptom, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Flow Intensity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Intensidade do Fluxo</h3>
          <button
            onClick={() => setShowAddFlow(!showAddFlow)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Registrar</span>
          </button>
        </div>

        {showAddFlow && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
              <input
                type="date"
                value={flowDate}
                onChange={(e) => setFlowDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Intensidade</label>
              <div className="grid grid-cols-3 gap-2">
                {(["light", "medium", "heavy"] as const).map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => setFlowIntensity(intensity)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      flowIntensity === intensity
                        ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {intensity === "light" ? "Leve" : intensity === "medium" ? "Médio" : "Intenso"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addFlow}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cycleData.flow.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum registro de fluxo</p>
          ) : (
            cycleData.flow.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Droplet className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  entry.intensity === "light" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                  entry.intensity === "medium" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {entry.intensity === "light" ? "Leve" : entry.intensity === "medium" ? "Médio" : "Intenso"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mood Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Humor</h3>
          <button
            onClick={() => setShowAddMood(!showAddMood)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Registrar</span>
          </button>
        </div>

        {showAddMood && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
              <input
                type="date"
                value={moodDate}
                onChange={(e) => setMoodDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Como você está se sentindo?</label>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedMood === mood
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mood}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addMood}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cycleData.mood.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum registro de humor</p>
          ) : (
            cycleData.mood.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.mood}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Basal Temperature */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Temperatura Basal</h3>
          <button
            onClick={() => setShowAddTemp(!showAddTemp)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Registrar</span>
          </button>
        </div>

        {showAddTemp && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="Ex: 36.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <button
              onClick={addTemperature}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cycleData.basalTemperature.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum registro de temperatura</p>
          ) : (
            cycleData.basalTemperature.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{entry.temp.toFixed(1)}°C</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Anotações</h3>
          <button
            onClick={() => setShowAddNote(!showAddNote)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Adicionar</span>
          </button>
        </div>

        {showAddNote && (
          <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
              <input
                type="date"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Anotação</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escreva suas observações..."
                className="w-full h-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
              />
            </div>
            <button
              onClick={addNote}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cycleData.notes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma anotação ainda</p>
          ) : (
            cycleData.notes.map((entry, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{entry.note}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
